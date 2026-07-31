import { redis } from '../lib/redis.js';

export class LeaderboardRepository {
  private readonly RANK_KEY = 'tracy:ranks';
  private readonly NAME_KEY = 'tracy:usernames';

  async saveNameMapping(userId: string, username: string): Promise<void> {
    await redis.hset(this.NAME_KEY, userId, username);
  }

  async updateScore(userId: string, score: number): Promise<void> {
    await redis.zadd(this.RANK_KEY, score, userId);
  }

  async getTopPlayers(limit: number = 10) {
    const rawData = await redis.zrevrange(this.RANK_KEY, 0, limit - 1, 'WITHSCORES');
    if (rawData.length === 0) return [];


    const ids: string[] = [];
    const scores: number[] = [];

    for (let i = 0; i < rawData.length; i += 2) {
      ids.push(rawData[i]);
      scores.push(parseInt(rawData[i + 1], 10));
    }

    const usernames = await redis.hmget(this.NAME_KEY, ...ids);

    return ids.map((id, index) => ({
      username: usernames[index] || 'Unknown Developer',
      score: scores[index]
    }));
  }
}