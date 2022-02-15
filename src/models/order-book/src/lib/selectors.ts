import { OrderBookState } from './types';
import { createGetEntity } from '@trading/models/feed';
import { ENDPOINT } from './config';

export const getOrderBook = (state: OrderBookState) => state.orderBook;

export const getProduct = (state: OrderBookState, productId: string) =>
    getOrderBook(state)[productId];

export const getBids = (state: OrderBookState, productId: string) =>
    getProduct(state, productId)?.bids;

export const getAsks = (state: OrderBookState, productId: string) =>
    getProduct(state, productId)?.asks;

export const getNumLevels = (state: OrderBookState, productId: string) =>
    getProduct(state, productId)?.numLevels;

export const createGetOrderBookFeed = (productId: string) =>
    createGetEntity(ENDPOINT, { product_ids: [productId] });
