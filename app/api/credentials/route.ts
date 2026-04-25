import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'
import type { Credential } from '@/lib/data'

const KEY = 'grenada:credentials'

async function getAll(): Promise<Credential[]> {
  const raw = await getRedis().get(KEY)
  if (!raw) return []
  return JSON.parse(await decrypt(raw))
}

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    return Response.json(await getAll())
  } catch {
    return Response.json([])
  }
}

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const body = await req.json()
    if (typeof body !== 'object' || !body?.platform) {
      return Response.json({ error: 'Invalid credential' }, { status: 400 })
    }
    const id = crypto.randomUUID()
    const cred: Credential = { ...body, id }
    const all = await getAll()
    all.unshift(cred)
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true, id })
  } catch {
    return Response.json({ ok: false })
  }
}
