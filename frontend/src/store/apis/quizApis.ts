import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SERVER_BASE_URL } from "@/utils/constants";
import { ApiResponseType, QuizesResponseType } from "@/utils/types";
import { QuizResponseType } from "@/utils/types";
import { pause } from "@/utils/helpers";
import { AttemptProgressType } from "@/pages/AttemptPage";
interface AttemptType {
  quizId: string;
  questionsAttempted: {
    questionId: string;
    timeTaken: number;
    answerMarked: string;
  }[];
}
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
    submitQuiz: builder.mutation<ApiResponseType<string>, AttemptType>({
      query: (data) => {
        return {
          url: `/attempt/new`,
          method: "POST",
          body: data,
        };
      },
    }),
    saveQuiz: builder.mutation<ApiResponseType<object>, AttemptProgressType>({
      query: (data) => {
        return {
          url: "/saveQuizProgress",
          method: "POST",
          body: data,
        };
      },
    }),
    getQuiz: builder.query<ApiResponseType<QuizResponseType>, string>({
      query: (_id) => {
        return {
          url: `/getQuiz?quiz_id=${_id}`,
          method: "GET",
        };
      },
    }),
    getQuizes: builder.query<ApiResponseType<QuizesResponseType>, null>({
      query: () => {
        return {
          url: "/getQuizes",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLazyGetQuizesQuery,
  useLazyGetQuizQuery,
  useGetQuizQuery,
  useSubmitQuizMutation,
  useSaveQuizMutation,
} = quizApis;

export default quizApis;
