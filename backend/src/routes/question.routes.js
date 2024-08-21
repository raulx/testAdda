import { Router } from 'express';
import { addQuestion } from '../controllers/question.controllers.js';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';

const router = Router();

router.route('/addQuestion').post(verifyAdminJwt, addQuestion);

export default router;
