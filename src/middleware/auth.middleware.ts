import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AuthenticatedRequest} from '../types/auth.types.js';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET not configured.');
  }

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Invalid or missing token.'});
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({error: 'The token either expired or is not valid.'});
    }
    req.user = user as {userId: string};
    next();
  });
};
