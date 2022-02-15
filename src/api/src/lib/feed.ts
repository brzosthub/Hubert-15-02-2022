import * as constants from './constants';
import * as types from './types';
import {
    FeedListener,
    StreamingMessage,
    FeedStatus,
    FeedArgs,
    FeedChannelStatus,
} from './types';
import { getLogger } from '@trading/utils';
import FeedChannel from './feedChannel';
import { getEndpointHash } from './utils';
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';
import Med from './med';
import { config } from '@trading/utils';

const log = getLogger('feed');

class Feed {
    listener: FeedListener;
    webSocket?: WebSocket;
    status?: FeedStatus;
    error?: string;

    sendMessageQueue: Array<string> = [];
    receivedMessagesQueue: Array<StreamingMessage> = [];
    reconnectTimeoutId?: TimeoutId;
    heartTimeoutId?: TimeoutId;

    feedChannels: Record<string, FeedChannel> = {};

    flushTime = performance.now();

    perfHistory: Med = new Med(100);

    lastHeartbeatTime = 0;

    constructor(listener: types.FeedListener) {
        this.listener = listener;
    }

    connect() {
        this.webSocket = this.setupWebSocket();
        if (!this.webSocket) {
            this.setStatus('error', 'WebSocket not supported');
        } else {
            this.setStatus('created');
            this.subscribeHeartbeat();
        }
    }

    static createWebSocket(url: string) {
        /**
         * We are mocking web socket that way to have webpack working properly with cypress
         */
        if (window.Cypress && window.createMockWebSocket) {
            return window.createMockWebSocket(url);
        }
        return new WebSocket(url);
    }

    subscribe(endpoint: string, args: Record<string, any>): boolean {
        const id = getEndpointHash(endpoint, args);
        let feedChannel: FeedChannel = this.feedChannels[id];

        if (feedChannel) {
            return false;
        }

        feedChannel = new FeedChannel(id, endpoint, args, this);
        this.feedChannels[id] = feedChannel;
        feedChannel.subscribe();

        return true;
    }

    unsubscribe(endpoint: string, args: Record<string, any>) {
        const id = getEndpointHash(endpoint, args);

        const feedChannel: FeedChannel = this.feedChannels[id];

        if (!feedChannel) {
            return false;
        }

        /**
         * TODO: Feature - unsubscribe with delay
         */
        feedChannel.unsubscribe();
        delete this.feedChannels[id];

        return true;
    }

    getFeedByEvent(data: StreamingMessage) {
        const { event, feed, ...args } = data;
        const feedId = getEndpointHash(feed as string, args);
        return this.feedChannels[feedId];
    }

    send(data: StreamingMessage) {
        let message;
        try {
            message = JSON.stringify(data);
        } catch (e) {
            log.error('can no send message, parse error', message);
            return;
        }

        this.sendMessageQueue.push(message);
        this.flushSendMessages();
    }

    flushSendMessages() {
        if (this.status !== 'connected') {
            log.warn('socket not ready, skip flush of send');
            return;
        }

        log.debug(
            'flushing ',
            this.sendMessageQueue.length,
            'message(s)',
            this.sendMessageQueue
        );
        this.sendMessageQueue.forEach((message) => {
            this.webSocket?.send(message);
        });

        this.sendMessageQueue = [];
    }

    flushEndpoint(endpoint: string) {
        log.debug('flushing endpoint', endpoint);
        this.receivedMessagesQueue = this.receivedMessagesQueue.filter(
            (message) => {
                return message.feed !== endpoint;
            }
        );
    }

    isFrame?: ReturnType<typeof setTimeout>;

    flushReceivedMessages() {
        const now = performance.now();

        if (now >= this.flushTime && this.receivedMessagesQueue.length > 0) {
            const throttle = () => {
                const start = performance.now();
                /**
                 * Group messages by endpoint so that different reducers can match it
                 */
                const groupedMessages = this.receivedMessagesQueue.reduce(
                    (result, current) => {
                        if (!result[current.feed]) {
                            result[current.feed] = [];
                        }

                        result[current.feed].push(current);
                        return result;
                    },
                    {}
                );

                Object.keys(groupedMessages).forEach((endpoint) => {
                    this.listener.onMessage(
                        endpoint,
                        groupedMessages[endpoint]
                    );
                });

                // TODO: Feature - improve - we could reduce less messages per call basing on time
                const delta = performance.now() - start;
                const avgDelta = this.perfHistory.add(
                    delta / this.receivedMessagesQueue.length
                );

                // Delta could be 0 in theory
                let nextDelay =
                    avgDelta * constants.MIN_THROTTLE_TIME +
                    constants.FRAME_TIME;

                // Prevent oscillating
                nextDelay =
                    Math.floor(nextDelay / constants.MIN_THROTTLE_TIME) *
                    constants.MIN_THROTTLE_TIME;

                // Apply min max
                if (nextDelay < constants.MIN_THROTTLE_TIME) {
                    nextDelay = constants.MIN_THROTTLE_TIME;
                }

                if (nextDelay > constants.MAX_THROTTLE_TIME) {
                    nextDelay = constants.MAX_THROTTLE_TIME;
                }

                log.debug('delay', nextDelay, avgDelta);

                this.flushTime = performance.now() + nextDelay;
                this.receivedMessagesQueue = [];
            };

            // Leave like that to play around with raf
            throttle();
        } else {
            if (!this.isFrame && this.receivedMessagesQueue.length > 0) {
                //try again
                this.isFrame = setTimeout(() => {
                    this.isFrame = undefined;
                    this.flushReceivedMessages();
                }, this.flushTime - performance.now());
            }
            log.debug('skipping update');
        }
    }

