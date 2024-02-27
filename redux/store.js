import { configureStore } from "@reduxjs/toolkit";
import logger from "./middleware/logger";
import { baseApi } from "./features/api/baseApi";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([baseApi.middleware]),
});
