import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userAuthApi from "./apis/userAuthApis";
import authSlice from "./slices/authSlice";
import userSlice from "./slices/userSlice";


const store = configureStore({
    reducer:{
        [userAuthApi.reducerPath] : userAuthApi.reducer,
        auth:authSlice.reducer,
        user:userSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware().concat(userAuthApi.middleware)
    }
})

setupListeners(store.dispatch)

// slices exports 
export * from './slices/authSlice'
export * from "./slices/userSlice"

// api's exports 
export * from "./apis/userAuthApis"

export default store