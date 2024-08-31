import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:'auth',
    initialState:{isAuthed:localStorage.getItem('auth') || false},
    reducers:{
        setAuthenticated(state){
            localStorage.setItem('auth',JSON.stringify({isAuthed:true}))
            state.isAuthed = true
        },
        removeAuthenticated(state){
            localStorage.removeItem('auth')
            state.isAuthed = false
        }
    }
}) 

export const {setAuthenticated,removeAuthenticated} = authSlice.actions

export default authSlice