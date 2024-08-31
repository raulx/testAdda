import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginUserType } from "@/utils/types";
import { SERVER_BASE_URL } from "@/utils/constants";

const userAuthApi = createApi({
  reducerPath: "userAuth",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/auth`,
  }),
  endpoints: (builder) => ({
    loginInUser: builder.mutation<LoginUserType,{email:string,password:string}>({
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


export const { useLoginInUserMutation } = userAuthApi;

export default userAuthApi;
