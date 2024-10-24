import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_BASE_URL } from "@/utils/constants";
// import { pause } from "@/utils/helpers";

const questionApis = createApi({
  reducerPath: "questionApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/question`,
    fetchFn: async (...args) => {
      // await pause(3000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    addQuestion: builder.mutation({
      query: (data) => {
        return {
          url: "/add",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllQuestion: builder.query({
      query: () => {
        return {
          url: "/getAllQuestions",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useAddQuestionMutation,
  useGetAllQuestionQuery,
  useLazyGetAllQuestionQuery,
} = questionApis;
export default questionApis;
