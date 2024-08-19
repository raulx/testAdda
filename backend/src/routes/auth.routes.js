import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';

import {
    changeCurrentPassword,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    sendEmailOtp,
    verifyEmailOtp,
} from '../controllers/auth.controllers.js';

const router = Router();

router.route('/sendOtp/email').post(sendEmailOtp);
router.route('/verifyOtp/email').post(verifyEmailOtp);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/refreshToken').patch(refreshAccessToken);
router.route('/changePassword').patch(changeCurrentPassword);
router.route('/logoutUser').post(verifyJwt, logoutUser);

export default router;
