import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType } from "@/utils/types";
import { SERVER_BASE_URL } from "@/utils/constants";
import { UserLoginResponseType } from "@/utils/types";

const authApis = createApi({
  reducerPath: "authApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/auth`,
  }),
  endpoints: (builder) => ({
    sendEmailOtp: builder.mutation<ApiResponseType<object>, { email: string }>({
      query: ({ email }) => {
        return {
          url: "/sendOtp/email",
          method: "POST",
          body: {
            email,
          },
        };
      },
    }),
    verifyEmailOtp: builder.mutation<
      ApiResponseType<UserLoginResponseType>,
      { email: string; password: string }
    >({
      query: ({ email, password }) => {
        return {
          url: "/login/emailOtpLogin",
          method: "POST",
          body: {
            email,
            otp: password,
          },
        };
      },
    }),

    refreshLogin: builder.mutation<
      ApiResponseType<UserLoginResponseType>,
      null
    >({
      query: () => {
        return {
          url: "/refreshToken",
          method: "PATCH",
        };
      },
    }),

    googleLogin: builder.mutation<
      ApiResponseType<UserLoginResponseType>,
      string
    >({
      query: (token) => {
        return {
          url: "/login/googleLogin",
          method: "POST",
          body: { token },
        };
      },
    }),

    logOutUser: builder.mutation<ApiResponseType, null>({
      query: () => {
        return {
          url: "/logoutUser",
          method: "POST",
        };
      },
    }),
  }),
});

export const {
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
  useLogOutUserMutation,
  useRefreshLoginMutation,
  useGoogleLoginMutation,
} = authApis;

export default authApis;
