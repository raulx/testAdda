import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_URL = "/api";
interface user {
  name: string;
}
const userAuthApi = createApi({
  reducerPath: "userAuth",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  endpoints: (builder) => ({
    loginInUser: builder.query<user, string>({
      query: (name) => `pokemon/${name}`,
    }),
  }),
});

export const { useLoginInUserQuery } = userAuthApi;
export const { useLazyLoginInUserQuery } = userAuthApi;

export default userAuthApi;
