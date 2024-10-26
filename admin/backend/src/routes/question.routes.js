import { Router } from 'express';
import {
    addQuestion,
    getAllQuestions,
    questionSearch,
    removeQuestion,
} from '../controllers/question.controllers.js';

const router = Router();

router.route('/add').post(addQuestion);
router.route('/getAllQuestions').get(getAllQuestions);
router.route('/delete').delete(removeQuestion);
router.route('/questionSearch').get(questionSearch);

export default router;
