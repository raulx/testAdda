import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';

import {
    emailOtpLogin,
    googleLogin,
    logoutUser,
    refreshAccessToken,
    sendEmailOtp,
} from '../controllers/auth.controllers.js';

const router = Router();

router.route('/sendOtp/email').post(sendEmailOtp);
router.route('/login/emailOtpLogin').post(emailOtpLogin);
router.route('/login/googleLogin').post(googleLogin);
router.route('/refreshToken').patch(refreshAccessToken);
router.route('/logoutUser').post(verifyJwt, logoutUser);

export default router;
