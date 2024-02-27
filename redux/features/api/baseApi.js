import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: [
    "addNewTour",
    "deleteTourUser",
    "updateTour",
    "deposit",
    "tourExpense",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `https://hq-tast-backend.vercel.app/api/v1`,
  }),
  endpoints: () => ({}),
});
