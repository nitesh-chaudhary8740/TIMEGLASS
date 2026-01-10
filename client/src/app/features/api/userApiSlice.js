import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // --- AUTHENTICATION ---

    // Step 1: Request OTP
    requestOtp: builder.mutation({
      query: (email) => ({
        url: '/user/auth/request-otp',
        method: 'POST',
        body: { email },
      }),
    }),

    // Step 2: Verify OTP
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/user/auth/verify-otp',
        method: 'POST',
        body: data, // { email, otp }
      }),
      // Invalidate User tag so profile info fetches immediately after login
      invalidatesTags: ['User'],
    }),

    // Google OAuth Login
    googleLogin: builder.mutation({
      query: (idToken) => ({
        url: '/user/auth/google',
        method: 'POST',
        body: { token: idToken },
      }),
      invalidatesTags: ['User'],
    }),

    // Logout
    logoutUser: builder.mutation({
      query: () => ({
        url: '/user/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // --- USER MANAGEMENT ---

    // Fetch Current Logged-in User
    getProfile: builder.query({
      query: () => '/user/profile',
      providesTags: ['User'],
    }),

    // Update Profile Details (Name, etc.)
    updateProfile: builder.mutation({
      query: (data) => ({
        url: '/user/profile', // Corrected route to match your controller
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // --- ADDRESS BOOK ---

    // Add New Address
    addAddress: builder.mutation({
      query: (address) => ({
        url: '/user/address',
        method: 'POST',
        body: address,
      }),
      invalidatesTags: ['User'],
    }),
    // Add these to your userApiSlice.js endpoints
updateAddress: builder.mutation({
  query: ({ addressId, data }) => ({
    url: `/user/address/${addressId}`,
    method: 'PATCH',
    body: data,
  }),
  invalidatesTags: ['User'],
}),

deleteAddress: builder.mutation({
  query: (addressId) => ({
    url: `/user/address/${addressId}`,
    method: 'DELETE',
  }),
  invalidatesTags: ['User'],
}),
  }),
});

// Export all hooks
export const {
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useGoogleLoginMutation,
  useLogoutUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = userApiSlice;