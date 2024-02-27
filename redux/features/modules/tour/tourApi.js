import { baseApi } from "../../api/baseApi";

const tourApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTour: builder.mutation({
      query: (data) => {
        return {
          url: `/tours`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateTour"],
    }),
    createExpense: builder.mutation({
      query: (data) => {
        return {
          url: `/tours/expense`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["updateTour"],
    }),
    getAllExpenseForSpecificTour: builder.query({
      query: (id) => {
        return {
          url: `/tours/expense/${id}`,
          method: "GET",
        };
      },
      providesTags: ["tourExpense"],
    }),
    updateSpecificTourExpense: builder.mutation({
      query: (data) => {
        const { id, ...other } = data;
        return {
          url: `/tours/expense/${id}`,
          method: "PUT",
          body: other,
        };
      },
      invalidatesTags: ["tourExpense"],
    }),
    deleteSpecificTourExpense: builder.mutation({
      query: (id) => {
        return {
          url: `/tours/expense/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["tourExpense"],
    }),
    getToursForUser: builder.query({
      query: (data) => {
        return {
          url: `/tours/user/${data}`,
          method: "GET",
        };
      },
      providesTags: ["addNewTour", "updateTour", "deposit", "tourExpense"],
    }),
    getSpecificTourUsers: builder.query({
      query: (id) => {
        return {
          url: `/tours/tour/${id}`,
          method: "GET",
        };
      },
      providesTags: ["addNewTour", "updateTour", "deposit", "tourExpense"],
    }),
    getUserForTour: builder.query({
      query: (data) => {
        return {
          url: `/tours/tour/${data}`,
          method: "GET",
        };
      },
      providesTags: ["deleteTourUser"],
    }),
    deleteTourUser: builder.mutation({
      query: (data) => {
        const { id, username } = data;
        return {
          url: `/tours/tour/${id}`,
          method: "DELETE",
          body: { username },
        };
      },
      invalidatesTags: ["deleteTourUser"],
    }),
    updateTour: builder.mutation({
      query: (data) => {
        const { id, ...others } = data;
        return {
          url: `/tours/tour/${id}`,
          method: "PUT",
          body: others,
        };
      },
      invalidatesTags: ["updateTour"],
    }),
    depositForTour: builder.mutation({
      query: (data) => ({
        url: `/tours/deposit/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["deposit"],
    }),
  }),
  overrideExisting: true,
});
export const {
  useGetToursForUserQuery,
  useDepositForTourMutation,
  useDeleteTourUserMutation,
  useGetUserForTourQuery,
  useUpdateTourMutation,
  useCreateTourMutation,
  useCreateExpenseMutation,
  useGetAllExpenseForSpecificTourQuery,
  useUpdateSpecificTourExpenseMutation,
  useDeleteSpecificTourExpenseMutation,
  useGetSpecificTourUsersQuery,
} = tourApi;
