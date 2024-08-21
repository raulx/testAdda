import { ApiError } from '../utils/ApiError.js';
import asyncHandler from 'express-async-handler';
import Admin from '../models/admin.model.js';
import jwt from 'jsonwebtoken';

const verifyAdminJwt = asyncHandler(async function (req, _, next) {
    try {
        const token =
            req.cookies?.adminToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, 'Unauthorized request');
        }

        const decodedToken = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

        const admin = await Admin.findById(decodedToken?._id);

        if (!admin) {
            throw new ApiError(409, 'Invalid Access Token');
        }

        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid access token');
    }
});

export default verifyAdminJwt;
