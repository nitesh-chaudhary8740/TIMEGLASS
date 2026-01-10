import { apiSlice } from "./apiSlice";

export const adminTicketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTickets: builder.query({
      query: () => "/tickets",
      providesTags: ["AdminTickets"],
    }),

    getAdminTicketDetails: builder.query({
      query: (id) => `/tickets/${String(id)}`, // Force String ID
      providesTags: (result, error, id) => [{ type: "TicketDetails", id: String(id) }],
    }),

  adminReplyToTicket: builder.mutation({
  // Change parameter to receive formData
  query: ({ id, formData }) => ({
    url: `/tickets/${id}`,
    method: "POST",
    body: formData, // Send the FormData object directly
    // RTK Query will now correctly NOT set a JSON header
  }),
  invalidatesTags: (result, error, { id }) => [
    { type: "TicketDetails", id: String(id) },
    "AdminTickets",
  ],
}),

    resolveTicket: builder.mutation({
      query: (id) => ({
        url: `/tickets/${String(id)}/resolve`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TicketDetails", id: String(id) },
        "AdminTickets",
      ],
    }),
  }),
});

export const {
  useGetAllTicketsQuery,
  useGetAdminTicketDetailsQuery,
  useAdminReplyToTicketMutation,
  useResolveTicketMutation,
} = adminTicketApi;