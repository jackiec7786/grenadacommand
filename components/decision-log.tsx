"use client"

import { useState } from 'react'
import { type Decision, DECISION_CATEGORIES } from '@/lib/data'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'

interface DecisionLogProps {
  decisions: Decision[]
  currentPhase: number
  onAdd: (decision: Decision) => void
  onUpdateOutcome: (id: string, outcome: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  'Phase Advance':      'var(--accent)',
  'Income Strategy':    'var(--accent2)',
  'Amazon FBA':         'var(--warn)',
  'SpiceClassifieds':   'var(--accent)',
  'Capital Allocation': 'var(--purple)',
  'Cut / Stop':         'var(--danger)',
  'Other':              'var(--muted)',
}

export function DecisionLog({ decisions, currentPhase, onAdd, onUpdateOutcome }: DecisionLogProps) {
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState({
    category: 'Income Strategy' as typeof DECISION_CATEGORIES[number],
    decision: '',
    reasoning: '',
  })

  const todayStr = new Date().toISOString().slice(0, 10)

  const handleAdd = () => {
    if (!form.decision.trim() || !form.reasoning.trim()) return
    onAdd({
      id: `dec-${Date.now()}`,
      date: todayStr,
      category: form.category,
      decision: form.decision,
      reasoning: form.reasoning,
      phase: currentPhase,
    })
    setForm({ category: 'Income Strategy', decision: '', reasoning: '' })
    setShowForm(false)
  }

  const sorted = [...decisions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--purple)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Decision Log</div>
          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{decisions.length} decisions recorded</div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.1em] uppercase"
          style={showForm
            ? { background: 'var(--purple)', color: 'var(--bg)', borderColor: 'var(--purple)' }
            : { borderColor: 'var(--purple)', color: 'var(--purple)' }
          }
        >
          <Plus className="w-3 h-3" /> Log Decision
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border bg-surface2 space-y-2" style={{ borderColor: 'var(--purple)30' }}>
          <select
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none"
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
          >
            {DECISION_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none"
            placeholder="The decision made (clear, one sentence) *"
            value={form.decision}
            onChange={e => setForm(f => ({ ...f, decision: e.target.value }))}
          />
          <textarea
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm resize-none h-16 focus:outline-none"
            placeholder="Why this decision? What data or condition triggered it? *"
            value={form.reasoning}
            onChange={e => setForm(f => ({ ...f, reasoning: e.target.value }))}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.decision.trim() || !form.reasoning.trim()} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: 'var(--purple)', color: 'var(--bg)' }}>
              Log It
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground hover:border-muted-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Decision list */}
      <div className="flex flex-col gap-1.5 max-h-80 overflow-y-auto">
        {sorted.map(dec => {
          const isExpanded = expandedId === dec.id
          const color = CATEGORY_COLORS[dec.category] || 'var(--muted)'
          return (
            <div key={dec.id} className="border border-border rounded-sm overflow-hidden">
              <div
                className="flex items-start gap-2.5 p-2.5 cursor-pointer hover:bg-surface2 transition-all"
                onClick={() => setExpandedId(isExpanded ? null : dec.id)}
              >
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[12px] text-text leading-snug">{dec.decision}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[9px]" style={{ color }}>{dec.category}</span>
                    <span className="font-mono text-[9px] text-muted-foreground">P{dec.phase} · {dec.date}</span>
                    {dec.outcome && <span className="font-mono text-[9px] text-primary">outcome logged</span>}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0 mt-1" />}
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-2">
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-0.5">Reasoning</div>
                    <div className="text-[12px] text-text">{dec.reasoning}</div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Outcome (fill in later)</div>
                    <input
                      className="w-full bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none focus:border-purple"
                      placeholder="What actually happened as a result..."
                      value={dec.outcome || ''}
                      onChange={e => onUpdateOutcome(dec.id, e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {decisions.length === 0 && !showForm && (
        <div className="text-center py-6 text-[11px] font-mono text-muted-foreground">
          Log every major decision here. Phase advances, strategy pivots, PO placement, stream cuts.
        </div>
      )}
    </div>
  )
}
