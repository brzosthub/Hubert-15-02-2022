import { createReducer } from '@reduxjs/toolkit';
import { addOwner, create, remove, removeOwner, status } from './actions';
import { getLogger } from '@trading/utils';
import { FeedSlice } from './types';
import { getEndpointHash } from '@trading/api';

const initialState: FeedSlice = {
    entities: {},
};

const log = getLogger('feedReducer');

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(create, (state, action) => {
            const payload = action.payload;
            const subscriptionId = getEndpointHash(
                payload.endpoint,
                payload.args
            );

            if (state.entities[subscriptionId]) {
                log.error('subscription already exist', subscriptionId);
                return;
            }

            log.debug('creating subscription', subscriptionId);

            state.entities[subscriptionId] = {
                endpoint: payload.endpoint,
                args: payload.args,
                status: 'created',
                refCount: 0,
                owners: [],
            };

            return state;
        })
        .addCase(addOwner, (state, action) => {
            const payload = action.payload;
            const { ownerId } = payload;
            const subscriptionId = getEndpointHash(
                payload.endpoint,
                payload.args
            );

            const entity = state.entities[subscriptionId];

            const currentIndex = entity?.owners.indexOf(ownerId);
            const hasOwner = currentIndex !== -1;

            if (!entity || (hasOwner && !payload.keepOwner)) {
                log.error('owner can not be added', ownerId, subscriptionId);
                return;
            }

            if (!(payload.keepOwner && hasOwner)) {
                log.debug(
                    'adding owner for subscription',
                    ownerId,
                    subscriptionId
                );
                entity.owners.push(ownerId);
            }

            log.debug('increase ref count');
            entity.refCount++;
            return state;
        })
        .addCase(removeOwner, (state, action) => {
            const payload = action.payload;
            const { ownerId } = payload;
            const subscriptionId = getEndpointHash(
                payload.endpoint,
                payload.args
            );

            const entity = state.entities[subscriptionId];

            const currentIndex = entity?.owners.indexOf(ownerId);

            if (!entity || currentIndex === -1) {
                log.error('owner can not be removed', ownerId, subscriptionId);
                return;
            }

            if (!payload.keepOwner) {
                log.debug(
                    'removing owner for subscription',
                    ownerId,
                    subscriptionId
                );
                entity.owners.splice(currentIndex, 1);
            }

            log.debug('increase ref count');
            entity.refCount--;
            return state;
        })
        .addCase(remove, (state, action) => {
            const payload = action.payload;
            const subscriptionId = getEndpointHash(
                payload.endpoint,
                payload.args
            );

            const entity = state.entities[subscriptionId];

            if (!entity || (payload.keepOwner && entity.owners?.length > 0)) {
                log.debug('subscription can not be removed', subscriptionId);
                return;
            }

            log.debug('remove empty subscription', subscriptionId);
            delete state.entities[subscriptionId];

            return state;
        })
        .addCase(status, (state, action) => {
            const payload = action.payload;
            const subscriptionId = getEndpointHash(
                payload.endpoint,
                payload.args
            );

            const entity = state.entities[subscriptionId];

            if (!entity) {
                return;
            }

            log.debug(
                'settings subscription status',
                subscriptionId,
                payload.status
            );
            entity.status = payload.status;
            entity.error = payload.error;

            // Update ref count for other entities
            if (
                payload.status === 'subscribed' &&
                entity.refCount !== entity.owners?.length
            ) {
                entity.refCount = entity.owners?.length;
            }

            return state;
        });
});

export default {
    feed: reducer,
};
