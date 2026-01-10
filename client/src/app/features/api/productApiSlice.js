// features/api/productApiSlice.js

import { apiSlice } from "./apiSlice.js";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      // 1. Updated query to handle all marketplace filters
      query: ({ limit, skip, gender, movement, maxPrice, sort, search }) => {
        let url = `/products/published?limit=${limit}&skip=${skip}`;
        
        if (gender) url += `&gender=${gender}`;
        if (movement) url += `&movement=${movement}`;
        if (maxPrice) url += `&maxPrice=${maxPrice}`;
        if (sort) url += `&sort=${sort}`;
        if (search) url += `&search=${search}`;
        
        return url;
      },
      
      // 2. Optimized Serialization:
      // We exclude 'limit' and 'skip' from the cache key.
      // This means changing filters creates a new list, 
      // but changing 'skip' merges into the current filter's list.
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        const { limit, skip, ...cacheKeyFilters } = queryArgs;
        return `${endpointName}-${JSON.stringify(cacheKeyFilters)}`;
      },

      // 3. Smart Merge logic
      merge: (currentCache, newItems, { arg }) => {
        // If we are starting a fresh search/filter (skip 0), replace the cache
        if (arg.skip === 0) {
          return newItems;
        }

        if (currentCache) {
          const existingIds = new Set(currentCache.products.map(p => p._id));
          
          // Filter out any duplicates that might occur during rapid pagination
          const uniqueNewProducts = newItems.products.filter(
            p => !existingIds.has(p._id)
          );

          return {
            ...newItems, // Contains latest 'hasMore' and 'totalProducts' count
            products: [...currentCache.products, ...uniqueNewProducts],
          };
        }
        return newItems;
      },

      // Force a refetch only if the arguments (filters or skip) actually change
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
      
      // Provides a general tag for the product list
      providesTags: (result) => 
        result 
          ? [...result.products.map(({ _id }) => ({ type: 'Product', id: _id })), { type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getProductDetails: builder.query({
      query: (productId) => `/products/published/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),

    createReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: 'POST',
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' } // Invalidate list to update rating/reviews on main page
      ],
    }),

    updateReview: builder.mutation({
      query: ({ productId, rating, comment }) => ({
        url: `/products/${productId}/reviews`,
        method: 'PUT',
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' }
      ],
    }),

    deleteReview: builder.mutation({
      query: (productId) => ({
        url: `/products/${productId}/reviews`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Product', id: productId },
        { type: 'Product', id: 'LIST' }
      ],
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation
} = productApiSlice;