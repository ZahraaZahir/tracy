import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(redisUrl, {
    maxRetriesPerRequest: null, 
  });

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;

redis.on('connect', () => console.log('[REDIS] Connected to Leaderboard Store'));
redis.on('error', (err) => console.error('[REDIS] Connection Error:', err));