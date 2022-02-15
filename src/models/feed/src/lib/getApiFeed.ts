import {
    Feed,
    FeedArgs,
    FeedChannelStatus,
    StreamingMessage,
} from '@trading/api';
import * as actions from './actions';
import { Dispatch } from '@reduxjs/toolkit';

let feed: Feed;
let dispatch: Dispatch;

function handleMessage(endpoint: string, data: Array<StreamingMessage>) {
    dispatch(actions.update({ endpoint, data }));
}

function handleSnapshot(endpoint: string, data: StreamingMessage) {
    dispatch(actions.snapshot({ endpoint, data }));
}

function handleChannelStatusChange(
    endpoint: string,
    args: FeedArgs,
    status: FeedChannelStatus,
    error?: string
) {
    const action = actions.status({
        endpoint,
        args,
        status,
        error,
    });

    dispatch(action);
}

// TODO: Feature - make it better, we are just keeping it simple for now, should land in api as singleton
function getApiFeed(storeDispatch: Dispatch) {
    if (feed) {
        return feed;
    }

    dispatch = storeDispatch;

    feed = new Feed({
        onMessage: handleMessage,
        onSnapshot: handleSnapshot,
        onChannelStatusChange: handleChannelStatusChange,
    });

    feed.connect();

    return feed;
}

export default getApiFeed;
