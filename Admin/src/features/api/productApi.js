import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET: Fetch all products for the Inventory list
    getAllProducts: builder.query({
      query: () => '/admin/products',
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map(({ _id }) => ({ type: 'Product', id: _id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    // GET: Fetch a single product for editing
    getProductDetails: builder.query({
      query: (id) => `/admin/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    // POST: Create a new product (Multipart Form Data)
    addProduct: builder.mutation({
      query: (formData) => ({
        url: '/admin/products/add',
        method: 'POST',
        body: formData, // FormData automatically sets the correct headers
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // PATCH: Update product details
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/products/${id}`,
        method: 'PATCH',
        body: data, // Can be FormData if images are being updated
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    // DELETE: Remove product and its images
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // PATCH: Fast toggle for visibility (Draft/Published)
    toggleProductStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/products/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductDetailsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useToggleProductStatusMutation,
} = productApi;