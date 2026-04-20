import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import type { Credential } from '@/lib/data'

const KEY = 'grenada:credentials'

async function getAll(): Promise<Credential[]> {
  const raw = await getRedis().get(KEY)
  return raw ? JSON.parse(raw) : []
}

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    return Response.json(await getAll())
  } catch {
    return Response.json([], { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const cred: Credential = await req.json()
    const all = await getAll()
    all.unshift(cred)
    await getRedis().set(KEY, JSON.stringify(all))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to save' }, { status: 500 })
  }
}
