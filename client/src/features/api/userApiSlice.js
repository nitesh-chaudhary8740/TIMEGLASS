import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Passwordless OTP Flow
    requestOtp: builder.mutation({
      query: (email) => ({
        url: '/auth/request-otp',
        method: 'POST',
        body: { email },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data, // { email, otp }
      }),
    }),
    // User Management
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/user/update',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    // Address Book
    addAddress: builder.mutation({
      query: (address) => ({
        url: '/user/address',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
} = userApiSlice;