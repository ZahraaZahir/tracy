import { Response, Request } from 'express';
import { LeaderboardService } from '../services/leaderboard.service.js';

const lbService = new LeaderboardService();

export const getLeaderboard = async (_req: Request, res: Response) => {
  const top = await lbService.getBoard();
  res.json({ success: true, data: top });
};