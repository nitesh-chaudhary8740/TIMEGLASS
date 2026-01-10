// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/apiSlice'; // Adjust path if needed
import adminReducer from '../features/adminSlice';

export const store = configureStore({
  reducer: {
    // 1. Add the apiSlice reducer using its unique name (reducerPath)
    [apiSlice.reducerPath]: apiSlice.reducer,
    
    // Your existing manual slice for UI state
    admin: adminReducer,
  },
  // 2. Add the apiSlice middleware
  // This is required for caching, invalidation, and other RTK-Q features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});