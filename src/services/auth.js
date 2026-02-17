import { prisma } from '../prisma.js';

import { FIFTEEN_MINUTES, TWO_DAYS } from '../constants/time.js';
import crypto from 'node:crypto';

export const createSession = (userId) => {
  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

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
