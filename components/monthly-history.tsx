"use client"

import { INCOME_STREAMS } from '@/lib/data'

interface MonthlyHistoryProps {
  currentMonth: string
  monthlyHistory: Record<string, Record<string, number>>
  currentIncome: Record<string, number>
  onMonthChange: (month: string) => void
}

function getMonthLabel(ym: string) {
  const [y, m] = ym.split('-')
  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function getRecentMonths(current: string, count = 5): string[] {
  const months: string[] = []
  const [y, m] = current.split('-').map(Number)
  for (let i = 0; i < count; i++) {
    let month = m - i
    let year = y
    while (month <= 0) { month += 12; year-- }
    months.push(`${year}-${String(month).padStart(2, '0')}`)
  }
  return months
}

export function MonthlyHistory({ currentMonth, monthlyHistory, currentIncome, onMonthChange }: MonthlyHistoryProps) {
  const months = getRecentMonths(currentMonth, 5)

  const totals = months.map(m => {
    const data = m === currentMonth ? currentIncome : (monthlyHistory[m] || {})
    return Object.values(data).reduce((s, v) => s + (v || 0), 0)
  })

  const maxTotal = Math.max(...totals, 1)

  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2 border-t-accent2">
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">
        // Monthly Income History
      </div>

      {/* Month selector */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => onMonthChange(m)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-sm border cursor-pointer transition-all tracking-[0.05em] ${
              currentMonth === m
                ? 'bg-accent2 text-bg border-accent2 font-semibold'
                : 'border-border text-muted-foreground hover:border-accent2'
            }`}
          >
            {getMonthLabel(m)}
          </button>
        ))}
      </div>

      {/* Bar chart of monthly totals */}
      <div className="flex items-end gap-2 h-16 mb-5">
        {months.slice().reverse().map((m, i) => {
          const idx = months.length - 1 - i
          const total = totals[idx]
          const pct = (total / maxTotal) * 100
          const isActive = m === currentMonth
          return (
            <div key={m} className="flex-1 flex flex-col items-center gap-1 cursor-pointer" onClick={() => onMonthChange(m)}>
              <div className="text-[9px] font-mono text-muted-foreground">${total > 0 ? (total >= 1000 ? (total/1000).toFixed(1)+'k' : total) : '—'}</div>
              <div className="w-full bg-dim rounded-sm overflow-hidden" style={{ height: '36px' }}>
                <div
                  className="w-full rounded-sm transition-all duration-500"
                  style={{
                    height: `${Math.max(4, pct)}%`,
                    marginTop: `${100 - Math.max(4, pct)}%`,
                    background: isActive ? 'var(--accent2)' : 'var(--muted)',
                    opacity: isActive ? 1 : 0.5,
                  }}
                />
              </div>
              <div className={`text-[9px] font-mono ${isActive ? 'text-accent2' : 'text-muted-foreground'}`}>
                {getMonthLabel(m).split(' ')[0]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Stream breakdown for selected month */}
      <div className="border-t border-border pt-4">
        <div className="text-[9px] font-mono text-muted-foreground mb-3 tracking-[0.15em] uppercase">
          {getMonthLabel(currentMonth)} breakdown
        </div>
        <div className="flex flex-col gap-2">
          {INCOME_STREAMS.map(s => {
            const data = monthlyHistory[currentMonth] || currentIncome
            const val = data[s.id] || 0
            if (val === 0) return null
            return (
              <div key={s.id} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.name}</span>
                <span className="font-mono text-xs text-text">${val.toLocaleString()}</span>
              </div>
            )
          })}
          {totals[0] === 0 && (
            <div className="text-[11px] text-muted-foreground font-mono">No income recorded yet for {getMonthLabel(currentMonth)}.</div>
          )}
        </div>
        {totals[0] > 0 && (
          <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Total</span>
            <span className="font-mono text-[18px] font-bold text-accent2">${totals[0].toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  )
}
