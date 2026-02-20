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

export const createDealController = async (req, res, next) => {
  try {
    const imageUrl =
      (req.file && (req.file.path || req.file.originalname)) || req.body.image;

    const newDeal = await dealService.createDeal({
      ...req.body,
      image: imageUrl,
      userId: req.user.id,
    });

    res.status(201).json({
      data: newDeal,
    });
  } catch (error) {
    next(error);
  }
};
