import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const encKey = process.env.ENCRYPTION_KEY
    const keyHint = encKey && encKey.length >= 4 ? `...${encKey.slice(-4)}` : '????'

    let redisStatus = 'unknown'
    try {
      await getRedis().ping()
      redisStatus = 'connected'
    } catch {
      redisStatus = 'error'
    }

    return Response.json({ keyHint, redisStatus, version: '0.1.0' })
  } catch {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
