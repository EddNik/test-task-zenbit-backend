import * as dealService from '../services/deals.js';

export const getDealsController = async (req, res, next) => {
  try {
    const data = await dealService.getAllDeals();
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
