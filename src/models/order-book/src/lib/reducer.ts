import { AnyAction, createReducer, isDraft, original } from '@reduxjs/toolkit';
import { create, update, snapshot, remove } from '@trading/models/feed';
import { Levels, Product } from './types';
import { ENDPOINT } from './config';

export interface OrderBookSlice {
    [key: string]: Product;
}

const initialState: OrderBookSlice = {};

const mergePrices = (stateLevels: Levels, updatedLevels: Levels) => {
    /**
     * Immer is slow, work on plain array
     */
    const nextLevels = isDraft(stateLevels)
        ? original(stateLevels)?.slice() || []
        : stateLevels;

    updatedLevels.forEach((nextLevelItem) => {
        const currentLevelIndex = nextLevels.findIndex(
            (current) => current[0] === nextLevelItem[0]
        );
        const hasCurrentLevel = currentLevelIndex !== -1;

        // Removed level
        if (nextLevelItem[1] === 0) {
            if (!hasCurrentLevel) {
                return;
            }
            nextLevels.splice(currentLevelIndex, 1);
            return;
        }

        // Updated level
        if (hasCurrentLevel) {
            nextLevels[currentLevelIndex] = nextLevelItem;
            return;
        }

        // Added level
        nextLevels.push(nextLevelItem);
    });

    return nextLevels;
};

const applyTotals = (levels: Levels): Levels => {
    let sum = 0;
    return levels.map((level) => {
        sum += level[1];
        if (level[2] !== sum) {
            return [level[0], level[1], sum];
        }
        return level;
    });
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(create, (state, action) => {
            const request = action.payload;
            const args = request.args;

            args.product_ids?.forEach((productId: string) => {
                state[productId] = {
                    bids: [],
                    asks: [],
                    numLevels: 0,
                };
            });

            return state;
        })
        .addCase(remove, (state, action) => {
            const request = action.payload;
            const args = request.args;

            args.product_ids.forEach((productId: string) => {
                if (request.removeData) {
                    delete state[productId];
                }
            });

            return state;
        })
        .addCase(snapshot, (state, action) => {
            const message = action.payload.data;
            const productId = message.product_id as string;

            const nextProductState = state[productId];
            if (!nextProductState) {
                // we have received messages for unsubscribed channel, remove when we will get unsubscribe
                return;
            }

            /**
             * TODO: Feature - Snapshot seems to be sorted, can we trust api?
             */
            nextProductState.isSnapshotLoaded = true;
            nextProductState.bids = applyTotals(message.bids as Levels);
            nextProductState.asks = applyTotals(message.asks as Levels);
            nextProductState.numLevels = message.numLevels as number;

            return state;
        })
        .addCase(update, (state, action) => {
            const messages = action.payload.data;

            const bidsToUpdate: Array<Product> = [];
            const asksToUpdate: Array<Product> = [];

            messages.forEach((message) => {
                const nextProductState = state[message.product_id];
                if (!nextProductState) {
                    // we have received messages for unsubscribed channel, remove when we will get unsubscribe
                    return;
                }

                if (message.bids?.length) {
                    nextProductState.bids = mergePrices(
                        nextProductState.bids,
                        message.bids
                    );
                    bidsToUpdate.push(nextProductState);
                }

                if (message.asks?.length) {
                    nextProductState.asks = mergePrices(
                        nextProductState.asks,
                        message.asks
                    );
                    asksToUpdate.push(nextProductState);
                }
            });

            bidsToUpdate.forEach((nextProductState) => {
                // Sort descending
                nextProductState.bids.sort((a, b) => b[0] - a[0]);
                nextProductState.bids = applyTotals(nextProductState.bids);
            });

            asksToUpdate.forEach((nextProductState) => {
                // Sort ascending
                nextProductState.asks.sort((a, b) => a[0] - b[0]);
                nextProductState.asks = applyTotals(nextProductState.asks);
            });

            return state;
        })
        .addMatcher(
            (action: AnyAction) => action?.endpoint === ENDPOINT,
            (slice, action) => {
                // do nothing
            }
        );
});

export default {
    orderBook: reducer,
};
