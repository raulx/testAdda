import { Router } from 'express';
import {
  loginUser,
  registerUser,
  sendEmailOtp,
  verifyEmailOtp,
} from '../controllers/auth.controllers.js';

const router = Router();

router.route('/sendOtp/email').post(sendEmailOtp);
router.route('/verifyOtp/email').post(verifyEmailOtp);
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

export default router;
