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

        user.refresh_token = refreshToken;
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

    // remove older otp if it exists
    await Otp.findOneAndDelete({ client_id: email });

    // if (otpAlreadySent) throw new ApiError(409, 'Otp Already Sent');

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit otp will be generated.
    const htmlTemplate = getTemplate('emailTemplate');
    const htmlContent = htmlTemplate.replace('{{OTP_CODE}}', otpCode);

    // Mail Sent to the email with new optCode.
    await sendMail({
        to: email,
        subject: 'Your Otp Code',
        html: htmlContent,
    });

    // new otpCode saved in otp collection, see otp.model.js

    await Otp.create({
        client_id: email,
        otp: otpCode,
    });

    //note*:otp model has a ttl index referring updatedAt field. i.e: it gets expired after 10 min from the last update.
    res.json(new ApiResponse(200, {}, 'Otp Send Successfully'));
});

const verifyEmailOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email) throw new ApiError(400, 'Email is required');

    const existingOtp = await Otp.findOne({ client_id: email });

    if (!existingOtp) {
        throw new ApiError(409, 'Session Expired !!');
    }

    if (existingOtp && (await existingOtp.matchOtp(otp))) {
        await existingOtp.updateOne({ is_verified: true });
        req.token = 'otp';
        loginUser(req, res);
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
        isSubscribed: newUser.is_subscribed,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        avatarUrl: newUser.avatar_name,
    };

    res.json(
        new ApiResponse(200, responseData, 'User Registered Successfully')
    );
});

const loginUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const token = req.token;

    if (!token) throw new ApiError(401, 'Token Not Found !');

    if (!email) throw new ApiError(400, 'All Fields are required !');

    let user = await User.findOne({ email: email }).select('-refresh_token');

    //create user if user not exist
    if (!user) {
        const newUser = await User.create({ email: email });
        user = newUser;
    }
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
        user._id
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res.cookie('accessToken', accessToken, {
        ...options,
        maxAge: 24 * 60 * 60 * 1000,
    })
        .cookie('refreshToken', refreshToken, {
            ...options,
            maxAge: 24 * 60 * 60 * 1000 * 10,
        })
        .json(
            new ApiResponse(
                200,
                {
                    _id: user._id,
                    username: user.username,
                    avatar_url: user.avatar_url,
                },
                'User Logged In successfully !'
            )
        );
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
            throw new ApiError(409, 'Invalid refresh token');
        }

        if (incomingRefreshToken !== user?.refresh_token) {
            throw new ApiError(409, 'Refresh token is expired or used');
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
        throw new ApiError(400, 'Old and New password is Required !');
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(409, 'Invalid old password');
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
