import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_BASE_URL } from "@/utils/constants";
import ApiResponse from "@/utils/types";
// import { pause } from "@/utils/helpers";

export type QuestionData = {
  avg_solving_time: string;
  correct_option: string;
  createdAt: string;
  difficulty: string;
  explaination: string;
  options: { a: string; b: string; c: string; d: string };
  question: string;
  exam: string;

  subject: string;
  topic: string;
  quiz_id: string | null | undefined;
  updatedAt: string;
  _id: string;
  __v: number;
};

type QuestionDataSend = {
  correct_option: string;
  difficulty: string;
  explaination: string;
  options: { a: string; b: string; c: string; d: string };
  question: string;
  subject: string;
  topic: string;
};

export type AllQuestion = QuestionData[];

const questionApis = createApi({
  reducerPath: "questionApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/question`,
    fetchFn: async (...args) => {
      // await pause(3000);
      return fetch(...args);
    },
  }),

  tagTypes: ["GetAllQuestions"],

  endpoints: (builder) => ({
    addQuestion: builder.mutation<ApiResponse<QuestionData>, QuestionDataSend>({
      invalidatesTags: () => {
        return [{ type: "GetAllQuestions" }];
      },
      query: (data) => {
        return {
          url: "/add",
          method: "POST",
          body: data,
        };
      },
    }),
    getAllQuestion: builder.query<ApiResponse<AllQuestion>, null>({
      providesTags: () => {
        return [{ type: "GetAllQuestions" }];
      },
      query: () => {
        return {
          url: "/getAllQuestions",
          method: "GET",
        };
      },
    }),
    questionSearch: builder.query({
      query: (text) => {
        return {
          url: `/questionSearch?questionText=${text}`,
          method: "GET",
        };
      },
    }),
    removeQuestion: builder.mutation<
      ApiResponse<QuestionData>,
      { _id: string }
    >({
      query: (data) => {
        return {
          url: "/delete",
          method: "DELETE",
          body: data,
        };
      },
    }),
  }),
});

export const {
  useAddQuestionMutation,
  useGetAllQuestionQuery,
  useLazyGetAllQuestionQuery,
  useRemoveQuestionMutation,
  useLazyQuestionSearchQuery,
} = questionApis;
export default questionApis;
