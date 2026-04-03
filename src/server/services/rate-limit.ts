import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const ANALYSIS_LIMIT_PER_DAY = 10;

export async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `rate-limit:claude:${userId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24);
  }
  
  const remaining = Math.max(0, ANALYSIS_LIMIT_PER_DAY - count);
  const ttl = await redis.ttl(key);
  const resetAt = Date.now() + ttl * 1000;
  
  return {
    allowed: count <= ANALYSIS_LIMIT_PER_DAY,
    remaining,
    resetAt,
  };
}
