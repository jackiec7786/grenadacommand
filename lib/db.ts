import Redis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined
}

export function getRedis(): Redis {
  if (!global.redis) {
    global.redis = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    })
  }
  return global.redis
}
