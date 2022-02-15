import { createAction } from '@reduxjs/toolkit';
import { ProductPayload } from './types';

export const setSelectedProduct = createAction<ProductPayload>(
    'order-book-module/set-product'
);
