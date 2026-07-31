import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service.js';
import { LeaderboardService } from '../services/leaderboard.service.js';

const authService = new AuthService();
const lbService = new LeaderboardService();

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const result = await authService.register(email, password, username);

  await lbService.syncUser(result.userId, result.username);

  res.status(201).json({ data: result });
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  const result = await authService.login(identifier, password);

  await lbService.syncUser(result.userId, result.username);

  res.status(200).json({ data: result });
};