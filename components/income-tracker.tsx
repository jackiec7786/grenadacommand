"use client"

import { PHASE_CONFIGS, PHASE_INCOME_TARGETS } from '@/lib/data'
import { useConfig } from '@/hooks/use-config'

interface IncomeTrackerProps {
  income: Record<string, number>
  currentPhase: number
  onIncomeChange: (id: string, value: number) => void
}

const QUICK_LINKS: Partial<Record<string, { label: string; href: string }>> = {
  upwork:     { label: 'Find Jobs',      href: 'https://upwork.com/nx/jobs/search' },
  cambly:     { label: 'Go to Cambly',   href: 'https://cambly.com/tutor' },
  callcenter: { label: 'TTEC Portal',    href: 'https://ttec.com' },
  spice:      { label: 'List on Spice',  href: 'https://spiceclassifieds.com/post' },
  amazon:     { label: 'Seller Central', href: 'https://sellercentral.amazon.com' },
  agency:     { label: 'Find Clients',   href: 'https://upwork.com/nx/jobs/search' },
}

export function IncomeTracker({ income, currentPhase, onIncomeChange }: IncomeTrackerProps) {
  const appConfig = useConfig()
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]
  const goal = PHASE_INCOME_TARGETS[currentPhase] || 2500
  const total = Object.values(income).reduce((s, v) => s + (v || 0), 0)
  const goalPct = Math.min(100, (total / goal) * 100)

  const activeIds = new Set<string>(config.activeStreams)
  const activeStreams = appConfig.incomeStreams.filter(s => activeIds.has(s.id))
  const otherStreams = appConfig.incomeStreams.filter(s => !activeIds.has(s.id) && (income[s.id] || 0) > 0)
  const displayStreams = [...activeStreams, ...otherStreams]

  return (
    <div className="bg-surface border border-border rounded-md p-5 animate-fade-slide-in" style={{ borderTopWidth: 2, borderTopColor: config.cssColor }}>
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-3">
        // Monthly Income Tracker
      </div>

      <div className="flex items-end justify-between mb-1">
        <div className="text-[42px] font-extrabold font-mono leading-none" style={{ color: config.cssColor }}>
          ${total.toLocaleString()}
        </div>
        <div className="text-right pb-1">
          <div className="text-[11px] font-mono text-muted-foreground">phase {currentPhase} goal</div>
          <div className="text-[15px] font-bold font-mono text-muted-foreground">${goal.toLocaleString()}</div>
        </div>
      </div>

      <div className="mb-1">
        <div className="h-1.5 bg-dim rounded-sm overflow-hidden">
          <div className="h-full rounded-sm transition-all duration-500"
            style={{ width: `${goalPct}%`, background: goalPct >= 100 ? 'var(--accent)' : `linear-gradient(90deg, ${config.cssColor}99, ${config.cssColor})` }} />
        </div>
        <div className="flex justify-between mt-1">
          <div className="text-[10px] font-mono text-muted-foreground">{config.name} mode</div>
          <div className="text-[10px] font-mono text-muted-foreground">{goalPct.toFixed(0)}% of goal</div>
        </div>
      </div>

      {total === 0 && (
        <div className="mt-3 text-[11px] font-mono text-muted-foreground">
          No income logged yet. Enter amounts below to track progress.
        </div>
      )}

      <div className="flex flex-col gap-2.5 mt-4">
        {displayStreams.map(stream => {
          const val = income[stream.id] || 0
          const isActive = activeIds.has(stream.id)
          const pct = Math.min(100, (val / stream.max) * 100)
          const link = QUICK_LINKS[stream.id]
          return (
            <div key={stream.id} className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 w-[130px] shrink-0">
                <span className={`text-xs ${isActive ? 'text-text' : 'text-muted-foreground'}`}>
                  {stream.name}
                  {!isActive && <span className="text-[8px] font-mono ml-1 opacity-60">later</span>}
                </span>
                {link && isActive && (
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-[8px] font-mono text-accent hover:underline cursor-pointer shrink-0" title={link.label}>
                    ↗
                  </a>
                )}
              </div>
              <input type="number"
                className="bg-dim border border-border font-mono text-[13px] px-2 py-1.5 rounded-sm w-20 text-right focus:outline-none focus:border-primary min-h-[36px]"
                style={{ color: isActive ? config.cssColor : 'var(--muted)' }}
                value={val || ''} placeholder="0" min={0}
                onChange={e => onIncomeChange(stream.id, parseFloat(e.target.value) || 0)} />
              <div className="flex-1 bg-dim h-1 rounded-sm overflow-hidden">
                <div className="h-full rounded-sm transition-all duration-400"
                  style={{ width: `${pct}%`, background: isActive ? config.cssColor : 'var(--muted)' }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-border">
        {activeStreams.filter(s => QUICK_LINKS[s.id]).map(s => {
          const link = QUICK_LINKS[s.id]!
          return (
            <a key={s.id} href={link.href} target="_blank" rel="noopener noreferrer"
              className="font-mono text-[9px] px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all min-h-[36px] flex items-center"
              style={{ borderColor: config.cssColor + '60', color: config.cssColor }}>
              {link.label} ↗
            </a>
          )
        })}
      </div>
    </div>
  )
}
