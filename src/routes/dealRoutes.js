import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { celebrate } from 'celebrate';
import { upload } from '../middleware/multer.js';

import {
  getDealsController,
  createDealController,
} from '../controllers/dealsController.js';

import { authenticate } from '../middleware/authenticate.js';

import {
  createDealSchema,
  getAllDealsSchema,
} from '../validations/dealsValidation.js';

const dealRoute = Router();

dealRoute.use('/', authenticate);

dealRoute.get(
  '/deals',
  celebrate(getAllDealsSchema),
  ctrlWrapper(getDealsController),
);

dealRoute.post(
  '/create',
  authenticate,
  upload.single('image'),
  celebrate(createDealSchema),
  ctrlWrapper(createDealController),
);

export default dealRoute;
