import { Router } from 'express';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';
import {
    addQuiz,
    getQuizes,
    removeQuiz,
} from '../controllers/quiz.controllers.js';

import verifyJwt from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/addQuiz').post(verifyAdminJwt, addQuiz);
router.route('/removeQuiz').delete(verifyAdminJwt, removeQuiz);

router.route('/getQuizes').get(verifyJwt, getQuizes);

export default router;
