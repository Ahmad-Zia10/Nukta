import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000';

// Create RTK Query API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: 'include', // Important: send cookies with requests
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Post', 'User'],
  endpoints: (builder) => ({
    // ============================================
    // AUTH ENDPOINTS
    // ============================================
    
    signup: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/signup',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => response.data,
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => response.data,
    }),

    logout: builder.mutation({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Post'],
    }),

    getCurrentUser: builder.query({
      query: () => '/api/auth/me',
      transformResponse: (response) => response.data.user,
      providesTags: ['User'],
    }),

    // ============================================
    // POST ENDPOINTS
    // ============================================

    createPost: builder.mutation({
      query: (postData) => {
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('slug', postData.slug);
        formData.append('content', postData.content);
        formData.append('status', postData.status || 'active');
        
        if (postData.featuredImage instanceof File) {
          formData.append('featuredImage', postData.featuredImage);
        }

        return {
          url: '/api/posts',
          method: 'POST',
          body: formData,
          formData: true,
          // Override headers for multipart/form-data
          prepareHeaders: (headers) => {
            headers.delete('Content-Type'); // Let browser set the correct boundary
            return headers;
          },
        };
      },
      transformResponse: (response) => response.data.post,
      invalidatesTags: ['Post'],
    }),

    updatePost: builder.mutation({
      query: ({ slug, ...postData }) => {
        const formData = new FormData();
        if (postData.title) formData.append('title', postData.title);
        if (postData.content) formData.append('content', postData.content);
        if (postData.status) formData.append('status', postData.status);
        
        if (postData.featuredImage instanceof File) {
          formData.append('featuredImage', postData.featuredImage);
        }

        return {
          url: `/api/posts/${slug}`,
          method: 'PUT',
          body: formData,
          formData: true,
          prepareHeaders: (headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      transformResponse: (response) => response.data.post,
      invalidatesTags: (result, error, { slug }) => [
        { type: 'Post', id: slug },
        'Post',
      ],
    }),

    deletePost: builder.mutation({
      query: (slug) => ({
        url: `/api/posts/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),

    getPost: builder.query({
      query: (slug) => `/api/posts/${slug}`,
      transformResponse: (response) => response.data.post,
      providesTags: (result, error, slug) => [{ type: 'Post', id: slug }],
    }),

    listPosts: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.userId) queryParams.append('userId', params.userId);
        
        return `/api/posts?${queryParams.toString()}`;
      },
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ slug }) => ({ type: 'Post', id: slug })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    getMyPosts: builder.query({
      query: () => '/api/posts/user/my-posts',
      transformResponse: (response) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.posts.map(({ slug }) => ({ type: 'Post', id: slug })),
              { type: 'Post', id: 'MY_POSTS' },
            ]
          : [{ type: 'Post', id: 'MY_POSTS' }],
    }),

    summarizePost: builder.query({
      query: (slug) => `/api/posts/${slug}/summarize`,
      transformResponse: (response) => response.data,
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth hooks
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  
  // Post hooks
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetPostQuery,
  useLazyGetPostQuery,
  useListPostsQuery,
  useLazyListPostsQuery,
  useGetMyPostsQuery,
  useLazyGetMyPostsQuery,
  useSummarizePostQuery,
  useLazySummarizePostQuery,
} = apiSlice;

// Helper function to get file URL for viewing
export const getFileView = (filePath) => {
  if (!filePath) return '';
  return `${API_BASE_URL}${filePath}`;
};
