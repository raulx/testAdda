import asyncHandler from 'express-async-handler';
import { sendMail } from '../services/nodeMailer.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import getTemplate from '../utils/getTemplate.js';
import { Otp } from '../models/otp.model.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

// helper functions

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            `Something went wrong while generating refresh and access token with message:${error.message}`
        );
    }
};

// route controllers

const sendEmailOtp = asyncHandler(async (req, res) => {
    // an otp is send to the email and saved with a ttl Index in Otp collection that expires after 10min.
    const { email } = req.body;

    if (!email) throw new ApiError(400, 'Email is required');

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    const htmlTemplate = getTemplate('emailTemplate');
    const htmlContent = htmlTemplate.replace('{{OTP_CODE}}', otpCode);

    // Mail Sent to the email with new optCode.
    await sendMail({
        to: email,
        subject: 'Your Otp Code',
        html: htmlContent,
    });

    // new otpCode saved in otp collection, see otp.model.js

    const newOtp = await Otp.create({
        clientId: email,
        otp: otpCode,
    });

    //note*:otp model has a ttl index referring updatedAt field. i.e: it gets expired after 10 min from the last update.
    res.json(new ApiResponse(200, newOtp, 'Otp Send Successfully'));
});

const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email) throw new ApiError(400, 'Email is required');

    const existingOtp = await Otp.findOne({ clientId: email });

    if (!existingOtp) {
        throw new ApiError(400, 'Session Expired !!');
    }

    if (existingOtp && (await existingOtp.matchOtp(otp))) {
        await existingOtp.updateOne({ isVerified: true });

        res.json(
            new ApiResponse(
                200,
                { clientId: email, otpVerified: true },
                'Verified Successfully'
            )
        );
    } else {
        throw new ApiError(400, 'OTP Not Matched !!');
    }
});

const registerUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new ApiError(400, 'All Fields are required !');

    const userExists = await User.findOne({ email: email });

    if (userExists) throw new ApiError(409, 'User Already Exists');

    const newUser = await User.create({ email: email, password: password });

    const responseData = {
        email: newUser.email,
        isSubscribed: newUser.isSubscribed,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatarUrl: newUser.avatarUrl,
    };

    res.json(
        new ApiResponse(200, responseData, 'User Registered Successfully')
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        throw new ApiError(400, 'All Fields are required !');

    const user = await User.findOne({ email: email });

    if (!user) throw new ApiError(404, 'User Not Found !');

    if (user && (await user.isPasswordCorrect(password))) {
        const { accessToken, refreshToken } =
            await generateAccessAndRefereshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, 'User Logged In successfully !'));
    } else {
        throw new ApiError(401, 'Password not matched !');
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, 'unauthorized request');
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Refresh token is expired or used');
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    'Access token refreshed'
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token');
    }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, 'Old and new password is required');
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordMatched(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, 'Invalid old password');
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, 'Password changed successfully'));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, 'User logged Out'));
});

export {
    sendEmailOtp,
    verifyEmailOtp,
    registerUser,
    loginUser,
    refreshAccessToken,
    changeCurrentPassword,
    logoutUser,
};
