import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import Admin from '../models/admin.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerAdmin = asyncHandler(async (req, res) => {
    const { adminId, fullName, password } = req.body;

    if (!adminId || !fullName || !password)
        throw new ApiError(401, 'All fields are required !');

    const newAdmin = await Admin.create({ adminId, fullName, password });

    res.json(new ApiResponse(200, newAdmin, 'admin registered successfully'));
});

const logInAdmin = asyncHandler(async (req, res) => {
    const { adminId, password } = req.body;

    if (!adminId || !password)
        throw new ApiError(401, 'All fields are required');

    const admin = await Admin.findOne({ adminId: adminId });

    if (admin && (await admin.isPasswordMatched(password))) {
        const token = await admin.generateToken();

        res.cookie('adminToken', token).json(
            new ApiResponse(200, admin, 'Admin loggedIn successfully')
        );
    } else {
        throw new ApiError(401, 'Password not matched');
    }
});

export { registerAdmin, logInAdmin };
