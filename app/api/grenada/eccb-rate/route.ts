import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

export interface RateEntry {
  id: string
  date: string
  rate: number
  source: string
  notes: string
}

const KEY = 'grenada:eccb-rates'

async function getAll(): Promise<RateEntry[]> {
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
    if (typeof body?.rate !== 'number' || body.rate < 1 || body.rate > 10) {
      return Response.json({ error: 'Invalid rate' }, { status: 400 })
    }
    const entry: RateEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      rate: body.rate,
      source: (body.source as string)?.trim() || 'Unknown',
      notes: (body.notes as string)?.trim() || '',
    }
    const all = await getAll()
    all.unshift(entry)
    if (all.length > 100) all.length = 100
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true, id: entry.id })
  } catch { return Response.json({ ok: false }) }
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { id } = await req.json()
    const all = (await getAll()).filter(e => e.id !== id)
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true })
  } catch { return Response.json({ ok: false }) }
}
