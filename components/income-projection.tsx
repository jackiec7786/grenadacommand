"use client"

import { INCOME_STREAMS, PHASE_INCOME_TARGETS } from '@/lib/data'

interface IncomeProjectionProps {
  income: Record<string, number>
  currentPhase: number
  planStartDate: string
  monthlyHistory: Record<string, Record<string, number>>
}

function getDayOfMonth(): number {
  return new Date().getDate()
}

function getDaysInMonth(): number {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
}

export function IncomeProjection({ income, currentPhase, planStartDate, monthlyHistory }: IncomeProjectionProps) {
  const target = PHASE_INCOME_TARGETS[currentPhase]
  const total = Object.values(income).reduce((s, v) => s + (v || 0), 0)
  const dayOfMonth = getDayOfMonth()
  const daysInMonth = getDaysInMonth()
  const daysRemaining = daysInMonth - dayOfMonth

  // Daily rate so far
  const dailyRate = dayOfMonth > 0 ? total / dayOfMonth : 0

  // Projected end-of-month
  const projected = Math.round(dailyRate * daysInMonth)

  // Month-over-month comparison
  const lastMonthKey = (() => {
    const now = new Date()
    now.setMonth(now.getMonth() - 1)
    return now.toISOString().slice(0, 7)
  })()
  const lastMonthTotal = Object.values(monthlyHistory[lastMonthKey] || {}).reduce((s, v) => s + (v || 0), 0)
  const momChange = lastMonthTotal > 0 ? Math.round(((projected - lastMonthTotal) / lastMonthTotal) * 100) : null

  // Stream-level daily rates
  const streamProjections = INCOME_STREAMS.map(s => {
    const val = income[s.id] || 0
    const daily = dayOfMonth > 0 ? val / dayOfMonth : 0
    const proj = Math.round(daily * daysInMonth)
    return { ...s, current: val, projected: proj }
  }).filter(s => s.current > 0 || s.projected > 0)

  // What needs to happen daily to hit target
  const toHitTarget = Math.max(0, target - total)
  const neededPerDay = daysRemaining > 0 ? Math.round(toHitTarget / daysRemaining) : 0

  // Cambly hours needed to hit gap
  const camblyHoursNeeded = neededPerDay > 0 ? Math.round(neededPerDay / 10.20) : 0

  const projectedColor = projected >= target ? 'var(--accent)' : projected >= target * 0.8 ? 'var(--accent2)' : projected >= target * 0.5 ? 'var(--warn)' : 'var(--danger)'

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Income Projection</div>
        <div className="font-mono text-[10px] text-muted-foreground">Day {dayOfMonth} of {daysInMonth}</div>
      </div>

      {/* Main projection */}
      <div className="flex items-end gap-4 mb-4">
        <div>
          <div className="text-[11px] font-mono text-muted-foreground mb-1">Projected month-end</div>
          <div className="text-[38px] font-extrabold font-mono leading-none" style={{ color: projectedColor }}>
            ${projected.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground mt-1">
            at ${dailyRate.toFixed(0)}/day pace
          </div>
        </div>
        <div className="pb-2 text-right">
          <div className="text-[11px] font-mono text-muted-foreground">vs target</div>
          <div className="text-[18px] font-bold font-mono text-muted-foreground">${target.toLocaleString()}</div>
          {momChange !== null && (
            <div className="text-[10px] font-mono mt-0.5" style={{ color: momChange >= 0 ? 'var(--accent)' : 'var(--danger)' }}>
              {momChange >= 0 ? '+' : ''}{momChange}% vs last month
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[9px] font-mono text-muted-foreground mb-1">
          <span>Now: ${total.toLocaleString()}</span>
          <span>Projected: ${projected.toLocaleString()}</span>
          <span>Target: ${target.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-dim rounded-sm overflow-hidden relative">
          {/* Current earned */}
          <div className="h-full rounded-sm absolute left-0 top-0 transition-all duration-500" style={{ width: `${Math.min(100, (total / target) * 100)}%`, background: 'var(--muted)' }} />
          {/* Projected */}
          <div className="h-full rounded-sm absolute left-0 top-0 transition-all duration-500 opacity-40" style={{ width: `${Math.min(100, (projected / target) * 100)}%`, background: projectedColor }} />
        </div>
      </div>

      {/* Gap analysis */}
      {toHitTarget > 0 && daysRemaining > 0 && (
        <div className="p-2.5 rounded-sm border border-border bg-surface2 mb-4">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">To hit target: ${toHitTarget.toLocaleString()} needed in {daysRemaining} days</div>
          <div className="flex gap-4 text-[11px] font-mono">
            <div>
              <span className="text-text font-bold">${neededPerDay}</span>
              <span className="text-muted-foreground"> /day needed</span>
            </div>
            {camblyHoursNeeded > 0 && camblyHoursNeeded <= 8 && (
              <div>
                <span className="text-text font-bold">{camblyHoursNeeded}hrs</span>
                <span className="text-muted-foreground"> Cambly/day to close gap</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stream projections */}
      {streamProjections.length > 0 && (
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-2">Stream Projections</div>
          <div className="flex flex-col gap-1.5">
            {streamProjections.map(s => (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-muted-foreground w-28 truncate">{s.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-muted-foreground">${s.current.toLocaleString()} now</span>
                  <span className="text-[11px] font-mono text-text">→ ${s.projected.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="text-center py-4 text-[11px] font-mono text-muted-foreground">
          Enter income in the tracker above to see your month-end projection.
        </div>
      )}
    </div>
  )
}
