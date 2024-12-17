import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import questionApis from "./apis/questionApis";
import quizesApi from "./apis/testsApis";

const store = configureStore({
  reducer: {
    [questionApis.reducerPath]: questionApis.reducer,
    [quizesApi.reducerPath]: quizesApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(questionApis.middleware)
      .concat(quizesApi.middleware);
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Api Exports
export * from "./apis/questionApis";
export * from "./apis/testsApis";
// Slices Exports

export default store;