    setStatus(status: types.FeedStatus, error?: string) {
        this.status = status;
        this.error = error;
        const channelIds = Object.keys(this.feedChannels);

        channelIds.forEach((channelId) => {
            const channel = this.feedChannels[channelId];
            channel.onFeedStatusChange();
        });
    }

    setupWebSocket() {
        let webSocket;
        try {
            webSocket = Feed.createWebSocket(constants.API_WEBSOCKET_URL);
            webSocket.addEventListener('open', this.handleOpen);
            webSocket.addEventListener('message', this.handleMessage);
            webSocket.addEventListener('close', this.handleClose);
            webSocket.addEventListener('error', this.handleError);
        } catch (e) {
            log.error('no WebSocket support');
        }
        return webSocket;
    }

    tearDownWebSocket(webSocket?: WebSocket) {
        if (!webSocket) {
            return;
        }
        webSocket.removeEventListener('open', this.handleOpen);
        webSocket.removeEventListener('message', this.handleMessage);
        webSocket.removeEventListener('close', this.handleClose);
        webSocket.removeEventListener('error', this.handleError);
        webSocket.close();
    }

    scheduleReconnect() {
        log.debug('reconnect scheduled');
        this.reconnectTimeoutId = setTimeout(() => {
            log.debug('reconnecting');
            this.tearDownWebSocket(this.webSocket);
            this.connect();
            this.reconnectTimeoutId = undefined;
        }, constants.RECONNECT_TIMEOUT);
    }

    subscribeHeartbeat() {
        /**
         * Start heartbeat subscribe, for proper ping / pong we would need to construct frames with opcodes :(
         */
        this.send({
            event: 'subscribe',
            feed: 'heartbeat',
        });

        this.lastHeartbeatTime = Date.now();
        this.scheduleHeartbeat();
    }

    scheduleHeartbeat(timeout: number = constants.HEARTBEAT_TIMEOUT) {
        this.heartTimeoutId = setTimeout(() => {
            const diff = Date.now() - this.lastHeartbeatTime;

            if (diff >= constants.HEARTBEAT_TIMEOUT) {
                this.stopHeartbeat();

                log.error('no heartbeat');
                this.setStatus('reconnecting');
                this.scheduleReconnect();
            } else {
                // start again
                this.scheduleHeartbeat(constants.HEARTBEAT_TIMEOUT - diff);
            }
        }, timeout);
    }

    stopHeartbeat() {
        if (this.heartTimeoutId) {
            clearTimeout(this.heartTimeoutId);
        }
    }

    updateHeartbeat() {
        this.lastHeartbeatTime = Date.now();
    }

    handleOpen = () => {
        log.debug('web socket open');
        this.setStatus('connected');
        this.flushSendMessages();
    };

    handleMessage = (evt: MessageEvent) => {
        this.updateHeartbeat();

        const message = evt.data as string;
        let data: any;
        try {
            data = JSON.parse(message);
        } catch (e) {
            log.error('error parsing data', e);
            return;
        }

        if (data.event === 'info') {
            log.info('info event received', data);
            return;
        }

        if (data.event === 'alert') {
            /**
             * Log error here, it will be handled by channel through timeout
             * Can be removed when alerts will be feed aware
             */
            log.error('alert received', data);
            return;
        }

        if (data.feed === 'heartbeat') {
            // it can happen that heartbeat will be down, but we will still get messages, just log
            const delta = Math.abs(data.time - Date.now());
            log.debug(
                'heartbeat received, server time is up',
                data.time,
                delta
            );
            return;
        }

        if (data.event) {
            if (data.feed) {
                const channel = this.getFeedByEvent(data);
                // TODO: Feature - wait for unsubscribe
                if (!channel) {
                    log.debug('received message for non existing channel');
                    return;
                }
                channel.onEventMessage(data);
                return;
            }

            log.warn('unrecognized event', data);
            return;
        }

        if (!data.event && data.feed?.endsWith('_snapshot')) {
            log.debug('received snapshot', data);
            const endpoint = data.feed.replace(/_snapshot$/, '');

            // Flush waiting messages for endpoint
            this.flushEndpoint(endpoint);

            this.listener.onSnapshot(endpoint, data);
            return;
        }

        /**
         * Handle update messages
         */
        this.receivedMessagesQueue.push(data);

        if (config.stressIt) {
            const amount = parseInt(config.stressIt) || 100;
            for (let i = 0; i < amount; i++) {
                this.receivedMessagesQueue.push(JSON.parse(message));
            }
        }

        this.flushReceivedMessages();
    };

    handleClose = (evt: CloseEvent) => {
        //https://datatracker.ietf.org/doc/html/rfc6455#section-11.7
        if (evt.code === 1001 || evt.code === 1000) {
            log.debug('closing web socket', evt.code);
            return;
        }

        log.error('unexpected close', evt.code);
        this.setStatus('reconnecting');
        this.stopHeartbeat();
        this.scheduleReconnect();
    };

    handleError = (evt: Event) => {
        log.debug('handling error', evt);
        this.setStatus('reconnecting');
        this.stopHeartbeat();
        this.scheduleReconnect();
    };

    onChannelStatusChange(
        endpoint: string,
        args: FeedArgs,
        status: FeedChannelStatus,
        error?: string
    ) {
        this.listener.onChannelStatusChange(endpoint, args, status, error);
    }
}

export default Feed;
