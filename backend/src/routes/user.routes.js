import { Router } from 'express';
import {
  registerUser,
  sendEmailOtp,
  verifyEmailOtp,
} from '../controllers/auth.controllers.js';

const router = Router();

router.route('/sendOtp/email').post(sendEmailOtp);
router.route('/verifyOtp/email').post(verifyEmailOtp);
router.route('/register').post(registerUser);

export default router;
