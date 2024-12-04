import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { attemptTest } from '../controllers/attempt.controllers.js';

const router = Router();

router.route('/new').post(verifyJwt, attemptTest);

export default router;
