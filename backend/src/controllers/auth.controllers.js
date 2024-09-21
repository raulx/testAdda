import asyncHandler from 'express-async-handler';
import { sendMail } from '../services/nodeMailer.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import getTemplate from '../utils/getTemplate.js';
import { Otp } from '../models/otp.model.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { oauth2Client } from '../index.js';
import { google } from 'googleapis';

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

const sendEmailOtp = asyncHandler(async (req, res) => {
    // an otp is send to the email and saved with a ttl Index in Otp collection that expires after 10min.
    const { email } = req.body;
    if (!email) throw new ApiError(400, 'Email is required');

    // remove older otp if it exists
    await Otp.findOneAndDelete({ client_id: email });
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

const emailOtpLogin = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email) throw new ApiError(400, 'Email is required');

    const existingOtp = await Otp.findOne({ client_id: email });

    if (!existingOtp) {
        throw new ApiError(409, 'Session Expired !!');
    }

    // if otp matches then login the user.
    if (existingOtp && (await existingOtp.matchOtp(otp))) {
        await existingOtp.updateOne({ is_verified: true });

        let user = await User.findOne({ email: email }).select(
            '-refresh_token'
        );

        //create user if doesn't exists.
        if (!user) {
            const newUser = await User.create({ email: email });
            user = newUser;
        }
        const { accessToken, refreshToken } =
            await generateAccessAndRefereshTokens(user._id);

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
        // req.token = 'otp';
        // loginUser(req, res);
    } else {
        throw new ApiError(400, 'OTP Not Matched !!');
    }
});

const googleLogin = asyncHandler(async (req, res) => {
    const { token } = req.body;

    try {
        const { tokens } = await oauth2Client.getToken(token);

        oauth2Client.setCredentials(tokens);

        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });

        const { data: userInfo } = await oauth2.userinfo.get();
        let user = await User.findOne({ email: userInfo.email });
        if (!user) {
            const newUserData = {
                email: userInfo.email,
                username: userInfo.name,
                avatar_url: userInfo.picture,
            };

            user = await User.create(newUserData);
        } else {
            // change the profile pic and name with updated user data from google.
            (user.username = userInfo.name),
                (user.avatar_url = userInfo.picture);
            await user.save({ validateBeforeSave: true });
        }

        const { accessToken, refreshToken } =
            await generateAccessAndRefereshTokens(user._id);

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
    } catch (error) {
        console.log(error);
    }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, 'Session Expired !');
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
            secure: process.env.NODE_ENV === 'production',
        };

        const { accessToken, refreshToken } =
            await generateAccessAndRefereshTokens(user._id);

        return res
            .status(200)
            .cookie('accessToken', accessToken, {
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
                    'Access token refreshed'
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token');
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refresh_token: 1, // this removes the field from document
            },
        },
        {
            new: true,
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    return res
        .status(200)
        .clearCookie('accessToken', {
            ...options,
        })
        .clearCookie('refreshToken', {
            ...options,
        })
        .json(new ApiResponse(200, {}, 'User logged Out'));
});

export {
    sendEmailOtp,
    emailOtpLogin,
    refreshAccessToken,
    logoutUser,
    googleLogin,
};
