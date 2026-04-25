import { requireAuth } from '@/lib/require-auth'
import { getConfig, saveConfig, mergeWithDefaults } from '@/lib/config'

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const config = await getConfig()
    return Response.json(mergeWithDefaults(config))
  } catch {
    return Response.json(null, { status: 503 })
  }
}

export async function PATCH(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const updates = await req.json()
    const current = await getConfig()
    await saveConfig({ ...current, ...updates })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to save' }, { status: 500 })
  }
}
