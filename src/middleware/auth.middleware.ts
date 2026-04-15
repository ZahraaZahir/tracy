import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {UnauthorizedError} from '../errors/errors.js';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];

  const secret = process.env.JWT_SECRET!;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Invalid or missing token.'));
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return next(new UnauthorizedError('Token expired or invalid.'));
    }
    req.user = user as {userId: string};
    next();
  });
};
