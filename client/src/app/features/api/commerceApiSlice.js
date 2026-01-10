// import { apiSlice } from "./apiSlice";

// export const commerceApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getCart: builder.query({
//       query: () => '/user/cart',
//       providesTags: ['Cart'],
//     }),
//     mergeCart: builder.mutation({
//       query: (guestItems) => ({
//         url: '/user/cart/merge',
//         method: 'POST',
//         body: { guestItems },
//       }),
//       invalidatesTags: ['Cart'],
//     }),
//     updateDBCart: builder.mutation({
//       query: (data) => ({
//         url: '/user/cart',
//         method: 'PATCH',
//         body: data,
//       }),
//       invalidatesTags: ['Cart'],
//     }),
//   }),
// });

// export const { useGetCartQuery, useMergeCartMutation, useUpdateDBCartMutation,useLazyGetCartQuery } = commerceApiSlice;