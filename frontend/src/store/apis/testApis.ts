import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SERVER_BASE_URL } from "@/utils/constants";
import { ApiResponseType, TestsResponseType } from "@/utils/types";
import { TestResponseType } from "@/utils/types";
// import { pause } from "@/utils/helpers";

import { AttemptProgressType } from "@/pages/AttemptWindow";
interface AttemptType {
  quizId: string;
  questionsAttempted: {
    questionId: string;
    timeTaken: number;
    answerMarked: string;
  }[];
}

const quizApis = createApi({
  reducerPath: "testApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/test`,
    fetchFn: async (...args) => {
      // remove in Production
      // await pause(2000);
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    submitTest: builder.mutation<ApiResponseType<string>, AttemptType>({
      query: (data) => {
        return {
          url: `/attempt/new`,
          method: "POST",
          body: data,
        };
      },
    }),
    saveTest: builder.mutation<ApiResponseType<object>, AttemptProgressType>({
      query: (data) => {
        return {
          url: "/saveTestProgress",
          method: "POST",
          body: data,
        };
      },
    }),
    getTestProgress: builder.query<
      ApiResponseType<AttemptProgressType>,
      string
    >({
      query: (quizId) => {
        return {
          url: `/getTestProgress?quizId=${quizId}`,
          method: "GET",
        };
      },
    }),
    getTest: builder.query<ApiResponseType<TestResponseType>, string>({
      query: (_id) => {
        return {
          url: `/getTest?quiz_id=${_id}`,
          method: "GET",
        };
      },
    }),
    getResult: builder.mutation({
      query: (data) => {
        return {
          url: "/result",
          body: data,
          method: "POST",
        };
      },
    }),
    getTests: builder.query<ApiResponseType<TestsResponseType>, null>({
      query: () => {
        return {
          url: "/getTests",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useLazyGetTestsQuery,
  useLazyGetTestQuery,
  useGetTestQuery,
  useSubmitTestMutation,
  useSaveTestMutation,
  useGetTestProgressQuery,
  useLazyGetTestProgressQuery,
  useGetResultMutation,
} = quizApis;

export default quizApis;
