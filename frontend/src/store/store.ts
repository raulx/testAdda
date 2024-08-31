import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userAuthApi from "./apis/userAuthApis";
import authSlice from "./slices/authSlice";


const store = configureStore({
    reducer:{
        [userAuthApi.reducerPath] : userAuthApi.reducer,
        auth:authSlice.reducer
    },
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware().concat(userAuthApi.middleware)
    }
})

setupListeners(store.dispatch)


export * from "./apis/userAuthApis"
export * from './slices/authSlice'



export default store