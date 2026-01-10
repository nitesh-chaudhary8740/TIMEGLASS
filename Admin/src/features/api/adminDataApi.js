import { apiSlice } from "./apiSlice.js";

export const adminDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Renamed for clarity: matches the hook name better
    adminGetStats: builder.query({
      query: () => '/admin/stats',
      // Convention: Use uppercase for tags like 'AdminStats'
      providesTags: ['AdminStats'], 
    }),
    
    // Suggestion: Add a mutation to trigger a refresh of stats
    // e.g., after a manual reconciliation
    refreshStats: builder.mutation({
      query: () => ({
        url: '/admin/stats/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['AdminStats'],
    }),
    // Fetch all registered users
    getAllUsers: builder.query({
      query: () => '/admin/users',
      providesTags: ['Users'],
    }),

    // Get specific user details (including their order history)
    getUserDetails: builder.query({
      query: (id) => `/admin/user/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserDetails', id }],
    }),

    // Toggle user status (e.g., Block/Unblock for disputes)
    updateUserStatus: builder.mutation({
      query: ({ id, isAdmin }) => ({
        url: `/admin/user/${id}`,
        method: 'PUT',
        body: { isAdmin },
      }),
      invalidatesTags: ['Users', (result, error, { id }) => [{ type: 'UserDetails', id }]],
    }),
  }),
});

export const { 
  useAdminGetStatsQuery,
  useRefreshStatsMutation,
  useGetAllUsersQuery, // New
  useGetUserDetailsQuery, // New
  useUpdateUserStatusMutation // New
} = adminDataApi;