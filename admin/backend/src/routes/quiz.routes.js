import { Router } from 'express';
import { addQuiz } from '../controllers/quiz.controllers.js';

const router = Router();

router.route('/new').post(addQuiz);

export default router;
