import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body.email, req.body.password, req.body.username);
  res.status(201).json({ data: result });
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body.identifier, req.body.password);
  res.status(200).json({ data: result });
};