"use client"

import { useState } from 'react'
import { PHASE_CONFIGS } from '@/lib/data'
import type { MergedConfig, ConfigChecklistItem } from '@/lib/config'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent'

export function ChecklistsTab({ config, onSaveConfig }: Props) {
  const [phase, setPhase] = useState(1)
  const [lists, setLists] = useState<Record<number, ConfigChecklistItem[]>>(() => {
    const copy: Record<number, ConfigChecklistItem[]> = {}
    for (const p of [1, 2, 3, 4]) copy[p] = (config?.phaseChecklists?.[p] ?? []).map(i => ({ ...i }))
    return copy
  })
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editCat, setEditCat] = useState('')
  const [newText, setNewText] = useState('')
  const [newCat, setNewCat] = useState('')
  const [saving, setSaving] = useState(false)

  const items = lists[phase] || []

  const startEdit = (item: ConfigChecklistItem) => {
    setEditId(item.id)
    setEditText(item.text)
    setEditCat(item.category)
  }

  const commitEdit = () => {
    if (editId && editText.trim()) {
      setLists(prev => ({
        ...prev,
        [phase]: prev[phase].map(i => i.id === editId ? { ...i, text: editText.trim(), category: editCat.trim() || i.category } : i),
      }))
    }
    setEditId(null)
  }

  const remove = (id: string) => setLists(prev => ({ ...prev, [phase]: prev[phase].filter(i => i.id !== id) }))

  const add = () => {
    if (!newText.trim()) return
    const id = `c${phase}_${Date.now()}`
    setLists(prev => ({ ...prev, [phase]: [...(prev[phase] || []), { id, category: newCat.trim().toUpperCase() || 'TASK', text: newText.trim() }] }))
    setNewText('')
    setNewCat('')
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ phaseChecklists: lists })
    setSaving(false)
  }

  const handleResetPhase = () => {
    const original = config?.phaseChecklists?.[phase] ?? []
    setLists(prev => ({ ...prev, [phase]: original.map(i => ({ ...i })) }))
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
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Phase {phase} Checklist</div>
          <button onClick={handleResetPhase} className="text-[9px] font-mono text-muted-foreground hover:text-danger cursor-pointer">Reset phase</button>
        </div>

        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 p-2 rounded-sm bg-surface border border-border group">
            {editId === item.id ? (
              <>
                <input className={`${inp} w-20`} value={editCat} onChange={e => setEditCat(e.target.value)} placeholder="CAT"
                  onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit() }} />
                <input autoFocus className={`${inp} flex-1`} value={editText} onChange={e => setEditText(e.target.value)}
                  onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditId(null) }} />
              </>
            ) : (
              <>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-sm bg-dim text-muted-foreground shrink-0 tracking-[0.1em]">{item.category}</span>
                <span className="flex-1 font-mono text-[11px] text-text cursor-pointer hover:text-primary" onClick={() => startEdit(item)}>{item.text}</span>
              </>
            )}
            <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all">×</button>
          </div>
        ))}

        <div className="pt-2 space-y-2 border-t border-border mt-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Add item</div>
          <div className="flex gap-2">
            <input className={`${inp} w-24`} placeholder="CATEGORY" value={newCat} onChange={e => setNewCat(e.target.value)} />
            <input className={`${inp} flex-1`} placeholder="Item text *" value={newText} onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') add() }} />
            <button onClick={add} disabled={!newText.trim()} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Add</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save All Phases'}
        </button>
        <button onClick={() => onSaveConfig({ phaseChecklists: null })} disabled={saving}
          className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset All
        </button>
      </div>
    </div>
  )
}
