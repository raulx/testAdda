import asyncHandler from 'express-async-handler';
import { razorpayInstance } from '../index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

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

export { generateOrder };
