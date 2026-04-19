"use client"

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Proposal {
  id: string
  date: string
  jobTitle: string
  category: string
  rateBid: number
  status: 'sent' | 'viewed' | 'interviewing' | 'hired' | 'declined' | 'no-response'
  notes: string
}

const STATUS_CONFIG: Record<Proposal['status'], { label: string; color: string }> = {
  'sent':         { label: 'Sent',         color: 'var(--muted)'   },
  'viewed':       { label: 'Viewed',       color: 'var(--accent2)' },
  'interviewing': { label: 'Interview',    color: 'var(--warn)'    },
  'hired':        { label: 'Hired ✓',     color: 'var(--accent)'  },
  'declined':     { label: 'Declined',     color: 'var(--danger)'  },
  'no-response':  { label: 'No Response',  color: 'var(--muted)'   },
}

const CATEGORIES = ['OBM', 'Project Manager', 'VA', 'AI Services', 'Digital Agency', 'Sales', 'Other']

interface UpworkTrackerProps {
  proposals: Proposal[]
  onAdd: (p: Proposal) => void
  onUpdate: (id: string, updates: Partial<Proposal>) => void
  onRemove: (id: string) => void
}

export function UpworkTracker({ proposals, onAdd, onUpdate, onRemove }: UpworkTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ jobTitle: '', category: 'OBM', rateBid: '', notes: '' })

  const today = new Date().toISOString().slice(0, 10)

  // Stats
  const thisWeekStart = new Date()
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())
  const thisWeekStr = thisWeekStart.toISOString().slice(0, 10)
  const thisWeek = proposals.filter(p => p.date >= thisWeekStr).length
  const hired = proposals.filter(p => p.status === 'hired').length
  const interviewing = proposals.filter(p => p.status === 'interviewing').length
  const responseRate = proposals.length > 0
    ? Math.round((proposals.filter(p => p.status !== 'sent' && p.status !== 'no-response').length / proposals.length) * 100)
    : 0

  const handleAdd = () => {
    if (!form.jobTitle.trim()) return
    onAdd({
      id: `up-${Date.now()}`,
      date: today,
      jobTitle: form.jobTitle,
      category: form.category,
      rateBid: parseFloat(form.rateBid) || 0,
      status: 'sent',
      notes: form.notes,
    })
    setForm({ jobTitle: '', category: 'OBM', rateBid: '', notes: '' })
    setShowForm(false)
  }

  const sorted = [...proposals].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Upwork Proposals</div>
          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">{proposals.length} total · {thisWeek} this week</div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.1em] uppercase"
          style={showForm
            ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)' }
            : { borderColor: 'var(--accent2)', color: 'var(--accent2)' }
          }
        >
          <Plus className="w-3 h-3" /> Log
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'This Week', val: thisWeek, target: 10, color: thisWeek >= 10 ? 'var(--accent)' : 'var(--warn)' },
          { label: 'Interviews', val: interviewing, target: null, color: 'var(--warn)' },
          { label: 'Hired', val: hired, target: null, color: 'var(--accent)' },
          { label: 'Response %', val: `${responseRate}%`, target: null, color: responseRate > 20 ? 'var(--accent)' : 'var(--muted)' },
        ].map(({ label, val, target, color }) => (
          <div key={label} className="bg-surface2 rounded-sm p-2 border border-border text-center">
            <div className="font-mono text-[18px] font-bold leading-none" style={{ color }}>{val}</div>
            {target && (
              <div className="mt-1 h-0.5 bg-dim rounded-sm overflow-hidden">
                <div className="h-full rounded-sm" style={{ width: `${Math.min(100, (Number(val) / target) * 100)}%`, background: color }} />
              </div>
            )}
            <div className="font-mono text-[8px] text-muted-foreground uppercase mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Goal reminder */}
      <div
        className="px-3 py-2 rounded-sm border mb-4 text-[10px] font-mono"
        style={{
          borderColor: thisWeek >= 10 ? 'var(--accent)40' : 'var(--border)',
          color: thisWeek >= 10 ? 'var(--accent)' : 'var(--muted)',
        }}
      >
        {thisWeek >= 10 ? `✓ ${thisWeek} proposals this week — plan target hit` : `${10 - thisWeek} more proposals needed to hit the 10/week plan target`}
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border bg-surface2 space-y-2" style={{ borderColor: 'var(--accent2)30' }}>
          <input
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none"
            placeholder="Job title *"
            value={form.jobTitle}
            onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none"
              placeholder="Rate bid ($/hr)"
              value={form.rateBid}
              onChange={e => setForm(f => ({ ...f, rateBid: e.target.value }))}
            />
          </div>
          <input
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.jobTitle.trim()} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: 'var(--accent2)', color: 'var(--bg)' }}>
              Log Proposal
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Proposal list */}
      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
        {sorted.map(p => {
          const cfg = STATUS_CONFIG[p.status]
          return (
            <div key={p.id} className="flex items-center gap-2.5 p-2.5 rounded-sm border border-border bg-surface2 group">
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[12px] text-text truncate">{p.jobTitle}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-[9px] text-muted-foreground">{p.category}</span>
                  {p.rateBid > 0 && <span className="font-mono text-[9px] text-muted-foreground">${p.rateBid}/hr</span>}
                  <span className="font-mono text-[9px] text-muted-foreground">{p.date}</span>
                </div>
              </div>
              <select
                className="bg-surface border border-border font-mono text-[9px] px-1.5 py-1 rounded-sm focus:outline-none cursor-pointer"
                style={{ color: cfg.color, borderColor: cfg.color + '40' }}
                value={p.status}
                onChange={e => onUpdate(p.id, { status: e.target.value as Proposal['status'] })}
              >
                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <button
                onClick={() => onRemove(p.id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger transition-all cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>

      {proposals.length === 0 && !showForm && (
        <div className="text-center py-5 text-[11px] font-mono text-muted-foreground">
          Plan target: 10 proposals per week minimum.<br />Log each one here to track your pipeline.
        </div>
      )}
    </div>
  )
}
