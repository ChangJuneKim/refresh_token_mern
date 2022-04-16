import express from 'express';
import {
  forgotPassword,
  resetPassword,
  getUserInfo,
  getAllUsersInfo,
  updateUser,
  updateUserRole,
  deleteUser,
} from '../controllers/user-controller.js';
import uploadAvatar from '../controllers/upload-controller.js';
import auth from '../middleware/auth-middleware.js';
import authAdmin from '../middleware/admin-middleware.js';

const router = express.Router();

router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').patch(auth, resetPassword);

router.route('/info').get(auth, getUserInfo).patch(auth, updateUser);
router.route('/info/:id').patch(auth, authAdmin, updateUserRole).delete(auth, authAdmin, deleteUser);

router.route('/all_info').get(auth, authAdmin, getAllUsersInfo);

// 프사 업로드
router.route('/upload').post(auth, uploadAvatar);

export default router;
