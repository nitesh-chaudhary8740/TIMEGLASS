import { apiSlice } from "./apiSlice";

export const adminAuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST: Login
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Admin'],
    }),

    // GET: Check session & get profile info
    getAdminProfile: builder.query({
      query: () => '/admin/profile', // Backend verifies the cookie here
      providesTags: ['Admin'],
    }),

    // POST: Clear cookie on server
    adminLogout: builder.mutation({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
      // Tells RTK-Q to clear the 'Admin' cache so ProtectedRoute redirects
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const { 
  useAdminLoginMutation, 
  useGetAdminProfileQuery, 
  useAdminLogoutMutation 
} = adminAuthApi;