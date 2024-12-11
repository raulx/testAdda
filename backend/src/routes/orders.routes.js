import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import {
    generateOrder,
    settlePayment,
    verifyPayment,
} from '../controllers/orders.controllers.js';

const router = Router();

router.route('/generateOrder').post(verifyJwt, generateOrder);
router
    .route('/verify-and-settlePayment')
    .post(verifyJwt, verifyPayment, settlePayment);

export default router;
