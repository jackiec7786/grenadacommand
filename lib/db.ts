import Redis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined
}

export function getRedis(): Redis {
  if (!global.redis) {
    global.redis = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      commandTimeout: 5000,
      enableOfflineQueue: false,
    })
    // Without this listener, connection errors crash the Node.js process
    global.redis.on('error', (err) => console.error('[redis]', err.message))
  }
  return global.redis
}
