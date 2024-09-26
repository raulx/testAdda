import { Router } from 'express';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';
import {
    addQuiz,
    getQuizes,
    getQuiz,
    removeQuiz,
} from '../controllers/quiz.controllers.js';

import verifyJwt from '../middlewares/auth.middleware.js';

const router = Router();

// for admin purposes
router.route('/addQuiz').post(verifyAdminJwt, addQuiz);
router.route('/removeQuiz').delete(verifyAdminJwt, removeQuiz);

// for application
router.route('/getQuizes').get(verifyJwt, getQuizes);
router.route('/getQuiz').get(verifyJwt, getQuiz);

export default router;
