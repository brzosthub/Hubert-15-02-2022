import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { setAutoFreeze } from 'immer';

// Do not freeze we have huge object
setAutoFreeze(false);

// Setup store
export const store = configureStore({
    reducer: {
        ...rootReducer,
    },
});

const getStore = () => {
    return store;
};

// TODO: Feature - wrap with env
window.getStore = getStore;

export default getStore;
