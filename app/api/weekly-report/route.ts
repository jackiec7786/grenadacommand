import { requireAuth } from '@/lib/require-auth'
import { getRedis } from '@/lib/db'
import { decrypt } from '@/lib/crypto'

const STATE_KEY = 'grenada:state'

export async function GET() {
  if (!await requireAuth()) return Response.json(null, { status: 401 })
  try {
    const raw = await getRedis().get(STATE_KEY)
    if (!raw) return Response.json({ error: 'No state found' }, { status: 404 })
    const state = JSON.parse(await decrypt(raw))

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const weekAgoStr = sevenDaysAgo.toISOString().slice(0, 10)

    const totalIncome = Object.values(state.income || {}).reduce((s: number, v) => s + (Number(v) || 0), 0)

    const weeklyExpenses = (state.expenses || [])
      .filter((e: { date: string }) => e.date >= weekAgoStr)
      .reduce((s: number, e: { amount: number }) => s + (Number(e.amount) || 0), 0)

    const moodMap: Record<string, number> = { green: 3, yellow: 2, red: 1 }
    const moodLabels: Record<string, string> = { green: 'Good', yellow: 'Okay', red: 'Bad' }
    const recentMoods = (state.mood || []).filter((m: { date: string }) => m.date >= weekAgoStr)
    const moodAvgNum = recentMoods.length
      ? recentMoods.reduce((s: number, m: { level: string }) => s + (moodMap[m.level] ?? 2), 0) / recentMoods.length
      : null
    const moodLabel = moodAvgNum === null ? null
      : moodAvgNum >= 2.5 ? moodLabels.green
      : moodAvgNum >= 1.5 ? moodLabels.yellow
      : moodLabels.red

    const tasks = state.tasks || {}
    let tasksCompleted = 0
    let tasksTotal = 0
    for (const phaseChecks of Object.values(tasks) as Record<string, boolean>[]) {
      for (const val of Object.values(phaseChecks)) {
        tasksTotal++
        if (val) tasksCompleted++
      }
    }

    return Response.json({
      generatedAt: now.toISOString(),
      currentPhase: state.currentPhase ?? 1,
      totalIncome,
      weeklyExpenses,
      netCash: state.cash ?? 0,
      streakDays: state.streakDays ?? 0,
      moodLabel,
      tasksCompleted,
      tasksTotal,
    })
  } catch {
    return Response.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
