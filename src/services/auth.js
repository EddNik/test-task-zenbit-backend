import { prisma } from '../prisma.js';
import createHttpError from 'http-errors';

import { FIFTEEN_MINUTES, TWO_DAYS } from '../constants/time.js';
import crypto from 'node:crypto';

export const createSession = async (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  await prisma.session.deleteMany({ where: { userId } });

  return prisma.session.create({
    data: {
      userId,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
      refreshTokenValidUntil: new Date(Date.now() + TWO_DAYS),
    },
  });
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) return null;

  const session = await prisma.session.findFirst({
    where: { refreshToken },
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isRefreshTokenExpired) {
    await prisma.session.deleteMany({ where: { refreshToken } }).catch(() => {
      throw createHttpError(401, 'Session token expired');
    });
  }

  const newAccessToken = crypto.randomBytes(30).toString('base64');

  return prisma.session.update({
    where: { userId: session.userId },
    data: {
      accessToken: newAccessToken,
      accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    },
  });
};

export const setSessionCookies = (res, session) => {
  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: TWO_DAYS,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: TWO_DAYS,
  });
};
