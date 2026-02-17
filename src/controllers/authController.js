import { createSession, setSessionCookies } from '../services/auth.js';
import { prisma } from '../prisma.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

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

    res.status(201).json({
      message: 'Successfully registered a user!',
      data: newUser,
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

    res.status(200).json({ data: existingUser });
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
