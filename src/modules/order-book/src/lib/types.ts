export interface OrderBookModuleSlice {
    [key: string]: {
        selectedProduct: string;
    };
}

export interface OrderBookModuleState {
    orderBookModule: OrderBookModuleSlice;
}

export type ProductPayload = {
    selectedProduct: string;
    componentId: string;
};
