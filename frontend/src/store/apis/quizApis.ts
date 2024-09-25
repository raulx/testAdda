import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { SERVER_BASE_URL } from "@/utils/constants";
import { ApiResponseType } from "@/utils/types";
import { QuizesResponseType } from "@/utils/types";

const quizApis = createApi({
  reducerPath: "quizApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/quiz`,
  }),
  endpoints: (builder) => ({
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

export const { useLazyGetQuizesQuery } = quizApis;

export default quizApis;
