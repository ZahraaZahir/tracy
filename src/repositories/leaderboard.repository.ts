import { redis } from '../lib/redis.js';

export class LeaderboardRepository {
  private readonly KEY = 'tracy:leaderboard';

  async updateScore(username: string, score: number): Promise<void> {
    await redis.zadd(this.KEY, score, username);
  }

  
  async getTopPlayers(limit: number = 10) {

    const rawData = await redis.zrevrange(this.KEY, 0, limit - 1, 'WITHSCORES');
    const leaderboard = [];
    for (let i = 0; i < rawData.length; i += 2) {
      leaderboard.push({
        username: rawData[i],
        score: parseInt(rawData[i + 1], 10),
      });
    }
    return leaderboard;
  }
}