import { LeaderboardRepository } from '../repositories/leaderboard.repository.js';

export class LeaderboardService {
  constructor(private leaderboardRepo: LeaderboardRepository) {}

  async updateRank(username: string, score: number): Promise<void> {
    await this.leaderboardRepo.updateScore(username, score);
  }

  async getTopTen() {
    return await this.leaderboardRepo.getTopPlayers(10);
  }
}