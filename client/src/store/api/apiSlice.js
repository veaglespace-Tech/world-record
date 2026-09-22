import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Patak', 'Admin'],
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

    // Patak Endpoints
    getPataks: builder.query({
      query: (params) => ({
        url: '/pataks',
        params, // { page, limit, search }
      }),
      providesTags: ['Patak'],
    }),
    getPublicPataks: builder.query({
      query: () => '/pataks/public',
    }),
    createPatak: builder.mutation({
      query: (data) => ({
        url: '/pataks',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Patak'],
    }),
    updatePatak: builder.mutation({
      query: ({ id, data }) => ({
        url: `/pataks/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Patak'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetReferralLinkQuery,
  useUpdateSettingsMutation,
  useGetUsersQuery,
  useRegisterUserMutation,
  useGetPataksQuery,
  useGetPublicPataksQuery,
  useCreatePatakMutation,
  useUpdatePatakMutation,
} = apiSlice;
