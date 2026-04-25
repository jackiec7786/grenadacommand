"use client"

import { useState } from 'react'
import { MILESTONES, PHASE_CONFIGS } from '@/lib/data'
import type { MergedConfig, ConfigMilestone } from '@/lib/config'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent'

export function MilestonesTab({ config, onSaveConfig }: Props) {
  const [phase, setPhase] = useState(1)
  const [items, setItems] = useState<ConfigMilestone[]>(() => (config?.milestones ?? []).map(m => ({ ...m })))
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editMonth, setEditMonth] = useState('')
  const [newText, setNewText] = useState('')
  const [newMonth, setNewMonth] = useState('')
  const [saving, setSaving] = useState(false)

  const phaseItems = items.filter(m => m.phase === phase)

  const startEdit = (m: ConfigMilestone) => {
    setEditId(m.id)
    setEditText(m.text)
    setEditMonth(m.month)
  }

  const commitEdit = () => {
    if (editId && editText.trim()) {
      setItems(prev => prev.map(m => m.id === editId ? { ...m, text: editText.trim(), month: editMonth.trim() || m.month } : m))
    }
    setEditId(null)
  }

  const remove = (id: string) => setItems(prev => prev.filter(m => m.id !== id))

  const add = () => {
    if (!newText.trim()) return
    const id = `m_${Date.now()}`
    setItems(prev => [...prev, { id, text: newText.trim(), month: newMonth.trim() || '—', phase }])
    setNewText('')
    setNewMonth('')
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ milestones: items })
    setSaving(false)
  }

  const handleReset = async () => {
    const copy = MILESTONES.map(m => ({ ...m }))
    setItems(copy)
    setSaving(true)
    await onSaveConfig({ milestones: null })
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap">
        {([1, 2, 3, 4] as const).map(p => {
          const cfg = PHASE_CONFIGS[p]
          return (
            <button key={p} onClick={() => setPhase(p)} className="px-3 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer border transition-all"
              style={phase === p ? { background: cfg.cssColor, color: 'var(--bg)', borderColor: cfg.cssColor } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {cfg.name}
            </button>
          )
        })}
      </div>

      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Phase {phase} Milestones</div>
          <span className="font-mono text-[9px] text-muted-foreground">{phaseItems.length} items</span>
        </div>

        {phaseItems.map(m => (
          <div key={m.id} className="flex items-center gap-2 p-2 rounded-sm bg-surface border border-border group">
            {editId === m.id ? (
              <>
                <input autoFocus className={`${inp} flex-1`} value={editText} onChange={e => setEditText(e.target.value)}
                  onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditId(null) }} />
                <input className={`${inp} w-24`} value={editMonth} onChange={e => setEditMonth(e.target.value)}
                  placeholder="Month" onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit() }} />
              </>
            ) : (
              <>
                <span className="flex-1 font-mono text-[11px] text-text cursor-pointer hover:text-primary" onClick={() => startEdit(m)}>{m.text}</span>
                <span className="font-mono text-[9px] text-muted-foreground shrink-0 w-16 text-right">{m.month}</span>
              </>
            )}
            <button onClick={() => remove(m.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all">×</button>
          </div>
        ))}

        <div className="pt-2 space-y-2 border-t border-border mt-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Add milestone</div>
          <input className={`${inp} w-full`} placeholder="Milestone text *" value={newText} onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add() }} />
          <div className="flex gap-2">
            <input className={`${inp} flex-1`} placeholder="Timing (e.g. Month 2)" value={newMonth} onChange={e => setNewMonth(e.target.value)} />
            <button onClick={add} disabled={!newText.trim()} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Add</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save All'}
        </button>
        <button onClick={handleReset} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
