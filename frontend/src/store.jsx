// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/features/productsSlice';
import cartReducer from './slices/features/cartSlice';
import userReducer from './slices/features/userSlice';
import filtersReducer from './slices/features/filterSlice';
import uiReducer from './slices/features/uiSlice.js';
import orderReducer from './slices/features/orderSlice.js';
import { cartMiddleware } from './middleware/CartMiddleware.js'; // Import the middleware

// Configure the Redux store by combining all slice reducers
export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
    ui: uiReducer,
    filters: filtersReducer,
    orders: orderReducer,
  },
  // Add the middleware to the store
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(cartMiddleware),
});