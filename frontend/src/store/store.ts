import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";
import userApis from "./apis/userApis";
import authApis from "./apis/authApis";


const store = configureStore({
    reducer:{
        [authApis.reducerPath]:authApis.reducer,
        [userApis.reducerPath]:userApis.reducer,
        auth:authSlice.reducer,
        user:userSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware().concat(authApis.middleware).concat(userApis.middleware)
    }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// slices exports 
export * from './slices/authSlice'
export * from "./slices/userSlice"

// api's exports 
export * from "./apis/authApis"
export * from "./apis/userApis"

export default store