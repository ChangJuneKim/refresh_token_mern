import express from 'express';
import { register, activateEmail, login, getAccessToken, logout } from '../controllers/auth-controller.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/activate').post(activateEmail);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/refresh_token').post(getAccessToken);

export default router;
