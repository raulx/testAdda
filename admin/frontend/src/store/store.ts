import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import questionApis from "./apis/questionApis";
import questionsSlice from "./slices/questionsSlice";

const store = configureStore({
  reducer: {
    [questionApis.reducerPath]: questionApis.reducer,
    questions: questionsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(questionApis.middleware);
  },
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Api Exports
export * from "./apis/questionApis";
// Slices Exports

export * from "./slices/questionsSlice";

export default store;
