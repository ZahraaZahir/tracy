import {Request, Response} from 'express';
import {AuthService} from '../services/auth.service.js';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const {email, password, username} = req.body;

    const result = await authService.register(email, password, username);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error: any) {
    console.error('DEBUG - AUTH ERROR:', error);
    if (error.message === 'USER_ALREADY_EXISTS') {
      return res.status(400).json({error: 'Email already exists'});
    }

    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {identifier, password} = req.body;

    const result = await authService.login(identifier, password);

    res.status(200).json({
      message: 'Login successful.',
      data: result,
    });
  } catch (error: any) {
    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({error: 'Invalid credentials.'});
    }
    res.status(500).json({error: 'Internal server error.'});
  }
};
