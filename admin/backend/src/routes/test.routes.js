import { Router } from 'express';
import {
    addTest,
    deleteTest,
    getTests,
} from '../controllers/quiz.controllers.js';

const router = Router();

router.route('/new').post(addTest);
router.route('/all').get(getTests);
router.route('/test').delete(deleteTest);

export default router;
