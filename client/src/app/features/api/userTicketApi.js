import { apiSlice } from "./apiSlice";

export const userTicketApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createTicket: builder.mutation({
      query: (ticketData) => ({
        url: "/tickets",
        method: "POST",
        body: ticketData,
      }),
      invalidatesTags: ["UserTickets"],
    }),

    getMyTickets: builder.query({
      query: () => "/tickets/my-tickets",
      providesTags: ["UserTickets"],
    }),

    getTicketConversation: builder.query({
      query: (id) => `/tickets/${String(id)}`, // Force String ID
      providesTags: (result, error, id) => [
        { type: "TicketDetails", id: String(id) },
      ],
    }),

    replyToTicket: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/tickets/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "TicketDetails", id: String(id) },
        "UserTickets",
      ],
    }),
  }),
});

export const {
  useCreateTicketMutation,
  useGetMyTicketsQuery,
  useGetTicketConversationQuery,
  useReplyToTicketMutation,
} = userTicketApi;
