export type Level = [number, number, number];
export type Levels = Array<Level>;
export type Product = {
    isSnapshotLoaded?: boolean;
    bids: Levels;
    asks: Levels;
    numLevels: number;
};

export interface OrderBookSlice {
    [key: string]: Product;
}

export interface OrderBookState {
    orderBook: OrderBookSlice;
}
