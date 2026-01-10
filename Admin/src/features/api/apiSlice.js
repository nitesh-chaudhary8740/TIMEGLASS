import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../../constants/env.js';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_API_URL,
    // CORRECT WAY: This tells the browser to include cookies in all cross-origin requests
    credentials: 'include', 
    prepareHeaders: (headers) => { //im commenting this
     
      return headers;
    },
  }),
  tagTypes: ['Product', 'Admin', 'User', 'Order'], 
  endpoints: () => ({}), 
});