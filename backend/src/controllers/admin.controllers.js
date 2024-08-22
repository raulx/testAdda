import asyncHandler from 'express-async-handler';
import { ApiError } from '../utils/ApiError.js';
import Admin from '../models/admin.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerAdmin = asyncHandler(async (req, res) => {
    const { adminId, fullName, password } = req.body;

    if (!adminId || !fullName || !password)
        throw new ApiError(400, 'All fields are required !');

    const newAdmin = await Admin.create({
        admin_id: adminId,
        full_name: fullName,
        password: password,
    });

    res.json(new ApiResponse(200, newAdmin, 'admin registered successfully'));
});

const logInAdmin = asyncHandler(async (req, res) => {
    const { adminId, password } = req.body;

    if (!adminId || !password)
        throw new ApiError(400, 'All fields are required');

    const admin = await Admin.findOne({ admin_id: adminId });

    if (admin && (await admin.isPasswordMatched(password))) {
        const token = await admin.generateToken();

        res.cookie('adminToken', token).json(
            new ApiResponse(
                200,
                { admin_id: admin.admin_id, full_name: admin.full_name },
                'Admin loggedIn successfully'
            )
        );
    } else {
        throw new ApiError(409, 'Password not matched');
    }
});

export { registerAdmin, logInAdmin };
