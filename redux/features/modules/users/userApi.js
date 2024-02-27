import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: (data) => {
        const { limit, searchTerm } = data;
        return `/users?limit=5&searchTerm=${searchTerm}`;
      },
    }),
    createUser: builder.mutation({
      query: (data) => {
        return {
          url: `/users`,
          method: "POST",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/users/login`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: true,
});
export const {
  useCreateUserMutation,
  useLoginMutation,
  useLazyGetAllUserQuery,
} = userApi;
