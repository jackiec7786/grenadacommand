"use client"

interface Props {
  monthlyGoal: number
  totalIncome: number
}

export function DailyIncomeGoal({ monthlyGoal, totalIncome }: Props) {
  const today = new Date()
  const dayOfMonth = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysLeft = daysInMonth - dayOfMonth

  const dailyTarget = monthlyGoal / daysInMonth
  const expectedByNow = dailyTarget * dayOfMonth
  const diff = totalIncome - expectedByNow // positive = ahead, negative = behind

  const pct = Math.min(100, Math.round((totalIncome / monthlyGoal) * 100))
  const isAhead = diff >= 0

  const message = isAhead
    ? `Ahead by $${diff.toFixed(0)} — on pace for $${Math.round((totalIncome / dayOfMonth) * daysInMonth).toLocaleString()}/mo`
    : daysLeft > 0
      ? `Earn $${Math.ceil(Math.abs(diff) / daysLeft)} extra/day to stay on track`
      : `$${Math.abs(diff).toFixed(0)} short of goal this month`

  return (
    <div
      className="rounded-md p-4 border font-mono"
      style={{
        borderColor: isAhead ? 'var(--accent)40' : 'var(--warn)40',
        background: isAhead ? 'var(--accent)08' : 'var(--warn)08',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">// Daily Income Pace</div>
        <div className="text-[10px]" style={{ color: isAhead ? 'var(--accent)' : 'var(--warn)' }}>
          Day {dayOfMonth} of {daysInMonth}
        </div>
      </div>

      <div className="flex items-end gap-3 mb-3">
        <div>
          <div className="text-[28px] font-extrabold leading-none text-text">
            ${totalIncome.toLocaleString()}
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5">
            of ${monthlyGoal.toLocaleString()} goal · ${dailyTarget.toFixed(0)}/day needed
          </div>
        </div>
        <div
          className="ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-sm"
          style={{
            background: isAhead ? 'var(--accent)20' : 'var(--warn)20',
            color: isAhead ? 'var(--accent)' : 'var(--warn)',
          }}
        >
          {pct}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-dim rounded-sm overflow-hidden mb-2">
        <div
          className="h-full rounded-sm transition-all"
          style={{
            width: `${pct}%`,
            background: isAhead ? 'var(--accent)' : 'var(--warn)',
          }}
        />
      </div>

      <div className="text-[10px]" style={{ color: isAhead ? 'var(--accent)' : 'var(--warn)' }}>
        {isAhead ? '↑' : '↓'} {message}
      </div>
    </div>
  )
}
