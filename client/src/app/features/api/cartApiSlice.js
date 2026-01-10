import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetches the populated cart from the user object
    getCart: builder.query({
      query: () => '/user/cart', // Your route to get user.cart
      providesTags: ['Cart'],
    }),
    
    updateCartItem: builder.mutation({
      query: (data) => ({
        url: '/user/cart/update',
        method: 'PATCH',
        body: data, // { productId, action: 'inc' }
      }),
      invalidatesTags: ['Cart'],
    }),

    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/user/cart/remove/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),

    mergeCart: builder.mutation({
      query: (guestItems) => ({
        url: '/user/cart/merge',
        method: 'POST',
        body: { guestItems },
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: '/user/cart/clear',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'], // This tells RTK Query to refetch the cart as empty
    }),
  }),
});

export const { 
  useGetCartQuery,
  useLazyGetCartQuery, 
  useUpdateCartItemMutation, 
  useRemoveCartItemMutation,
  useMergeCartMutation,
  useClearCartMutation
} = cartApiSlice;