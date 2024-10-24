import { Router } from 'express';
import {
    addQuestion,
    getAllQuestions,
} from '../controllers/question.controllers.js';

const router = Router();

router.route('/add').post(addQuestion);
router.route('/getAllQuestions').get(getAllQuestions);

export default router;
