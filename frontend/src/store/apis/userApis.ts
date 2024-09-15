import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType, UserData } from "@/utils/types";
import { SERVER_BASE_URL } from "@/utils/constants";


const userApis = createApi({
    reducerPath:'userApis',
    baseQuery:fetchBaseQuery({
        baseUrl:`${SERVER_BASE_URL}/user`
    }),
    endpoints:(builder) => ({
        updateUserName:builder.mutation<ApiResponseType<UserData>,{username:string}>({
            query:((username)=>{
                return {
                    url:"/update-user",
                    method:'POST',
                    body:{username}
                }
            })
        })
    })

})

export const {useUpdateUserNameMutation} = userApis

export default userApis