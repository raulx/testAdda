import { UserData } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userInitialState:UserData = {
    _id:'',
    email:'',
    username:'',
    avatar_url:'',
    is_subscribed:false,
    createdAt:'',
    updatedAt:''
}


const userSlice = createSlice({
    name:"user",
    initialState:userInitialState,
    reducers:{
        setUser(state,action:PayloadAction<UserData>){
            state = action.payload
        }
    }
})


export const {setUser} = userSlice.actions

export default userSlice