import { SERVER_BASE_URL } from "@/utils/constants";
import ApiResponse from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type QuizDataType = {
  title: string;
  description: string;
  access_type: "free" | "paid";
  duration: number;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  questions: string[];
};
const quizesApi = createApi({
  reducerPath: "quizesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/quizes`,
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    addQuiz: builder.mutation<ApiResponse<QuizDataType>, QuizDataType>({
      query: (data) => {
        return {
          url: "/new",
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useAddQuizMutation } = quizesApi;
export default quizesApi;
