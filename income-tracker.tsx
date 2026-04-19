"use client"

import { INCOME_STREAMS, PHASE_CONFIGS, PHASE_INCOME_TARGETS } from '@/lib/data'

interface IncomeTrackerProps {
  income: Record<string, number>
  currentPhase: number
  onIncomeChange: (id: string, value: number) => void
}

export function IncomeTracker({ income, currentPhase, onIncomeChange }: IncomeTrackerProps) {
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]
  const goal = PHASE_INCOME_TARGETS[currentPhase] || 2500
  const total = Object.values(income).reduce((s, v) => s + (v || 0), 0)
  const goalPct = Math.min(100, (total / goal) * 100)

  // Active streams for this phase
  const activeIds = new Set(config.activeStreams)
  const activeStreams = INCOME_STREAMS.filter(s => activeIds.has(s.id))
  const otherStreams = INCOME_STREAMS.filter(s => !activeIds.has(s.id) && (income[s.id] || 0) > 0)
  const displayStreams = [...activeStreams, ...otherStreams]

  return (
    <div
      className="bg-surface border border-border rounded-md p-5 animate-fade-slide-in"
      style={{ borderTopWidth: 2, borderTopColor: config.cssColor }}
    >
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-3">
        // Monthly Income Tracker
      </div>

      {/* Total + Goal */}
      <div className="flex items-end justify-between mb-1">
        <div className="text-[42px] font-extrabold font-mono leading-none" style={{ color: config.cssColor }}>
          ${total.toLocaleString()}
        </div>
        <div className="text-right pb-1">
          <div className="text-[11px] font-mono text-muted-foreground">phase {currentPhase} goal</div>
          <div className="text-[15px] font-bold font-mono text-muted-foreground">${goal.toLocaleString()}</div>
        </div>
      </div>

      {/* Goal bar */}
      <div className="mb-1">
        <div className="h-1.5 bg-dim rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{
              width: `${goalPct}%`,
              background: goalPct >= 100 ? 'var(--accent)' : `linear-gradient(90deg, ${config.cssColor}99, ${config.cssColor})`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <div className="text-[10px] font-mono text-muted-foreground">{config.name} mode</div>
          <div className="text-[10px] font-mono text-muted-foreground">{goalPct.toFixed(0)}% of goal</div>
        </div>
      </div>

      {/* Streams */}
      <div className="flex flex-col gap-2.5 mt-4">
        {displayStreams.map(stream => {
          const val = income[stream.id] || 0
          const isActive = activeIds.has(stream.id)
          const pct = Math.min(100, (val / stream.max) * 100)
          return (
            <div key={stream.id} className="flex items-center gap-2.5">
              <span className={`text-xs w-[110px] shrink-0 ${isActive ? 'text-text' : 'text-muted-foreground'}`}>
                {stream.name}
                {!isActive && <span className="text-[8px] font-mono ml-1 opacity-60">later</span>}
              </span>
              <input
                type="number"
                className="bg-dim border border-border font-mono text-[13px] px-2 py-1.5 rounded-sm w-20 text-right focus:outline-none focus:border-primary"
                style={{ color: isActive ? config.cssColor : 'var(--muted)' }}
                value={val || ''}
                placeholder="0"
                min={0}
                onChange={e => onIncomeChange(stream.id, parseFloat(e.target.value) || 0)}
              />
              <div className="flex-1 bg-dim h-1 rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-all duration-400"
                  style={{ width: `${pct}%`, background: isActive ? config.cssColor : 'var(--muted)' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
