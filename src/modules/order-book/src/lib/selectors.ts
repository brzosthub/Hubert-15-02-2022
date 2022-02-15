import { createSelector } from '@reduxjs/toolkit';
import * as queries from './queries';
import { getAsks, getBids, OrderBookState } from '@trading/models/order-book';
import { OrderBookModuleState } from './types';

export const getData = (state: OrderBookModuleState) => state.orderBookModule;

export const getModuleState = (
    state: OrderBookModuleState,
    componentId: string
) => getData(state)?.[componentId];

export const getSelectedProduct = (
    state: OrderBookModuleState,
    componentId: string
) => getModuleState(state, componentId)?.selectedProduct;

export const createGetBids = (productId: string, count: number) =>
    createSelector(
        (state: OrderBookState) => getBids(state, productId),
        (bids) => {
            return bids?.slice(0, count);
        }
    );

export const createGetAsks = (productId: string, count: number) =>
    createSelector(
        (state: OrderBookState) => getAsks(state, productId),
        (asks) => {
            return asks?.slice(0, count);
        }
    );

export const createGetSpread = (productId: string) =>
    createSelector(
        (state: OrderBookState) => getBids(state, productId),
        (state: OrderBookState) => getAsks(state, productId),
        (bids, asks) => {
            const topBid = queries.getTopPrice(bids);
            const topAsk = queries.getTopPrice(asks);
            return Math.abs(topBid - topAsk);
        }
    );

export const createGetSpreadPercentage = (productId: string) =>
    createSelector(
        (state: OrderBookState, spread: number) => spread,
        (state: OrderBookState) => getAsks(state, productId),
        (spread, asks) => {
            const topAsk = queries.getTopPrice(asks);
            if (topAsk === 0) {
                return 0;
            }
            return spread / topAsk;
        }
    );
