import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

const LIMITS: Record<string, number> = {
  free: 3,
  contractor: 999,
  agency: 999,
  admin: 999,
};

export async function checkRateLimit(
  userId: string,
  planTier: string = 'free'
): Promise<{ allowed: boolean; remaining: number; resetAt: number; limit: number }> {
  const limit = LIMITS[planTier] ?? 3;

  // Paid plans — no rate limiting
  if (limit >= 999) {
    return { allowed: true, remaining: 999, resetAt: Date.now() + 86400000, limit };
  }

  const key = `rate-limit:claude:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 24); // reset at midnight-ish
  }

  const remaining = Math.max(0, limit - count);
  const ttl = await redis.ttl(key);
  const resetAt = Date.now() + ttl * 1000;

  return { allowed: count <= limit, remaining, resetAt, limit };
}
