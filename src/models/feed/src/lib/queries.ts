import { FeedEntity } from './types';

export const getStatus = (entity: FeedEntity) => entity?.status;

export const getOwners = (entity: FeedEntity) => entity?.owners;

export const isEmpty = (entity: FeedEntity) =>
    !entity || entity?.refCount === 0;

export const hasAnyOwner = (entity: FeedEntity) =>
    getOwners(entity)?.length > 0;

export const hasOwner = (entity: FeedEntity, ownerId: string) => {
    const owners = getOwners(entity);
    return owners && owners.indexOf(ownerId) !== -1;
};

export const getInfo = (entity: FeedEntity) => {
    const status = getStatus(entity);

    return {
        isLoading: status === 'subscribing' || status === 'created',
        isReconnecting: status === 'reconnecting',
        isSubscribed: status === 'subscribed',
        isUnsubscribed: !entity || status === 'unsubscribed',
        isError: status === 'error',
        error: entity?.error,
    };
};
