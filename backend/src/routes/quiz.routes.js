import { Router } from 'express';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';
import {
    addQuiz,
    getQuizes,
    getQuiz,
    removeQuiz,
    saveQuizProgress,
    getQuizProgress,
} from '../controllers/quiz.controllers.js';

import verifyJwt from '../middlewares/auth.middleware.js';
import { attemptQuiz } from '../controllers/attempt.controllers.js';
import { getResult } from '../controllers/result.controllers.js';

const router = Router();

// for admin purposes
router.route('/addQuiz').post(verifyAdminJwt, addQuiz);
router.route('/removeQuiz').delete(verifyAdminJwt, removeQuiz);

// for application
router.route('/getQuizes').get(verifyJwt, getQuizes);
router.route('/getQuiz').get(verifyJwt, getQuiz);
router.route('/saveQuizProgress').post(verifyJwt, saveQuizProgress);
router.route('/getQuizProgress').get(verifyJwt, getQuizProgress);
router.route('/attempt/new').post(verifyJwt, attemptQuiz);
router.route('/result').post(verifyJwt, getResult);

export default router;
