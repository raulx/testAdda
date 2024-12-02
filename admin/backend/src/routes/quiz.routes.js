import { Router } from 'express';
import { addQuiz, getQuizes } from '../controllers/quiz.controllers.js';

const router = Router();

router.route('/new').post(addQuiz);
router.route('/all').get(getQuizes);

export default router;
