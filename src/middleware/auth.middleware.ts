import {Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {AuthenticatedRequest} from '../types/auth.types.js';
import {UnauthorizedError} from '../errors/errors.js';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) return next(new UnauthorizedError());

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded: any) => {
    if (err) return next(new UnauthorizedError('Token invalid.'));
    
    req.user = {
      sub: decoded.sub,
      username: decoded.username
    };
    next();
  });
};