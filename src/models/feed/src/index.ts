export type {
    FeedSlice,
    FeedState,
    FeedSubscribePayload,
    FeedUnsubscribePayload,
    FeedOwnerPayload,
    FeedRemovePayload,
    FeedEntity,
    FeedSnapshotPayload,
    FeedStatusPayload,
    FeedUpdatePayload,
} from './lib/types';

export {
    create,
    update,
    addOwner,
    status,
    remove,
    snapshot,
    triggerUnsubscribe,
    triggerSubscribe,
} from './lib/actions';

export {
    getFeeds,
    getEntity,
    getEntities,
    createGetEntity,
} from './lib/selectors';

export { getStatus, getInfo } from './lib/queries';

export { default as reducer } from './lib/reducer';
