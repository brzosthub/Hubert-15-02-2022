import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
    FeedSubscribePayload,
    FeedUnsubscribePayload,
    FeedOwnerPayload,
    FeedRemovePayload,
    FeedUpdatePayload,
    FeedSnapshotPayload,
    FeedStatusPayload,
    FeedState,
} from './types';
import { getEndpointHash } from '@trading/api';
import { getLogger } from '@trading/utils';
import * as selectors from './selectors';
import getApiFeed from './getApiFeed';
import * as queries from './queries';

const log = getLogger('feedActions');

export const triggerSubscribe = createAsyncThunk<
    void,
    FeedSubscribePayload,
    { state: FeedState }
>('models/feed/trigger-subscribe', (payload, { getState, dispatch }) => {
    const subscriptionId = getEndpointHash(payload.endpoint, payload.args);
    const { ownerId } = payload;

    log.debug('trigger subscribe', payload);

    const entity = selectors.getEntity(getState(), subscriptionId);
    const isEmpty: boolean = queries.isEmpty(entity);
    const hasOwner: boolean = queries.hasOwner(entity, ownerId);

    if (hasOwner && !isEmpty && !payload.keepOwner) {
        log.error(
            'subscription',
            subscriptionId,
            ' for owner',
            ownerId,
            'already exist'
        );
        return;
    }

    if (!entity) {
        dispatch(create(payload));
    }

    dispatch(addOwner(payload));

    if (isEmpty) {
        log.debug('calling api subscribe', payload);
        getApiFeed(dispatch).subscribe(payload.endpoint, payload.args);
    }
});

export const triggerUnsubscribe = createAsyncThunk<
    void,
    FeedUnsubscribePayload,
    { state: FeedState }
>('models/feed/trigger-unsubscribe', (payload, { getState, dispatch }) => {
    const subscriptionId = getEndpointHash(payload.endpoint, payload.args);
    const { ownerId } = payload;

    log.debug('trigger unsubscribe', payload);

    const entity = selectors.getEntity(getState(), subscriptionId);
    const hasOwner: boolean = queries.hasOwner(entity, ownerId);

    if (!hasOwner) {
        log.error(
            'subscription',
            subscriptionId,
            ' for owner',
            ownerId,
            'does not exist'
        );
        return;
    }

    dispatch(removeOwner(payload));

    const updatedEntity = selectors.getEntity(getState(), subscriptionId);
    const isEmpty: boolean = queries.isEmpty(updatedEntity);

    if (isEmpty) {
        dispatch(remove(payload));
        log.debug('calling api unsubscribe', payload);
        getApiFeed(dispatch).unsubscribe(payload.endpoint, payload.args);
    }
});

export const create = createAction<FeedSubscribePayload>('models/feed/create');

export const remove = createAction<FeedRemovePayload>('models/feed/remove');

export const addOwner = createAction<FeedOwnerPayload>('models/feed/addOwner');

export const removeOwner = createAction<FeedOwnerPayload>(
    'models/feed/removeOwner'
);

export const update = createAction<FeedUpdatePayload>('models/feed/update');

export const snapshot = createAction<FeedSnapshotPayload>(
    'models/feed/snapshot'
);

export const status = createAction<FeedStatusPayload>('models/feed/status');
