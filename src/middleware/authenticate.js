import createHttpError from 'http-errors';
import { prisma } from '../prisma.js';

export const authenticate = async (req, res, next) => {
  try {
    let accessToken = req.cookies?.accessToken;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    }

    if (!req.cookies.accessToken) {
      throw createHttpError(401, 'Missing access token');
    }

    const session = await prisma.session.findFirst({
      where: {
        accessToken: accessToken,
      },
    });

    if (!session) {
      throw createHttpError(401, 'Session not found');
    }

    const isAccessTokenExpired =
      new Date() > new Date(session.accessTokenValidUntil);

    if (isAccessTokenExpired) {
      throw createHttpError(401, 'Access token expired');
    }

    const user = await prisma.users.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
