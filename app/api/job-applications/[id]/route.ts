import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'
import type { JobApplication } from '../route'

const KEY = 'grenada:jobApplications'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { id } = await params
    const updates = await req.json()
    const raw = await getRedis().get(KEY)
    const all: JobApplication[] = raw ? JSON.parse(await decrypt(raw)) : []
    const next = all.map(a => a.id === id ? { ...a, ...updates, id } : a)
    await getRedis().set(KEY, await encrypt(JSON.stringify(next)))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { id } = await params
    const raw = await getRedis().get(KEY)
    const all: JobApplication[] = raw ? JSON.parse(await decrypt(raw)) : []
    await getRedis().set(KEY, await encrypt(JSON.stringify(all.filter(a => a.id !== id))))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
