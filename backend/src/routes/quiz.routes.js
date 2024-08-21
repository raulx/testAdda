import { Router } from 'express';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';
import addQuiz from '../controllers/quiz.controllers.js';

const router = Router();

router.route('/addQuiz').post(verifyAdminJwt, addQuiz);

export default router;
