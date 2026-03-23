import {Request, Response} from 'express';
import {AuthService} from '../services/auth.service.js';

let authService: AuthService;

const getAuthService = () => {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
};

export const register = async (req: Request, res: Response) => {
  const {email, password, username} = req.body;
  const result = await getAuthService().register(email, password, username);

  res.status(201).json({
    message: 'User registered successfully',
    data: result,
  });
};

export const login = async (req: Request, res: Response) => {
  const {identifier, password} = req.body;
  const result = await getAuthService().login(identifier, password);

  res.status(200).json({
    message: 'Login successful.',
    data: result,
  });
};
