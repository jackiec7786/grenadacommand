"use client"

import { useState, useEffect } from 'react'
import { PHASE_CONFIGS } from '@/lib/data'
import { useConfig } from '@/hooks/use-config'
import { Check } from 'lucide-react'

interface PhaseChecklistProps {
  currentPhase: number
  phaseChecks: Record<string, boolean>
  onToggle: (id: string) => void
  cash: number
}

const CATEGORY_COLORS: Record<string, string> = {
  INTERNET: 'var(--accent2)', CAMBLY: 'var(--accent)', INCOME: 'var(--accent)',
  JOBS: 'var(--warn)', NETWORK: 'var(--purple)', SPICE: 'var(--accent)',
  UPWORK: 'var(--accent2)', AMAZON: 'var(--warn)', AGENCY: 'var(--purple)',
  BUSINESS: 'var(--accent2)', POD: 'var(--muted)', CAPITAL: 'var(--accent)',
  TIKTOK: 'var(--danger)', PROPERTY: 'var(--purple)',
}

export function SurvivalChecklist({ currentPhase, phaseChecks, onToggle, cash }: PhaseChecklistProps) {
  const appConfig = useConfig()
  const items = appConfig.phaseChecklists[currentPhase] || []
  const config = PHASE_CONFIGS[currentPhase as keyof typeof PHASE_CONFIGS]
  const done = items.filter(i => phaseChecks[i.id]).length
  const total = items.length
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const weeksLeft = cash > 0 ? Math.floor((cash / 1300) * 4.33) : 0

  const seen = new Set<string>()
  const categories: string[] = []
  items.forEach(i => { if (!seen.has(i.category)) { seen.add(i.category); categories.push(i.category) } })

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  useEffect(() => {
    const s = new Set<string>()
    categories.forEach(cat => {
      const catItems = items.filter(i => i.category === cat)
      if (catItems.length > 0 && catItems.every(i => phaseChecks[i.id])) s.add(cat)
    })
    setCollapsed(s)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, phaseChecks])

  const toggleCat = (cat: string) =>
    setCollapsed(prev => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n })

  const barColor = pct === 100 ? 'var(--accent)' : pct > 60 ? 'var(--warn)' : config.cssColor

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: config.cssColor }}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Phase {currentPhase} Setup Checklist</div>
        <div className="font-mono text-[11px]" style={{ color: config.cssColor }}>{done}/{total}</div>
      </div>

      <div className="text-[11px] font-mono text-muted-foreground mb-3 leading-relaxed">{config.focus}</div>

      <div className="h-1.5 bg-dim rounded-sm overflow-hidden mb-4">
        <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, background: barColor }} />
      </div>

      {weeksLeft > 0 && weeksLeft <= 6 && currentPhase === 1 && (
        <div className="mb-4 p-2.5 rounded-sm border text-[11px] font-mono" style={{ borderColor: 'var(--warn)', color: 'var(--warn)', background: 'rgba(255,140,66,0.05)' }}>
          {weeksLeft} weeks of cash left — complete income items first
        </div>
      )}

      <div className="mb-4 p-2.5 rounded-sm border border-border bg-surface2">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1">Gate to Phase {currentPhase + 1 > 4 ? '✓' : currentPhase + 1}</div>
        <div className="text-[11px] font-mono text-text">{config.incomeGate}</div>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          const catDone = catItems.filter(i => phaseChecks[i.id]).length
          const color = CATEGORY_COLORS[cat] || 'var(--muted)'
          const allDone = catDone === catItems.length
          const isCollapsed = collapsed.has(cat)

          return (
            <div key={cat}>
              <button onClick={() => toggleCat(cat)}
                className="flex items-center justify-between w-full mb-1.5 cursor-pointer min-h-[36px]">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono tracking-[0.2em] uppercase font-semibold" style={{ color }}>
                    {allDone ? '✓ ' : ''}{cat}
                  </span>
                  {allDone && <span className="text-[8px] font-mono text-muted-foreground">(done)</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] text-muted-foreground">{catDone}/{catItems.length}</span>
                  <span className="text-[9px] font-mono text-muted-foreground">{isCollapsed ? '▶' : '▼'}</span>
                </div>
              </button>

              {!isCollapsed && (
                <div className="flex flex-col gap-1.5">
                  {catItems.map(item => {
                    const isDone = !!phaseChecks[item.id]
                    return (
                      <div key={item.id} onClick={() => onToggle(item.id)}
                        className={`flex items-start gap-2.5 p-2 px-2.5 rounded-sm border cursor-pointer transition-all min-h-[44px] ${isDone ? 'border-transparent opacity-50' : 'border-border bg-surface2 hover:border-muted-foreground'}`}>
                        <div className="w-4 h-4 border-2 rounded-sm shrink-0 flex items-center justify-center transition-all mt-0.5"
                          style={isDone ? { background: color, borderColor: color } : { borderColor: 'var(--muted)' }}>
                          {isDone && <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />}
                        </div>
                        <span className={`text-[12px] leading-relaxed ${isDone ? 'line-through text-muted-foreground' : 'text-text'}`}>
                          {item.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {pct === 100 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <div className="text-[13px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>
            ✓ Phase {currentPhase} setup complete
            {currentPhase < 4 && ' — check the gate condition to advance'}
          </div>
        </div>
      )}
    </div>
  )
}
