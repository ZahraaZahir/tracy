import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AuthenticatedRequest} from '../types/auth.types.js';

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({error: 'No token provided.'});
  }
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({error: 'Invalid token format.'});
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret', (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({error: 'The token either expired or is not valid.'});
    }
    req.user = user as {userId: string};
    next();
  });
};
