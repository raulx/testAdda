import { Router } from 'express';
import { addQuestion } from '../controllers/question.controllers.js';

const router = Router();

router.route('/add').post(addQuestion);

export default router;
