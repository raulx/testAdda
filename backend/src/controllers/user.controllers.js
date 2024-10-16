import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Attempt from '../models/attempt.model.js';
import {
    uploadOnCloudinary,
    getPublicId,
    deleteOnCloudinary,
} from '../services/cloudinary.js';
import TestProgress from '../models/testprogress.model.js';

const getUser = asyncHandler(async (req, res) => {
    const user = req.user;

    const testAttempted = await Attempt.aggregate([
        {
            $match: {
                user_id: user._id,
            },
        },
        { $project: { quiz_id: 1, updatedAt: 1 } },
    ]);

    const pausedTests = await TestProgress.aggregate([
        { $match: { userId: user._id } },
        { $project: { quizId: 1 } },
    ]);

    const userData = {
        _id: user._id,
        email: user.email,
        username: user.username,
        avatar_url: user.avatar_url,
        is_subscribed: user.is_subscribed,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        test_attempted: testAttempted.map((attempt) => {
            return { id: attempt.quiz_id, attempted_on: attempt.updatedAt };
        }),
        paused_tests: pausedTests.map((test) => test.quizId),
    };

    res.json(new ApiResponse(200, userData, 'user data fetched successfully'));
});

const updateUserName = asyncHandler(async (req, res) => {
    const { username } = req.body;
    const user = req.user;

    if (!username) throw new ApiError(401, 'All Fields are required !');

    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { username: username } },
        { new: true }
    ).select('-refreshToken');

    res.json(new ApiResponse(200, updatedUser, 'Name changed successfully'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is missing');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    //delete old image if there is any
    const currentAvatar = req.user.avatar_url;
    if (currentAvatar != '') {
        //getPublicId takes two arguments cloudinaryUrl and folder where images are stored in cloudinary if so,else leave it empty.
        const publicId = getPublicId(currentAvatar, 'testAdda/usersAvatar');

        await deleteOnCloudinary(publicId);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar_url: avatar.url,
            },
        },
        { new: true }
    ).select('-password -refreshToken');

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'Avatar image updated successfully'));
});

export { updateUserAvatar, updateUserName, getUser };
