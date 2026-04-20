import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'

const KEY = 'grenada:state'

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const raw = await getRedis().get(KEY)
    return Response.json(raw ? JSON.parse(raw) : null)
  } catch {
    return Response.json(null, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const body = await req.json()
    await getRedis().set(KEY, JSON.stringify(body))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to save' }, { status: 500 })
  }
}
