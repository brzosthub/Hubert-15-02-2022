import { Levels } from '@trading/models/order-book';

export const getTopPrice = (levels?: Levels): number => levels?.[0]?.[0] || 0;
export const getHighestTotal = (levels?: Levels): number =>
    levels?.[levels?.length - 1]?.[2] || 0;
export const getTotalOfTotals = (bids?: Levels, asks?: Levels) =>
    Math.max(getHighestTotal(bids), getHighestTotal(asks));
