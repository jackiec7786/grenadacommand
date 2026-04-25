"use client"

import { useState } from 'react'
import type { MergedConfig } from '@/lib/config'
import type { RiskScenario } from '@/lib/data'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent w-full'
const PROB_COLORS: Record<string, string> = { HIGH: 'var(--danger)', MEDIUM: 'var(--warn)', LOW: 'var(--accent2)' }
const IMPACT_COLORS: Record<string, string> = { CRITICAL: 'var(--danger)', HIGH: 'var(--warn)', MEDIUM: 'var(--accent2)' }

function arrToText(arr: string[]) { return arr.join('\n') }
function textToArr(text: string) { return text.split('\n').map(s => s.trim()).filter(Boolean) }

export function RisksTab({ config, onSaveConfig }: Props) {
  const [risks, setRisks] = useState<RiskScenario[]>(() => (config?.riskScenarios ?? []).map(r => ({
    ...r,
    immediateActions: [...(r.immediateActions ?? [])],
    parallelActions: [...(r.parallelActions ?? [])],
    prevention: [...(r.prevention ?? [])],
  })))
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const update = (id: string, field: keyof RiskScenario, value: unknown) => {
    setRisks(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const remove = (id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const addRisk = () => {
    const id = `r_${Date.now()}`
    const blank: RiskScenario = {
      id, title: 'New Risk Scenario',
      probability: 'MEDIUM', impact: 'HIGH',
      immediateActions: [], parallelActions: [], prevention: [],
    }
    setRisks(prev => [...prev, blank])
    setExpandedId(id)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ riskScenarios: risks })
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Risk Scenarios</div>
          <button onClick={addRisk} className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-sm cursor-pointer"
            style={{ background: 'var(--danger)', color: 'var(--bg)' }}>+ Add</button>
        </div>

        {risks.map(r => {
          const isOpen = expandedId === r.id
          return (
            <div key={r.id} className="border border-border rounded-sm overflow-hidden">
              <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-surface transition-all group"
                onClick={() => setExpandedId(isOpen ? null : r.id)}>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{ background: PROB_COLORS[r.probability] + '20', color: PROB_COLORS[r.probability] }}>{r.probability}</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{ background: IMPACT_COLORS[r.impact] + '20', color: IMPACT_COLORS[r.impact] }}>{r.impact}</span>
                <span className="flex-1 font-mono text-[11px] text-text">{r.title}</span>
                <button onClick={e => { e.stopPropagation(); remove(r.id) }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all">×</button>
                <span className="font-mono text-[9px] text-muted-foreground">{isOpen ? '▼' : '▶'}</span>
              </div>

              {isOpen && (
                <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-3">
                  <div>
                    <label className="text-[9px] font-mono text-muted-foreground uppercase">Title</label>
                    <input className={inp} value={r.title} onChange={e => update(r.id, 'title', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Probability</label>
                      <select className={`${inp} cursor-pointer`} value={r.probability} onChange={e => update(r.id, 'probability', e.target.value as RiskScenario['probability'])}>
                        {['HIGH', 'MEDIUM', 'LOW'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Impact</label>
                      <select className={`${inp} cursor-pointer`} value={r.impact} onChange={e => update(r.id, 'impact', e.target.value as RiskScenario['impact'])}>
                        {['CRITICAL', 'HIGH', 'MEDIUM'].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  {([
                    ['immediateActions', 'Immediate Actions (0–48hrs)'],
                    ['parallelActions', 'Parallel Actions'],
                    ['prevention', 'Prevention'],
                  ] as [keyof RiskScenario, string][]).map(([field, label]) => (
                    <div key={field as string}>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase mb-1 block">{label} — one per line</label>
                      <textarea className={`${inp} resize-none`} rows={3}
                        value={arrToText(r[field] as string[])}
                        onChange={e => update(r.id, field, textToArr(e.target.value))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => onSaveConfig({ riskScenarios: null })} disabled={saving}
          className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
