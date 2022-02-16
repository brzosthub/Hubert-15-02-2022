export type FeedData<T = any> = Record<string, T>;

export type FeedArgs = FeedData;

export type FeedStatus =
    | 'connected'
    | 'connecting'
    | 'reconnecting'
    | 'error'
    | 'created';

export type FeedChannelStatus =
    | 'subscribing'
    | 'unsubscribing'
    | 'subscribed'
    | 'unsubscribed'
    | 'error'
    | 'reconnecting'
    | 'created';

export type FeedListener = {
    onChannelStatusChange: (
        endpoint: string,
        args: FeedArgs,
        status: FeedChannelStatus,
        error?: string
    ) => void;
    onSnapshot: (endpoint: string, data: StreamingMessage) => void;
    onMessage: (endpoint: string, data: Array<StreamingMessage>) => void;
};

export type StreamingMessage = FeedData;
