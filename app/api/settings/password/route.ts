import { requireAuth } from '@/lib/require-auth'
import { getSettings, saveSettings } from '@/lib/settings'
import { hashPassword, verifyPassword } from '@/lib/password'

export async function POST(req: Request) {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const { currentPassword, newPassword } = await req.json()
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return Response.json({ error: 'New password must be at least 8 characters.' }, { status: 400 })
    }

    const settings = await getSettings()

    const valid = settings.passwordHash
      ? await verifyPassword(currentPassword, settings.passwordHash)
      : currentPassword === process.env.AUTH_PASSWORD

    if (!valid) return Response.json({ error: 'Current password is incorrect.' }, { status: 403 })

    await saveSettings({ ...settings, passwordHash: await hashPassword(newPassword) })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to change password.' }, { status: 500 })
  }
}
