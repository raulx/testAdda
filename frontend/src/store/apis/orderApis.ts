import { SERVER_BASE_URL } from "@/utils/constants";
import { ApiResponseType } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type NewOrderType = {
  amount: number;
  amount_due: number;
  amount_paid: number;
  attempts: number;
  currency: string;
  entity: string;
  id: string;
  created_at: number;
  notes: [];
  offer_id: any;
  receipt: any;
  status: string;
};
const ordersApi = createApi({
  reducerPath: "orderApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/orders`,
    fetchFn: async (...args) => {
      return fetch(...args);
    },
  }),
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponseType<NewOrderType>, number>({
      query: (amount) => {
        return {
          url: "/generateOrder",
          method: "POST",
          body: { amount },
        };
      },
    }),
  }),
});

export const { useCreateOrderMutation } = ordersApi;
export default ordersApi;
