import { LeaderboardRepository } from '../repositories/leaderboard.repository.js';

export class LeaderboardService {
  private repo = new LeaderboardRepository();

  async syncUser(userId: string, username: string) {
    await this.repo.saveNameMapping(userId, username);
  }

  async updateRank(userId: string, score: number) {
    await this.repo.updateScore(userId, score);
  }

  async getBoard() {
    return await this.repo.getTopPlayers(10);
  }
}