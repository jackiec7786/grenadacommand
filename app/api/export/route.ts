import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { decrypt } from '@/lib/crypto'

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })

  try {
    const redis = getRedis()
    const [rawState, rawCreds] = await Promise.all([
      redis.get('grenada:state'),
      redis.get('grenada:credentials'),
    ])

    const state = rawState ? JSON.parse(await decrypt(rawState)) : null
    const credentials = rawCreds ? JSON.parse(await decrypt(rawCreds)) : []

    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), state, credentials }, null, 2)
    const date = new Date().toISOString().slice(0, 10)

    return new Response(payload, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="grenada-backup-${date}.json"`,
      },
    })
  } catch {
    return Response.json({ error: 'Export failed' }, { status: 500 })
  }
}
