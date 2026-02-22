import * as dealService from '../services/deals.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

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
    let imageUrl;

    if (req.file) {
      const uploadResult = await saveFileToCloudinary(
        req.file.buffer,
        req.user.id,
      );
      imageUrl = uploadResult.secure_url;
    } else {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
      throw createHttpError(400, 'Image is required');
    }

    const dealData = {
      title: req.body.title,
      price: parseFloat(req.body.price),
      yield: parseFloat(req.body.yield),
      sold: parseFloat(req.body.sold),
      tiket: parseFloat(req.body.tiket),
      daysLeft: parseInt(req.body.daysLeft, 10),
      image: imageUrl,
      usersId: req.user.id,
    };

    const newDeal = await dealService.createDeal(dealData);

    res.status(201).json({
      data: newDeal,
    });
  } catch (error) {
    next(error);
  }
};
