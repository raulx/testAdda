import { UserData } from "@/utils/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const userInitialState:{user:UserData} = {
    user:{
    _id:'',
    email:'',
    username:'',
    avatar_url:'',
    is_subscribed:false,
    createdAt:'',
    updatedAt:''
    },
}

const userSlice = createSlice({
    name:"user",
    initialState:userInitialState,
    reducers:{
        setUser(state,action:PayloadAction<UserData>){
            state.user = action.payload
        },
        updateUserName(state,action:PayloadAction<string>){
            state.user.username = action.payload 
        },
        updateUserAvatar(state,action:PayloadAction<string>){
            state.user.avatar_url = action.payload
        }
    }
})


export const {setUser,updateUserName,updateUserAvatar} = userSlice.actions

export default userSlice