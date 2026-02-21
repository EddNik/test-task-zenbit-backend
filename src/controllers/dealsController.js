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
