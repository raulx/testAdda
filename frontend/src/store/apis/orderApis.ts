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
export type PaymentResponseType = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type NewSubscriptionType = {
  email: string;
  payment_id: string;
  amount_paid: number;
  expires_in: Date;
  createdAt: Date;
};

interface NewPaymentSettleMentType extends PaymentResponseType {
  amount: number;
}

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

    verifyAndSettlePayment: builder.mutation<
      ApiResponseType<NewSubscriptionType>,
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
