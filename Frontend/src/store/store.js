import {configureStore} from '@reduxjs/toolkit';
import authSlice  from './authSlice';
import { apiSlice } from './apiSlice';

const store = configureStore({
    reducer : {
        auth : authSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
})


export default store;
