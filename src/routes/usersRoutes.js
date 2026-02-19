import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getMe, updateMe } from '../controllers/usersController.js';

const usersRoutes = Router();

usersRoutes.use('/users', authenticate);

usersRoutes.get('/users/me', getMe);
usersRoutes.patch('/users/me', updateMe);

export default usersRoutes;

