import { Router } from 'express';
import changePassword from '../controllers/user.controllers.js';

const router = Router();

router.route('/changePassword').post(changePassword);

export default router;
