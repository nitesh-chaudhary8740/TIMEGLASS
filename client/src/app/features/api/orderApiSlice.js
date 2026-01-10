import { apiSlice } from "./apiSlice";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/user/order',
        method: 'POST',
        body: order,
      }),
      // This ensures that any component watching 'Order' (like Order History) refreshes
      invalidatesTags: ['Order'],
    }),
    getOrderById: builder.query({
      query: (id) => `/user/order/${id}`,
      providesTags: ['Order'],
    }),
   getMyOrders: builder.query({
  query: () => "user/order/my", // Make sure this matches your router path
  providesTags: ["Order"],
}), cancelOrderItem: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `/user/order/${orderId}/item/${productId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Order'],
    }),

    // User requests return for an item (only if delivered)
    requestItemReturn: builder.mutation({
      query: ({ orderId, productId,reason,description }) => ({
        url: `/user/order/${orderId}/item/${productId}/return`,
        method: 'POST',
        body: {reason,description} ,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrderByIdQuery,useGetMyOrdersQuery,
  useCancelOrderItemMutation,
  useRequestItemReturnMutation
 } = orderApiSlice;