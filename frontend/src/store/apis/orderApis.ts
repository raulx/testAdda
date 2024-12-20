import { SERVER_BASE_URL } from "@/utils/constants";
import { ApiResponseType, UserPassType } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { pause } from "@/utils/helpers";

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
export type PaymentResponseType = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

interface NewPaymentSettleMentType extends PaymentResponseType {
  amount: number;
}

const ordersApi = createApi({
  reducerPath: "orderApis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${SERVER_BASE_URL}/orders`,
    fetchFn: async (...args) => {
      // remove in Production
      // await pause(2000);
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

    verifyAndSettlePayment: builder.mutation<
      ApiResponseType<UserPassType>,
      NewPaymentSettleMentType
    >({
      query: (data) => {
        return {
          url: "/verify-and-settlePayment",
          method: "POST",
          body: { ...data },
        };
      },
    }),
  }),
});

export const { useCreateOrderMutation, useVerifyAndSettlePaymentMutation } =
  ordersApi;
export default ordersApi;
