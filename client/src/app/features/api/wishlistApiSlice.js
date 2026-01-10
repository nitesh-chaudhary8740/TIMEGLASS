import { apiSlice } from "./apiSlice.js";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get all items in the wishlist
    getWishlist: builder.query({
      query: () => "/user/wishlist",
      providesTags: ["Wishlist"],
    }),

    // 2. Toggle item (Logic: if exists -> remove, else -> add)
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: "/user/wishlist", // Matches your router.route("/").post(toggleWishlist)
        method: "POST",
        body: { productId },
      }),
      // This forces the getWishlist query to re-run and update the heart icons
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} = wishlistApiSlice;