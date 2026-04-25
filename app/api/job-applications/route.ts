import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { encrypt, decrypt } from '@/lib/crypto'

export interface JobApplication {
  id: string
  company: string
  role: string
  platform: string
  dateApplied: string
  status: 'applied' | 'interview' | 'hired' | 'rejected'
  notes: string
  followUpDate: string
}

const KEY = 'grenada:jobApplications'

async function getAll(): Promise<JobApplication[]> {
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
    if (!body?.company || !body?.role) return Response.json({ error: 'Missing fields' }, { status: 400 })
    const app: JobApplication = { ...body, id: crypto.randomUUID() }
    const all = await getAll()
    all.unshift(app)
    await getRedis().set(KEY, await encrypt(JSON.stringify(all)))
    return Response.json({ ok: true, id: app.id })
  } catch {
    return Response.json({ ok: false })
  }
}
