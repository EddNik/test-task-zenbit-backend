import {
  createSession,
  refreshSession,
  setSessionCookies,
} from '../services/auth.js';
import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) throw createHttpError(409, 'Email in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const newSession = await createSession(newUser.id);

    setSessionCookies(res, newSession);

    const { password: _password, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Successfully registered a user!',
      data: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (!existingUser) {
      throw createHttpError(401, 'Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isValidPassword) {
      throw createHttpError(401, 'Invalid credentials');
    }

    await prisma.session
      .delete({
        where: { userId: existingUser.id },
      })
      .catch(() => {});

    const newSession = await createSession(existingUser.id);

    setSessionCookies(res, newSession);

    const { password: _password, ...safeUser } = existingUser;
    res.status(200).json({ data: safeUser });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies ?? {};

    if (accessToken) {
      await prisma.session.deleteMany({
        where: { accessToken },
      });
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(200).json({
      message: 'Successfully logged out!',
    });
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.cookies ?? {};

    if (accessToken) {
      const session = await prisma.session.findFirst({
        where: { accessToken },
      });

      if (session?.accessTokenValidUntil) {
        const isAccessTokenExpired =
          new Date() > new Date(session.accessTokenValidUntil);
        if (!isAccessTokenExpired) {
          return res.status(200).json({ success: true });
        }
      }
    }

    const refreshed = await refreshSession(refreshToken);
    if (!refreshed) return res.status(200).json({ success: false });

    setSessionCookies(res, refreshed);
    return res
      .status(200)
      .json({ success: true, message: 'Session refreshed' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw createHttpError(400, 'Email is required');

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user)
      return res.status(200).json({
        success: true,
        message: 'Password reset email sent successfully',
      });

    const resetToken = jwt.sign(
      { sub: String(user.id), type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' },
    );

    return res.status(200).json({ success: true, resetToken });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Invalid or expired token');
    }

    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) throw createHttpError(401, 'Invalid token');

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await prisma.session.deleteMany({ where: { userId } }).catch(() => {});

    return res
      .status(200)
      .json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
