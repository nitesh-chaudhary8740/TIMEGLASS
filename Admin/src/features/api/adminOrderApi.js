import { apiSlice } from "./apiSlice.js";

export const adminOrderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- GETTERS ---
    getOrders: builder.query({
      query: () => "/admin/orders",
      providesTags: ["Orders"],
    }),

    getOrderDetails: builder.query({
      query: (id) => `/admin/order/${id}`,
      providesTags: (result, error, id) => [{ type: "OrderDetails", id }, "Orders"],
    }),

    getTransactions: builder.query({
      query: () => "/admin/transactions",
      providesTags: ["Transactions"],
    }),

    // --- FULFILLMENT & ITEM MANAGEMENT ---
    updateItemStatus: builder.mutation({
      query: ({ orderId, productId, status }) => ({
        url: `/admin/order/${orderId}/item/${productId}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "OrderDetails", id: orderId }, "Orders"],
    }),

 // --- OUTBOUND SECURITY & HANDOVER (Delivery OTP) ---
sendDeliveryOtp: builder.mutation({
  // FIX: Destructure the object here
  query: ({ id, productId }) => ({
    url: `/admin/order/${id}/send-otp`,
    method: 'POST',
    body: { productId } // Backend needs this to set the OTP for the specific item
  }),
  invalidatesTags: (result, error, { id }) => [{ type: "OrderDetails", id }],
}),

verifyDeliveryOtp: builder.mutation({
  // FIX: Added productId to the query destructuring
  query: ({ id, otp, productId }) => ({
    url: `/admin/order/${id}/verify-otp`,
    method: 'PUT',
    body: { otp, productId } // Send both to verify the specific item
  }),
  invalidatesTags: (result, error, { id }) => ["Orders", { type: 'OrderDetails', id }, "AdminStats"]
}),

rollbackDelivery: builder.mutation({
  // Optional: If you want to rollback a specific item's OTP
  query: ({ id, productId }) => ({
    url: `/admin/order/${id}/rollback-delivery`,
    method: 'PUT',
    body: { productId }
  }),
  invalidatesTags: (result, error, { id }) => [{ type: 'OrderDetails', id }]
}),

    // --- INBOUND SECURITY & HANDOVER (Return OTP) ---
    // Matches initiateReturnPickup controller
    sendReturnOtp: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `/admin/order/${orderId}/item/${productId}/send-return-otp`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "OrderDetails", id: orderId }],
    }),

    // Matches verifyReturnPickup controller
    verifyReturnOtp: builder.mutation({
      query: ({ orderId, productId, otp }) => ({
        url: `/admin/order/${orderId}/item/${productId}/verify-return-otp`,
        method: 'PUT',
        body: { otp }
      }),
      invalidatesTags: (result, error, { orderId }) => ["Orders", { type: 'OrderDetails', id: orderId }, "AdminStats"]
    }),

    // --- CANCELLATIONS & RETURNS ---
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/order/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => ["Orders", { type: "OrderDetails", id }, "AdminStats"]
    }),

    processReturn: builder.mutation({
      query: ({ orderId, productId, action }) => ({
        url: `/admin/order/${orderId}/item/${productId}/return`,
        method: 'PUT',
        body: { action } 
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "OrderDetails", id: orderId }, "Orders"],
    }),

    refundItem: builder.mutation({
      query: ({ orderId, productId, amount }) => ({
        url: `/admin/order/${orderId}/item/${productId}/refund`,
        method: 'POST',
        body: { amount }
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "OrderDetails", id: orderId }],
    }),
    // CANCELLATION
 // Add this to your injectEndpoints in adminOrderApi.js
rollbackReturnPickup: builder.mutation({
  query: ({ orderId, productId }) => ({
    // Changed 'orders' to 'order' and 'items' to 'item' to match your Express router
    url: `/admin/order/${orderId}/item/${productId}/return-rollback`,
    method: 'PATCH', 
  }),
  invalidatesTags: (result, error, { orderId }) => [{ type: "OrderDetails", id: orderId }, "Orders"],
}),
  }),
  
});

export const {
  useGetOrdersQuery,
  useGetOrderDetailsQuery,
  useUpdateItemStatusMutation,
  useGetTransactionsQuery,
  useSendDeliveryOtpMutation,
  useVerifyDeliveryOtpMutation,
  useRollbackDeliveryMutation,
  useSendReturnOtpMutation,      // Exported for your Return UI
  useVerifyReturnOtpMutation,    // Exported for your Return UI
  useCancelOrderMutation,
  useProcessReturnMutation,
  useRefundItemMutation,
  useRollbackReturnPickupMutation
  
} = adminOrderApi;