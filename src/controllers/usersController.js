import createHttpError from 'http-errors';
import { prisma } from '../prisma.js';

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw createHttpError(401, 'Unauthorized');

    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw createHttpError(404, 'User not found');

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw createHttpError(401, 'Unauthorized');

    const { username } = req.body ?? {};
    if (!username) throw createHttpError(400, 'Username is required');

    const user = await prisma.users.update({
      where: { id: userId },
      data: { username },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

