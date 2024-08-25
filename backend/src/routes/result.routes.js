import { Router } from 'express';
import { getResult } from '../controllers/result.controllers.js';
import verifyJwt from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/getResult').post(verifyJwt, getResult);

export default router;
