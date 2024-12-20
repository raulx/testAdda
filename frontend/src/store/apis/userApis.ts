import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponseType, GetUserResponseType, UserData } from "@/utils/types";
import { SERVER_BASE_URL } from "@/utils/constants";

const userApis = createApi({
  reducerPath: "userApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/user`,
  }),
  endpoints: (builder) => ({
    getUser: builder.query<ApiResponseType<GetUserResponseType>, null>({
      query: () => {
        return {
          url: "/getUser",
          method: "GET",
        };
      },
    }),

    updateUserName: builder.mutation<
      ApiResponseType<UserData>,
      { username: string }
    >({
      query: ({ username }) => {
        return {
          url: "/updateUserName",
          method: "PATCH",
          body: { username },
        };
      },
    }),
    updateUserAvatar: builder.mutation<ApiResponseType<UserData>, FormData>({
      query: (formData) => {
        return {
          url: "/updateUserAvatar",
          method: "PATCH",
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useUpdateUserNameMutation,
  useUpdateUserAvatarMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
} = userApis;

export default userApis;
