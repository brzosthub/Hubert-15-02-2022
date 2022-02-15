import { create, update, snapshot, remove } from '@trading/models/feed';
import config from './reducer';

describe('src/models/orderBook/reducer', () => {
    const reducer = config.orderBook;
    const productId = 'PI_XBTUSD';
    const endpoint = 'book_ui_1';
    const snapshotMessage = {
        numLevels: 25,
        feed: 'book_ui_1_snapshot',
        bids: [
            [35440.5, 15000],
            [35439.5, 3903],
        ],
        asks: [
            [35470.5, 10],
            [35475, 4063],
        ],
        product_id: productId,
    };

    it('should handle create', () => {
        const nextState = reducer(
            {},
            create({
                endpoint,
                args: { product_ids: [productId] },
                ownerId: 'component1',
            })
        );
        expect(nextState).toEqual({
            [productId]: {
                asks: [],
                bids: [],
                numLevels: 0,
            },
        });
    });

    it('should handle remove and remove data', () => {
        const snapshotState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        const nextState = reducer(
            snapshotState,
            remove({
                endpoint,
                args: { product_ids: [productId] },
                ownerId: 'component1',
                removeData: true,
            })
        );
        expect(nextState).toEqual({});
    });

    it('should handle remove and keep data', () => {
        const snapshotState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        const nextState = reducer(
            snapshotState,
            remove({
                endpoint,
                args: { product_ids: [productId] },
                ownerId: 'component1',
                removeData: false,
            })
        );
        expect(nextState).toEqual({
            [productId]: {
                numLevels: 25,
                isSnapshotLoaded: true,
                bids: [
                    [35440.5, 15000, 15000],
                    [35439.5, 3903, 18903],
                ],
                asks: [
                    [35470.5, 10, 10],
                    [35475, 4063, 4073],
                ],
            },
        });
    });

    it('should handle snapshot', () => {
        const nextState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        expect(nextState).toEqual({
            [productId]: {
                numLevels: 25,
                isSnapshotLoaded: true,
                bids: [
                    [35440.5, 15000, 15000],
                    [35439.5, 3903, 18903],
                ],
                asks: [
                    [35470.5, 10, 10],
                    [35475, 4063, 4073],
                ],
            },
        });
    });

    it('should replace price level', () => {
        const updateMessage = {
            feed: 'book_ui_1',
            bids: [[35440.5, 10]],
            asks: [[35475, 200]],
            product_id: productId,
        };

        const snapshotState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        const updateState = reducer(
            snapshotState,
            update({ endpoint, data: [updateMessage] })
        );

        expect(updateState[productId]).toEqual({
            bids: [
                [35440.5, 10, 10],
                [35439.5, 3903, 3913],
            ],
            asks: [
                [35470.5, 10, 10],
                [35475, 200, 210],
            ],
            isSnapshotLoaded: true,
            numLevels: 25,
        });
    });

    it('should add price level', () => {
        const updateMessage = {
            feed: 'book_ui_1',
            bids: [[3500.5, 10]],
            asks: [[3400, 200]],
            product_id: productId,
        };

        const snapshotState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        const updateState = reducer(
            snapshotState,
            update({ endpoint, data: [updateMessage] })
        );

        expect(updateState[productId]?.bids).toHaveLength(3);

        expect(updateState[productId]).toEqual({
            bids: [
                [35440.5, 15000, 15000],
                [35439.5, 3903, 18903],
                [3500.5, 10, 18913],
            ],
            asks: [
                [3400, 200, 200],
                [35470.5, 10, 210],
                [35475, 4063, 4273],
            ],
            isSnapshotLoaded: true,
            numLevels: 25,
        });
    });

    it('should remove price level', () => {
        const updateMessage = {
            feed: 'book_ui_1',
            bids: [
                [35440.5, 0],
                [20, 0],
            ],
            asks: [
                [35475, 0],
                [10, 0],
            ],
            product_id: productId,
        };

        const snapshotState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        const updateState = reducer(
            snapshotState,
            update({ endpoint, data: [updateMessage] })
        );

        expect(updateState[productId]).toEqual({
            bids: [[35439.5, 3903, 3903]],
            asks: [[35470.5, 10, 10]],
            isSnapshotLoaded: true,
            numLevels: 25,
        });
    });

    it('should not change ref of sides', () => {
        const updateMessage = {
            feed: 'book_ui_1',
            bids: [[35440.5, 0]],
            asks: [],
            product_id: productId,
        };

        const snapshotState = reducer(
            {
                [productId]: {
                    asks: [],
                    bids: [],
                    numLevels: 0,
                },
            },
            snapshot({ endpoint, data: snapshotMessage })
        );

        const updateState = reducer(
            snapshotState,
            update({ endpoint, data: [updateMessage] })
        );

        expect(updateState[productId].asks).toBe(snapshotState[productId].asks);
    });
});
