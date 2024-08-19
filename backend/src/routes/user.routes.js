import { Router } from 'express';

import {
    updateUserAvatar,
    updateUserName,
} from '../controllers/user.controllers.js';
import upload from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/updateUserName').patch(updateUserName);
router
    .route('/updateUserAvatar')
    .patch(upload.single('avatar'), updateUserAvatar);

export default router;
