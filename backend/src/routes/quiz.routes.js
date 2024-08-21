import { Router } from 'express';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';
import { addQuiz, removeQuiz } from '../controllers/quiz.controllers.js';

const router = Router();

router.route('/addQuiz').post(verifyAdminJwt, addQuiz);
router.route('/removeQuiz').delete(verifyAdminJwt, removeQuiz);

export default router;
