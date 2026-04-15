import {Request, Response, NextFunction} from 'express';
import {AppError} from '../errors/errors.js';
import {ZodError} from 'zod';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[DEBUG] ${err.stack}`);
  } else {
    console.error(`[ERROR] ${err.message}`);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({error: err.message});
  }

  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({error: 'Validation failed', details: err.issues});
  }

  return res.status(500).json({error: 'Internal Server Error'});
};
