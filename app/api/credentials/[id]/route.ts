import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import type { Credential } from '@/lib/data'

const KEY = 'grenada:credentials'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { id } = await params
    const raw = await getRedis().get(KEY)
    const all: Credential[] = raw ? JSON.parse(raw) : []
    await getRedis().set(KEY, JSON.stringify(all.filter(c => c.id !== id)))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
