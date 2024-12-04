import { Router } from 'express';
import verifyAdminJwt from '../middlewares/auth.admin.middleware.js';
import {
    addTest,
    getTests,
    getTest,
    removeTest,
    saveTestProgress,
    getTestProgress,
} from '../controllers/test.controllers.js';

import verifyJwt from '../middlewares/auth.middleware.js';

import { attemptTest } from '../controllers/attempt.controllers.js';
import { getResult } from '../controllers/result.controllers.js';

const router = Router();

// for admin purposes
router.route('/addTest').post(verifyAdminJwt, addTest);
router.route('/removeTest').delete(verifyAdminJwt, removeTest);

// for application
router.route('/getTests').get(verifyJwt, getTests);
router.route('/getTest').get(verifyJwt, getTest);
router.route('/saveTestProgress').post(verifyJwt, saveTestProgress);
router.route('/getTestProgress').get(verifyJwt, getTestProgress);
router.route('/attempt/new').post(verifyJwt, attemptTest);
router.route('/result').post(verifyJwt, getResult);

export default router;
