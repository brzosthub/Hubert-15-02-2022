import { FeedArgs, FeedChannelStatus, StreamingMessage } from '@trading/api';

export interface FeedSlice {
    entities: Record<string, FeedEntity>;
}

export interface FeedState {
    feed: FeedSlice;
}

export type FeedSubscribePayload = {
    endpoint: string;
    args: FeedArgs;
    ownerId: string;
    keepOwner?: boolean;
};

export type FeedOwnerPayload = {
    endpoint: string;
    args: FeedArgs;
    ownerId: string;
    keepOwner?: boolean;
};

export type FeedUnsubscribePayload = FeedSubscribePayload & {
    removeData?: boolean;
};

export type FeedRemovePayload = FeedUnsubscribePayload;

export type FeedEntity = Omit<FeedSubscribePayload, 'ownerId'> & {
    owners: Array<string>;
    status: FeedChannelStatus;
    refCount: number;
    error?: string;
    keepOwner?: boolean;
};

export type FeedSnapshotPayload = {
    endpoint: string;
    data: StreamingMessage;
};

export type FeedUpdatePayload = {
    endpoint: string;
    data: Array<StreamingMessage>;
};

export type FeedStatusPayload = {
    endpoint: string;
    args: FeedArgs;
    status: FeedChannelStatus;
    error?: string;
};
