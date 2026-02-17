import * as dealService from '../services/deals.js';
export const getDealsController = async (req, res, next) => {
  try {
    const deals = await dealService.getAllDeals();
    res.status(200).json({
      message: 'Successfully found deals!',
      data: deals,
    });
  } catch (error) {
    next(error);
  }
};

export const createDealController = async (req, res, next) => {
  try {
    const photoUrl =
      (req.file && (req.file.path || req.file.originalname)) || req.body.image;

    const newDeal = await dealService.createDeal({
      ...req.body,
      image: photoUrl,
      userId: req.user.id,
    });

    res.status(201).json({
      message: 'Successfully created a deal!',
      data: newDeal,
    });
  } catch (error) {
    next(error);
  }
};
