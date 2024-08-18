import asyncHandler from 'express-async-handler';

const changePassword = asyncHandler(async (req, res) => {
    res.json({
        status: 200,
        isVerified: req.user || 'Not verified',
        message: 'password changed successfully',
    });
});

export default changePassword;
