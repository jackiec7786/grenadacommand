"use client"

import { RISK_QUICK_RESPONSES } from '@/lib/data'
import { useState } from 'react'
import { useConfig } from '@/hooks/use-config'
import { AlertTriangle, ChevronDown, ChevronUp, Shield } from 'lucide-react'

const PROB_COLORS = { HIGH: 'var(--danger)', MEDIUM: 'var(--warn)', LOW: 'var(--accent2)' }
const IMPACT_COLORS = { CRITICAL: 'var(--danger)', HIGH: 'var(--warn)', MEDIUM: 'var(--accent2)' }

export function RiskPanel() {
  const config = useConfig()
  const [activeTab, setActiveTab] = useState<'scenarios' | 'quick'>('quick')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--danger)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" style={{ color: 'var(--danger)' }} />
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Risk & Contingency</div>
        </div>
        <div className="flex gap-1">
          {(['quick', 'scenarios'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-[9px] font-mono px-2.5 py-1 rounded-sm border cursor-pointer transition-all uppercase tracking-[0.1em]"
              style={activeTab === tab
                ? { background: 'var(--danger)', color: 'var(--bg)', borderColor: 'var(--danger)' }
                : { borderColor: 'var(--border)', color: 'var(--muted)' }
              }
            >
              {tab === 'quick' ? 'Quick Ref' : 'Scenarios'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Response Guide */}
      {activeTab === 'quick' && (
        <div>
          <div className="text-[10px] font-mono text-muted-foreground mb-3 leading-relaxed">
            Something broke? Find it here. Act within 24 hours.
          </div>
          <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
            {RISK_QUICK_RESPONSES.map((item, i) => (
              <div
                key={i}
                className="p-2.5 rounded-sm border border-border bg-surface2 cursor-pointer hover:border-danger/40 transition-all"
                onClick={() => setExpandedId(expandedId === `q${i}` ? null : `q${i}`)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" style={{ color: 'var(--warn)' }} />
                    <span className="font-mono text-[11px] font-semibold text-text">{item.trigger}</span>
                  </div>
                  {expandedId === `q${i}` ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />}
                </div>
                {expandedId === `q${i}` && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="font-mono text-[11px] leading-relaxed" style={{ color: 'var(--accent2)' }}>
                      → {item.response}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Scenarios */}
      {activeTab === 'scenarios' && (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
          {config.riskScenarios.map(scenario => {
            const isExpanded = expandedId === scenario.id
            return (
              <div key={scenario.id} className="border border-border rounded-sm overflow-hidden">
                <div
                  className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-surface2 transition-all"
                  onClick={() => setExpandedId(isExpanded ? null : scenario.id)}
                >
                  <div className="flex gap-1.5 shrink-0">
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm" style={{ background: PROB_COLORS[scenario.probability] + '20', color: PROB_COLORS[scenario.probability] }}>
                      {scenario.probability}
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm" style={{ background: IMPACT_COLORS[scenario.impact] + '20', color: IMPACT_COLORS[scenario.impact] }}>
                      {scenario.impact}
                    </span>
                  </div>
                  <span className="font-mono text-[12px] text-text flex-1">{scenario.title}</span>
                  {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />}
                </div>
                {isExpanded && (
                  <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-3">
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--danger)' }}>Immediate Actions (0–48hrs)</div>
                      {scenario.immediateActions.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <span className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--danger)' }}>{i + 1}.</span>
                          <span className="text-[11px] text-text">{a}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-[0.1em] mb-1.5 text-muted-foreground">Parallel Actions</div>
                      {scenario.parallelActions.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <span className="font-mono text-[9px] mt-0.5 text-muted-foreground">→</span>
                          <span className="text-[11px] text-muted-foreground">{a}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[9px] font-mono uppercase tracking-[0.1em] mb-1.5" style={{ color: 'var(--accent2)' }}>Prevention</div>
                      {scenario.prevention.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 mb-1">
                          <span className="font-mono text-[9px] mt-0.5" style={{ color: 'var(--accent2)' }}>✓</span>
                          <span className="text-[11px] text-muted-foreground">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
