import asyncHandler from 'express-async-handler';
import { razorpayInstance } from '../index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import crypto from 'crypto';
import Subscription from '../models/subscription.model.js';

const generateOrder = asyncHandler(async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount) throw new ApiError(400, 'Amount is required');

    const order = await razorpayInstance.orders.create({
        amount: amount * 100,
        currency: currency || 'INR',
    });

    return res
        .status(200)
        .json(new ApiResponse(200, order, 'Order Created Successfully'));
});

const verifyPayment = asyncHandler(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
        next();
    } else {
        throw new ApiError(409, 'InValid Payment Signature');
    }
});

const settlePayment = asyncHandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
    } = req.body;

    const { email } = req.user;

    const newSubscription = await Subscription.create({
        email,
        payment_id: razorpay_payment_id,
        amount_paid: amount,
    });

    res.status(200).json(
        new ApiResponse(200, newSubscription, 'Payment settled successfully')
    );
});

export { generateOrder, verifyPayment, settlePayment };
