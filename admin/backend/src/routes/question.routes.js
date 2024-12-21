import { Router } from 'express';
import {
    addQuestion,
    getAllQuestions,
    questionSearch,
    removeQuestion,
} from '../controllers/question.controllers.js';
import upload from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/add').post(
    upload.fields([
        { name: 'question_figure', maxCount: 1 },
        { name: 'option_a_figure', maxCount: 1 },
        { name: 'option_b_figure', maxCount: 1 },
        { name: 'option_c_figure', maxCount: 1 },
        { name: 'option_d_figure', maxCount: 1 },
    ]),
    addQuestion
);
router.route('/getAllQuestions').get(getAllQuestions);
router.route('/delete').delete(removeQuestion);
router.route('/questionSearch').get(questionSearch);

export default router;
