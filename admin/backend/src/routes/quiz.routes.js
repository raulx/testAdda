import { Router } from 'express';
import {
    addQuiz,
    deleteQuiz,
    getQuizes,
} from '../controllers/quiz.controllers.js';

const router = Router();

router.route('/new').post(addQuiz);
router.route('/all').get(getQuizes);
router.route('/quiz').delete(deleteQuiz);

export default router;
