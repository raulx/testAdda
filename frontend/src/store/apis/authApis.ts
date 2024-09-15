import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType, UserData } from "@/utils/types";
import { SERVER_BASE_URL } from "@/utils/constants";


const authApis = createApi({
  reducerPath: "authApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/auth`,
  }),
  endpoints: (builder) => ({
    sendEmailOtp:builder.mutation<ApiResponseType<object>,{email:string}>({
      query:(({email}) => {
        return {
          url:'/sendOtp/email',
          method:"POST",
          body:{
            email
          }
        }
      })
    }),
    verifyEmailOtp:builder.mutation<ApiResponseType<UserData>,{email:string,password:string}>({
      query:({email,password}) => {
        return {
          url:"/verifyOtp/email",
          method:'POST',
          body:{
            email,
            otp:password
          }
        }
      }
    }),
    loginInUser: builder.mutation<ApiResponseType,{email:string,password:string}>({
      query: ({email,password}) => {
        return {
          url:'/login',
          method:'POST',
          body:{
            email,password
          }
        }
     } ,
    }),
  }),
});


export const { useLoginInUserMutation,useSendEmailOtpMutation,useVerifyEmailOtpMutation } = authApis;

export default authApis;
