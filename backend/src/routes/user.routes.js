import { Router } from 'express';

import {
    getUser,
    updateUserAvatar,
    updateUserName,
} from '../controllers/user.controllers.js';
import upload from '../middlewares/multer.middleware.js';
const router = Router();

router.route('/updateUserName').patch(updateUserName);
router.route('/getUser').get(getUser);
router
    .route('/updateUserAvatar')
    .patch(upload.single('file'), updateUserAvatar);

export default router;
