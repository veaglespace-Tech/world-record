import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Pathak', 'Admin'],
  endpoints: (builder) => ({
    // Auth Endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Admin'],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Admin Endpoints
    getReferralLink: builder.query({
      query: () => '/admin/referral-link',
      providesTags: ['Admin'],
    }),
    updateSettings: builder.mutation({
      query: (data) => ({
        url: '/admin/settings',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Admin'],
    }),

    // User Endpoints
    getUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params, // { page, limit, search, filter }
      }),
      providesTags: ['User'],
    }),
    registerUser: builder.mutation({
      query: (formData) => ({
        url: '/users/register',
        method: 'POST',
        body: formData, // passing FormData directly
      }),
      invalidatesTags: ['User'], // Invalidate list if admin is viewing it
    }),

    // Pathak Endpoints
    getPathaks: builder.query({
      query: (params) => ({
        url: '/Pathaks',
        params, // { page, limit, search }
      }),
      providesTags: ['Pathak'],
    }),
    getPublicPathaks: builder.query({
      query: () => '/Pathaks/public',
    }),
    createPathak: builder.mutation({
      query: (formData) => ({
        url: '/Pathaks',
        method: 'POST',
        body: formData, // FormData for logo upload
      }),
      invalidatesTags: ['Pathak'],
    }),
    updatePathak: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/Pathaks/${id}`,
        method: 'PUT',
        body: formData, // FormData for logo upload
      }),
      invalidatesTags: ['Pathak'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetReferralLinkQuery,
  useUpdateSettingsMutation,
  useGetUsersQuery,
  useRegisterUserMutation,
  useGetPathaksQuery,
  useGetPublicPathaksQuery,
  useCreatePathakMutation,
  useUpdatePathakMutation,
} = apiSlice;
