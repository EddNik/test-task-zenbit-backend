import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  getSession,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';

const authRoutes = Router();

authRoutes.post('/auth/register', celebrate(registerUserSchema), registerUser);

authRoutes.post('/auth/login', celebrate(loginUserSchema), loginUser);
authRoutes.post('/auth/logout', logoutUser);
authRoutes.get('/auth/session', getSession);

authRoutes.post('/auth/forgot-password', forgotPassword);
authRoutes.post('/auth/reset-password', resetPassword);

export default authRoutes;
