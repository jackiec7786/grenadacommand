import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

export interface SpeedResult {
  id: string
  timestamp: string
  downloadMbps: number
  latencyMs: number
}

const KEY = 'grenada:speed-tests'

async function getAll(): Promise<SpeedResult[]> {
  const raw = await getRedis().get(KEY)
  if (!raw) return []
  return JSON.parse(await decrypt(raw))
}

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try { return Response.json(await getAll()) }
  catch { return Response.json([]) }
}

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const body = await req.json()
    if (typeof body?.downloadMbps !== 'number') {
      return Response.json({ error: 'Invalid' }, { status: 400 })
    }
    const result: SpeedResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      downloadMbps: body.downloadMbps,
      latencyMs: typeof body.latencyMs === 'number' ? body.latencyMs : 0,
    }
    const all = await getAll()
    all.unshift(result)
    if (all.length > 50) all.length = 50
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true, id: result.id })
  } catch { return Response.json({ ok: false }) }
}
