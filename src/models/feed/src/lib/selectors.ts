import { FeedArgs, getEndpointHash } from '@trading/api';
import { createSelector } from '@reduxjs/toolkit';
import { FeedState } from './types';

export const getFeeds = (state: FeedState) => state.feed;

export const getEntities = (state: FeedState) => getFeeds(state).entities;

export const getEntity = (state: FeedState, subscriptionId: string) =>
    getEntities(state)[subscriptionId];

export const createGetEntity = (endpoint: string, args: FeedArgs) => {
    const subscriptionId = getEndpointHash(endpoint, args);
    return createSelector(getEntities, (entities) => entities[subscriptionId]);
};
