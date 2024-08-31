import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import userAuthApi from './apis/userauthapis'


const store = configureStore({
    reducer:{
        [userAuthApi.reducerPath] : userAuthApi.reducer
    },
    middleware:(getDefaultMiddleware)=>{
        return getDefaultMiddleware().concat(userAuthApi.middleware)
    }
})

setupListeners(store.dispatch)


export * from "./apis/userauthapis"
export default store