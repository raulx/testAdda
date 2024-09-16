import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
    uploadOnCloudinary,
    getPublicId,
    deleteOnCloudinary,
} from '../services/cloudinary.js';

const updateUserName = asyncHandler(async (req, res) => {
    const { username } = req.body;
    console.log(username);
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

export { updateUserAvatar, updateUserName };
