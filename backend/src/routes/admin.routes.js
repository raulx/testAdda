import { Router } from 'express';
import { logInAdmin, registerAdmin } from '../controllers/admin.controllers.js';

const router = Router();

router.route('/registerAdmin').post(registerAdmin);
router.route('/logInAdmin').post(logInAdmin);

export default router;
