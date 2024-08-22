import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { attemptQuiz } from '../controllers/attempt.controllers.js';

const router = Router();

router.route('/new').post(verifyJwt, attemptQuiz);

export default router;
