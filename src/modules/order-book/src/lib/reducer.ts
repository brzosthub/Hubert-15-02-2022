import { createReducer } from '@reduxjs/toolkit';
import { setSelectedProduct } from './actions';
import { OrderBookModuleSlice } from './types';
import { reducer as orderBookModelReducer } from '@trading/models/order-book';

const initialState: OrderBookModuleSlice = {};

const reducer = createReducer(initialState, (builder) => {
    builder.addCase(setSelectedProduct, (state, action) => {
        const { selectedProduct, componentId } = action.payload;
        state[componentId] = {
            selectedProduct,
        };
        return state;
    });
});

export default {
    orderBookModule: reducer,
    ...orderBookModelReducer,
};
