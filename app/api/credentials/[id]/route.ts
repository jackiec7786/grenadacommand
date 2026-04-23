import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'
import type { Credential } from '@/lib/data'

const KEY = 'grenada:credentials'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { id } = await params
    const redis = getRedis()

    // WATCH/MULTI/EXEC for atomic read-modify-write
    await redis.watch(KEY)
    const raw = await redis.get(KEY)
    const all: Credential[] = raw ? JSON.parse(await decrypt(raw)) : []
    const filtered = all.filter(c => c.id !== id)

    const result = await redis.multi().set(KEY, await encrypt(JSON.stringify(filtered))).exec()
    if (!result) {
      // WATCH fired — extremely unlikely in single-user app, just retry once
      const raw2 = await redis.get(KEY)
      const all2: Credential[] = raw2 ? JSON.parse(await decrypt(raw2)) : []
      await redis.set(KEY, await encrypt(JSON.stringify(all2.filter(c => c.id !== id))))
    }

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
