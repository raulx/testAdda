import { Router } from 'express';
import {
    addQuestion,
    getAvailableQuestions,
    removeQuestion,
} from '../controllers/question.controllers.js';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';

const router = Router();

router.route('/getAllQuestions').get(verifyAdminJwt, getAvailableQuestions);

router.route('/addQuestion').post(verifyAdminJwt, addQuestion);

router.route('/removeQuestion').delete(verifyAdminJwt, removeQuestion);

export default router;
