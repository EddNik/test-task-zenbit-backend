import { HttpError } from 'http-errors';

export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
}
