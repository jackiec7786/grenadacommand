import { requireAuth } from '@/lib/require-auth'
import { getConfig, saveConfig, mergeWithDefaults } from '@/lib/config'
import type { AppConfig } from '@/lib/config'

const EMPTY: AppConfig = {
  tasks: null, milestones: null, phaseChecklists: null,
  incomeStreams: null, events: null, riskScenarios: null,
  psychMessages: null, resilienceItems: null,
}

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const config = await getConfig()
    return Response.json(mergeWithDefaults(config))
  } catch {
    // Redis unavailable — return hardcoded defaults so the UI is functional
    return Response.json(mergeWithDefaults(EMPTY))
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
    return Response.json({ ok: false })
  }
}
