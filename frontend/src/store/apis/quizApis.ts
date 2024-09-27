import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SERVER_BASE_URL } from "@/utils/constants";
import { ApiResponseType } from "@/utils/types";
import { QuizResponseType } from "@/utils/types";
import { pause } from "@/utils/helpers";

const quizApis = createApi({
  reducerPath: "quizApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/quiz`,
    fetchFn: async (...args) => {
      // remove in Production
      await pause(2000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getQuiz: builder.query<ApiResponseType<QuizResponseType>, string>({
      query: (_id) => {
        return {
          url: `/getQuiz?quiz_id=${_id}`,
          method: "GET",
        };
      },
    }),
    getQuizes: builder.query<ApiResponseType<QuizResponseType>, null>({
      query: () => {
        return {
          url: "/getQuizes",
          method: "GET",
        };
      },
    }),
  }),
});

export const { useLazyGetQuizesQuery, useLazyGetQuizQuery, useGetQuizQuery } =
  quizApis;

export default quizApis;
