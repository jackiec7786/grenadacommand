import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

export interface Outage {
  id: string
  startedAt: string
  restoredAt: string | null
  notes: string
}

const KEY = 'grenada:power-outages'

async function getAll(): Promise<Outage[]> {
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
    const all = await getAll()

    if (body.action === 'start') {
      const outage: Outage = {
        id: crypto.randomUUID(),
        startedAt: new Date().toISOString(),
        restoredAt: null,
        notes: (body.notes as string)?.trim() || '',
      }
      all.unshift(outage)
      if (all.length > 200) all.length = 200
      await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
      return Response.json({ ok: true, id: outage.id })
    }

    if (body.action === 'restore' && body.id) {
      const idx = all.findIndex(o => o.id === body.id)
      if (idx !== -1) all[idx].restoredAt = new Date().toISOString()
      await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
      return Response.json({ ok: true })
    }

    if (body.action === 'delete' && body.id) {
      await getRedis().set(KEY, await encrypt(JSON.stringify(all.filter(o => o.id !== body.id))))
      return Response.json({ ok: true })
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 })
  } catch { return Response.json({ ok: false }) }
}
