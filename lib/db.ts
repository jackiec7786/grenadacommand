import Redis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined
}

export function getRedis(): Redis {
  // Recreate if connection was permanently closed (e.g. after hot-reload or fatal error)
  if (global.redis && global.redis.status === 'end') {
    global.redis.disconnect()
    global.redis = undefined
  }

  if (!global.redis) {
    if (!process.env.REDIS_URL) throw new Error('[redis] REDIS_URL is not configured')
    global.redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      commandTimeout: 5000,
      enableOfflineQueue: false,
    })
    // Without this listener, connection errors crash the Node.js process
    global.redis.on('error', (err) => console.error('[redis]', err.message))

    // Clean up on process exit (relevant in dev with hot-reload)
    process.once('beforeExit', () => {
      global.redis?.disconnect()
      global.redis = undefined
    })
  }

  return global.redis
}
