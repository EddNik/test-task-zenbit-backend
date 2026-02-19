import { Router } from 'express';

import ctrlWrapper from '../utils/ctrlWrapper.js';
import { celebrate } from 'celebrate';

import { getDealsController } from '../controllers/dealsController.js';
import { authenticate } from '../middleware/authenticate.js';
import { getAllDealsSchema } from '../validations/dealsValidation.js';

const dealRoute = Router();

dealRoute.use('/', authenticate);

dealRoute.get(
  '/deals',
  celebrate(getAllDealsSchema),
  ctrlWrapper(getDealsController),
);

export default dealRoute;
