import { FeedArgs, FeedChannelStatus, StreamingMessage } from './types';
import Feed from './feed';
import { getLogger } from '@trading/utils/log';
import { FEED_CHANNEL_SUBSCRIBE_TIMEOUT } from './constants';

const log = getLogger('FeedChannel');

/**
 * TODO: Feature - we are accessing gere feed directly, switch to listeners
 */
class FeedChannel {
    id;
    args;
    endpoint;
    feed: Feed;
    status: FeedChannelStatus;
    error?: string;
    subscribeTimeout?: ReturnType<typeof setTimeout>;

    constructor(id: string, endpoint: string, args: FeedArgs, feed: Feed) {
        this.args = args;
        this.id = id;
        this.endpoint = endpoint;
        this.feed = feed;
        this.status = 'created';
        this.onFeedStatusChange();
    }

    subscribe() {
        if (this.status === 'subscribed' || this.status === 'subscribing') {
            log.error('already subscribed', this.toString());
            return;
        }

        if (this.status === 'error') {
            log.error('can not subscribe', this.toString());
            return;
        }

        log.debug('subscribe called', this.toString());

        this.setStatus('subscribing');
        if (this.feed.status === 'connected') {
            this.waitForSubscribe();
        }
        this.feed.send({
            event: 'subscribe',
            feed: this.endpoint,
            ...this.args,
        });
    }

    waitForSubscribe() {
        /**
         * TODO: Server side api is bad, errors returned from subscribe with bad request params do not contain
         * original args, we can no match a feed channel because of it we will use timeout for now
         */
        log.debug('waiting for subscribe');

        this.clearSubscribeTimeout();

        this.subscribeTimeout = setTimeout(() => {
            log.error('no subscribe received', this.toString());

            this.setStatus('error', 'Bad request');
            this.subscribeTimeout = undefined;
        }, FEED_CHANNEL_SUBSCRIBE_TIMEOUT);
    }

    unsubscribe() {
        this.clearSubscribeTimeout();
        this.setStatus('unsubscribed');
        this.feed.send({
            event: 'unsubscribe',
            feed: this.endpoint,
            ...this.args,
        });

        log.debug('unsubscribe called', this.toString());
        return;
    }

    setStatus(status: FeedChannelStatus, error?: string) {
        this.status = status;
        this.error = error;
        this.feed.onChannelStatusChange(
            this.endpoint,
            this.args,
            this.status,
            this.error
        );
    }

    clearSubscribeTimeout() {
        log.debug('clearSubscribeTimeout()');
        if (this.subscribeTimeout) {
            clearTimeout(this.subscribeTimeout);
            this.subscribeTimeout = undefined;
        }
    }

    onEventMessage(data: StreamingMessage) {
        const isSubscribedEvent = data.event === 'subscribed';

        if (isSubscribedEvent) {
            this.clearSubscribeTimeout();
            this.setStatus('subscribed');
            return;
        }
    }

    onFeedStatusChange() {
        const feedStatus = this.feed.status;
        log.debug('feed status changed', feedStatus);

        if (
            feedStatus === 'reconnecting' &&
            (this.status === 'subscribed' ||
                this.status === 'subscribing' ||
                this.status === 'created')
        ) {
            log.debug('switch to reconnect');
            this.clearSubscribeTimeout();
            this.setStatus('reconnecting');
            return;
        }

        if (feedStatus === 'connected' && this.status === 'reconnecting') {
            // resubscribe after connection being restored
            this.subscribe();
            return;
        }

        if (feedStatus === 'connected' && this.status === 'subscribing') {
            // wait for subscribe
            this.waitForSubscribe();
        }

        if (feedStatus === 'error') {
            this.setStatus('error', this.feed.error);
        }
    }

    toString() {
        return `id: ${this.id}, endpoint: ${this.endpoint}, error: ${this.error}, status: ${this.status}`;
    }
}

export default FeedChannel;
