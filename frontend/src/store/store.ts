import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import userApis from "./apis/userApis";
import authApis from "./apis/authApis";
import quizApis from "./apis/testApis";
import quizesSlice from "./slices/quizesSlice";
import ordersApi from "./apis/orderApis";

const store = configureStore({
  reducer: {
    [authApis.reducerPath]: authApis.reducer,
    [userApis.reducerPath]: userApis.reducer,
    [quizApis.reducerPath]: quizApis.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer,
    quizes: quizesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApis.middleware)
      .concat(userApis.middleware)
      .concat(quizApis.middleware)
      .concat(ordersApi.middleware);
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// api's exports
export * from "./apis/authApis";
export * from "./apis/userApis";
export * from "./apis/testApis";
export * from "./apis/orderApis";

// slices exports
export * from "./slices/authSlice";
export * from "./slices/userSlice";
export * from "./slices/quizesSlice";

export default store;
