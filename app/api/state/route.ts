import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

const KEY = 'grenada:state'

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const raw = await getRedis().get(KEY)
    if (!raw) return Response.json(null)
    const decrypted = await decrypt(raw)
    return Response.json(JSON.parse(decrypted))
  } catch {
    return Response.json(null)
  }
}

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const body = await req.json()
    if (typeof body !== 'object' || Array.isArray(body) || body === null) {
      return Response.json({ error: 'Invalid state' }, { status: 400 })
    }
    await getRedis().set(KEY, await encrypt(JSON.stringify(body)))
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to save' }, { status: 500 })
  }
}
