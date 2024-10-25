import { Router } from 'express';
import {
    addQuestion,
    getAllQuestions,
    removeQuestion,
} from '../controllers/question.controllers.js';

const router = Router();

router.route('/add').post(addQuestion);
router.route('/getAllQuestions').get(getAllQuestions);
router.route('/delete').delete(removeQuestion);

export default router;
