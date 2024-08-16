import { Router } from 'express';
import { sendEmailOtp } from '../controllers/user.controllers.js';

const router = Router();

router.route('/sendOtp/email').post(sendEmailOtp);

export default router;
