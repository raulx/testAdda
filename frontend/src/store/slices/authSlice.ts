import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface AuthStateType {
    isLoggedIn: boolean,
    _id:string 
}

const AuthInitialState:{data:AuthStateType} = {
    data:{
        isLoggedIn:localStorage.getItem('auth') ? true : false,
        _id:''
    }
}

const authSlice = createSlice({
    name:'auth',
    initialState:AuthInitialState,
    reducers:{
        logInUser(state,action:PayloadAction<string>){
            localStorage.setItem('auth',JSON.stringify({isLoggedIn:true,_id:action.payload}))
            state.data._id = action.payload
            state.data.isLoggedIn = true
        },
        logOutUser(state){
            localStorage.removeItem('auth')
            state.data._id = ''
            state.data.isLoggedIn = false
        }
    }
}) 

export const {logInUser,logOutUser} = authSlice.actions

export default authSlice