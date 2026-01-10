import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { BASE_API_URL } from "../../constants/env.js"
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_API_URL,
    // CORRECT WAY: This tells the browser to include cookies in all cross-origin requests
    credentials: 'include', 
    prepareHeaders: (headers) => {
      // You can still set other headers here like Content-Type
      // but 'credentials' is handled above
      return headers;
    },
  }),
 tagTypes: ['Product', 'User', 'Cart', 'Wishlist', 'Order'], 
  endpoints: () => ({}), 
});