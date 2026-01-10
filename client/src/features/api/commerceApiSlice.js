import { apiSlice } from "./apiSlice";

export const commerceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Wishlist Logic
    getWishlist: builder.query({
      query: () => '/wishlist',
      providesTags: ['Wishlist'],
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    // Checkout Logic
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders/checkout',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Cart', 'Order'],
    }),
    getMyOrders: builder.query({
      query: () => '/orders/my-orders',
      providesTags: ['Order'],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useCreateOrderMutation,
  useGetMyOrdersQuery,
} = commerceApiSlice;