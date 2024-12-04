import { SERVER_BASE_URL } from "@/utils/constants";
import ApiResponse from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { QuestionData } from "./questionApis";

export interface TestDataSentType<T = string | QuestionData> {
  title: string;
  description: string;
  access_type: "free" | "paid";
  duration: number;
  difficulty_level: "beginner" | "intermediate" | "advanced";
  questions: T[];
}
export interface TestDataResponseType extends TestDataSentType<QuestionData> {
  createdAt: string;
  _id: string;
}

const testsApi = createApi({
  reducerPath: "testsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/tests`,
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    getTests: builder.query<ApiResponse<TestDataResponseType[]>, null>({
      query: () => {
        return {
          url: "/all",
          method: "GET",
        };
      },
    }),
    addTest: builder.mutation<
      ApiResponse<TestDataResponseType>,
      TestDataSentType<string>
    >({
      query: (data) => {
        return {
          url: "/new",
          method: "POST",
          body: data,
        };
      },
    }),
    deleteTest: builder.mutation<ApiResponse<object>, string>({
      query: (quiz_id) => {
        return {
          url: "/test",
          method: "DELETE",
          body: { quiz_id },
        };
      },
    }),
  }),
});

export const {
  useAddTestMutation,
  useGetTestsQuery,
  useLazyGetTestsQuery,
  useDeleteTestMutation,
} = testsApi;
export default testsApi;
