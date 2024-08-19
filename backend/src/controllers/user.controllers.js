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
    const { firstName, lastName } = req.body;
    const user = req.user;

    if (!firstName || !lastName)
        throw new ApiError(401, 'Both FirstName and LastName are required');
    const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: { firstName: firstName, lastName: lastName } },
        { new: true }
    ).select('-password -refreshToken');

    res.json(new ApiResponse(200, updatedUser, 'Name changed successfully'));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, 'Avatar file is missing');
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, 'Error while uploading on avatar');
    }

    // const currentAvatar = await User.findById(req.user?._id, 'avatar');

    //delete old image if there is any
    const currentAvatar = req.user.avatarUrl;
    if (currentAvatar != '') {
        //getPublicId takes two arguments cloudinaryUrl and folder where images are stored in cloudinary if so,else leave it empty.
        const publicId = getPublicId(currentAvatar, 'testAdda/usersAvatar');

        await deleteOnCloudinary(publicId);
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatarUrl: avatar.url,
            },
        },
        { new: true }
    ).select('-password -refreshToken');

    return res
        .status(200)
        .json(new ApiResponse(200, user, 'Avatar image updated successfully'));
});

export { updateUserAvatar, updateUserName };
