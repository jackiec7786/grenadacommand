import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

export interface FerryBooking {
  id: string
  date: string
  time: string
  direction: 'stg_to_car' | 'car_to_stg'
  notes: string
  createdAt: string
}

const KEY = 'grenada:ferry-bookings'

async function getAll(): Promise<FerryBooking[]> {
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
    if (!body?.date || !body?.time) return Response.json({ error: 'Invalid' }, { status: 400 })
    const booking: FerryBooking = {
      id: crypto.randomUUID(),
      date: body.date,
      time: body.time,
      direction: body.direction === 'car_to_stg' ? 'car_to_stg' : 'stg_to_car',
      notes: (body.notes as string)?.trim() ?? '',
      createdAt: new Date().toISOString(),
    }
    const all = await getAll()
    all.push(booking)
    all.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    if (all.length > 100) all.splice(0, all.length - 100)
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true, id: booking.id })
  } catch { return Response.json({ ok: false }) }
}

export async function DELETE(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { id } = await req.json()
    const all = (await getAll()).filter(b => b.id !== id)
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true })
  } catch { return Response.json({ ok: false }) }
}
