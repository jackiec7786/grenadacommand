import { requireAuth } from '@/lib/require-auth'
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '@/lib/settings'
import type { AppSettings } from '@/lib/settings'

export type { AppSettings }

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const settings = await getSettings()
    const { passwordHash: _, ...safe } = settings
    return Response.json(safe)
  } catch {
    const { passwordHash: _, ...safe } = DEFAULT_SETTINGS
    return Response.json(safe)
  }
}

export async function PATCH(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const updates = await req.json()
    delete updates.passwordHash // only changeable via /api/settings/password
    const current = await getSettings()
    await saveSettings({ ...current, ...updates } as AppSettings)
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false })
  }
}
