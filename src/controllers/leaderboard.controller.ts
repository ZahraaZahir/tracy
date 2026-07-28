import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { LeaderboardService } from '../services/leaderboard.service.js';
import { LeaderboardRepository } from '../repositories/leaderboard.repository.js';

const leaderboardService = new LeaderboardService(new LeaderboardRepository());

export const getLeaderboard = async (req: AuthenticatedRequest, res: Response) => {
  const topPlayers = await leaderboardService.getTopTen();
  res.status(200).json({
    message: 'Leaderboard retrieved',
    data: topPlayers,
  });
};