import { Joi, Segments } from 'celebrate';

export const getAllDealsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    search: Joi.string().trim().allow(''),
  }),
};

export const dealIdSchema = {
  [Segments.PARAMS]: Joi.object({
    dealId: Joi.number().integer().required(),
  }),
};

export const createDealSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).max(30).required(),
    price: Joi.number().required(),
    yield: Joi.number().required(),
    sold: Joi.number().required(),
    tiket: Joi.number().required(),
    daysLeft: Joi.number().integer().required(),
    image: Joi.string().optional(),
  }),
};
