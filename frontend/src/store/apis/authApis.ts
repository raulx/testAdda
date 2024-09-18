import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType,} from "@/utils/types";
import { SERVER_BASE_URL } from "@/utils/constants";
import { UserLoginResponseType } from "@/utils/types";


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
    verifyEmailOtp:builder.mutation<ApiResponseType<UserLoginResponseType>,{email:string,password:string}>({
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
    logInUser: builder.mutation<ApiResponseType,{email:string,password:string}>({
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
    logOutUser:builder.mutation<ApiResponseType,null>({
      query:(()=>{
        return {
          url:'/logoutUser',
          method:'POST',
        }
      })
    })
  }),
});


export const { useLogInUserMutation,useSendEmailOtpMutation,useVerifyEmailOtpMutation,useLogOutUserMutation } = authApis;

export default authApis;
