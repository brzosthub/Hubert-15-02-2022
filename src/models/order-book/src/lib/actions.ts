import { ENDPOINT } from './config';
import { config } from '@trading/utils/config';
import { triggerSubscribe, triggerUnsubscribe } from '@trading/models/feed';

export const subscribe = (
    productId: string,
    ownerId: string,
    keepOwner = config.showDouble
) => {
    return triggerSubscribe({
        endpoint: ENDPOINT,
        ownerId: ownerId,
        args: { product_ids: [productId] },
        keepOwner,
    });
};

export const unsubscribe = (
    productId: string,
    ownerId: string,
    removeData = false,
    keepOwner = config.showDouble
) => {
    return triggerUnsubscribe({
        endpoint: ENDPOINT,
        ownerId: ownerId,
        args: { product_ids: [productId] },
        keepOwner,
        removeData,
    });
};
