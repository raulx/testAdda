import { Router } from 'express';
import verifyJwt from '../middlewares/auth.middleware.js';
import { generateOrder } from '../controllers/orders.controllers.js';

const router = Router();

router.route('/generateOrder').post(verifyJwt, generateOrder);

export default router;
