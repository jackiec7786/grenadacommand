import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

export interface PrepState {
  [itemId: string]: { checked: boolean; checkedAt: string | null }
}

const KEY = 'grenada:hurricane-prep'

async function get(): Promise<PrepState> {
  const raw = await getRedis().get(KEY)
  if (!raw) return {}
  return JSON.parse(await decrypt(raw))
}

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try { return Response.json(await get()) }
  catch { return Response.json({}) }
}

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const body = await req.json()
    if (!body?.itemId || typeof body.checked !== 'boolean') {
      return Response.json({ error: 'Invalid' }, { status: 400 })
    }
    const current = await get()
    current[body.itemId] = {
      checked: body.checked,
      checkedAt: body.checked ? new Date().toISOString() : null,
    }
    await getRedis().set(KEY, await encrypt(JSON.stringify(current)))
    return Response.json({ ok: true })
  } catch { return Response.json({ ok: false }) }
}
