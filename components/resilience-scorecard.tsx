"use client"

import { Check, Shield } from 'lucide-react'
import { useConfig } from '@/hooks/use-config'

interface ResilienceScorecardProps {
  resilience: Record<string, boolean>
  onToggle: (id: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  Platform:   'var(--accent2)',
  Suppliers:  'var(--warn)',
  Logistics:  'var(--purple)',
  Banking:    'var(--accent)',
  Emergency:  'var(--danger)',
  Insurance:  'var(--warn)',
  Platforms:  'var(--accent2)',
  SpiceClass: 'var(--accent)',
}

export function ResilienceScorecard({ resilience, onToggle }: ResilienceScorecardProps) {
  const config = useConfig()
  const done = config.resilienceItems.filter(i => resilience[i.id]).length
  const total = config.resilienceItems.length
  const pct = Math.round((done / total) * 100)

  const riskLevel = pct < 30 ? 'HIGH RISK' : pct < 60 ? 'MODERATE' : pct < 90 ? 'GOOD' : 'RESILIENT'
  const riskColor = pct < 30 ? 'var(--danger)' : pct < 60 ? 'var(--warn)' : pct < 90 ? 'var(--accent2)' : 'var(--accent)'

  const categories = [...new Set(config.resilienceItems.map(i => i.category))]

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: riskColor }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: riskColor }} />
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Resilience Scorecard</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px]" style={{ color: riskColor }}>{riskLevel}</span>
          <span className="font-mono text-[10px] text-muted-foreground">{done}/{total}</span>
        </div>
      </div>

      {/* Overall bar */}
      <div className="h-2 bg-dim rounded-sm overflow-hidden mb-4">
        <div className="h-full rounded-sm transition-all duration-500" style={{ width: `${pct}%`, background: riskColor }} />
      </div>

      {/* Warning if low */}
      {pct < 40 && (
        <div className="mb-4 p-2.5 rounded-sm border text-[11px] font-mono" style={{ borderColor: 'var(--danger)40', color: 'var(--danger)', background: 'var(--danger)0d' }}>
          Low resilience. A single platform failure could collapse income. Complete Banking and Emergency items first.
        </div>
      )}

      {/* Items by category */}
      <div className="flex flex-col gap-3">
        {categories.map(cat => {
          const catItems = config.resilienceItems.filter(i => i.category === cat)
          const catDone = catItems.filter(i => resilience[i.id]).length
          const color = CATEGORY_COLORS[cat] || 'var(--muted)'
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono uppercase tracking-[0.15em] font-semibold" style={{ color }}>{cat}</span>
                <span className="font-mono text-[9px] text-muted-foreground">{catDone}/{catItems.length}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {catItems.map(item => {
                  const isDone = !!resilience[item.id]
                  return (
                    <div
                      key={item.id}
                      onClick={() => onToggle(item.id)}
                      className={`flex items-start gap-2.5 p-2 px-2.5 rounded-sm border cursor-pointer transition-all ${isDone ? 'border-transparent opacity-50' : 'border-border bg-surface2 hover:border-muted-foreground'}`}
                    >
                      <div
                        className="w-4 h-4 border-2 rounded-sm shrink-0 flex items-center justify-center mt-0.5 transition-all"
                        style={isDone ? { background: color, borderColor: color } : { borderColor: 'var(--muted)' }}
                      >
                        {isDone && <Check className="w-2.5 h-2.5 text-bg" strokeWidth={3} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-[11px] leading-snug ${isDone ? 'line-through text-muted-foreground' : 'text-text'}`}>
                          {item.text}
                        </div>
                        <div className="text-[9px] font-mono text-muted-foreground mt-0.5">Ideal: {item.ideal}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {pct === 100 && (
        <div className="mt-4 pt-4 border-t border-border text-center">
          <div className="text-[13px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>
            ✓ Fully resilient — no single point of failure
          </div>
        </div>
      )}
    </div>
  )
}
