import { SERVER_BASE_URL } from "@/utils/constants";
import ApiResponse from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { QuestionData } from "./questionApis";

export interface QuizDataSentType<T = string | QuestionData> {
  title: string;
  description: string;
  access_type: "free" | "paid";
  duration: number;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  questions: T[];
}
export interface QuizDataResponseType extends QuizDataSentType<QuestionData> {
  createdAt: string;
  _id: string;
}

const quizesApi = createApi({
  reducerPath: "quizesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/quizes`,
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getQuizes: builder.query<ApiResponse<QuizDataResponseType[]>, null>({
      query: () => {
        return {
          url: "/all",
          method: "GET",
        };
      },
    }),
    addQuiz: builder.mutation<
      ApiResponse<QuizDataResponseType>,
      QuizDataSentType<string>
    >({
      query: (data) => {
        return {
          url: "/new",
          method: "POST",
          body: data,
        };
      },
    }),
    deleteQuiz: builder.mutation<ApiResponse<object>, string>({
      query: (quiz_id) => {
        return {
          url: "/quiz",
          method: "DELETE",
          body: { quiz_id },
        };
      },
    }),
  }),
});

export const {
  useAddQuizMutation,
  useGetQuizesQuery,
  useLazyGetQuizesQuery,
  useDeleteQuizMutation,
} = quizesApi;
export default quizesApi;
