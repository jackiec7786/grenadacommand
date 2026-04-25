"use client"

import { useState } from 'react'
import type { MergedConfig } from '@/lib/config'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const CATEGORIES = [
  { id: 'month1', label: 'Month 1' },
  { id: 'lowMood', label: 'Low Mood' },
  { id: 'lowIncome', label: 'Low Income' },
  { id: 'onTrack', label: 'On Track' },
  { id: 'streakMilestone', label: 'Streak' },
]

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent'

export function PsychTab({ config, onSaveConfig }: Props) {
  const [category, setCategory] = useState('month1')
  const [messages, setMessages] = useState<Record<string, string[]>>(() => {
    const copy: Record<string, string[]> = {}
    for (const c of CATEGORIES) copy[c.id] = [...(config.psychMessages[c.id] ?? [])]
    return copy
  })
  const [editIdx, setEditIdx] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [newMsg, setNewMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const current = messages[category] ?? []

  const startEdit = (i: number) => { setEditIdx(i); setEditText(current[i]) }
  const commitEdit = () => {
    if (editIdx !== null && editText.trim()) {
      setMessages(prev => ({ ...prev, [category]: prev[category].map((m, i) => i === editIdx ? editText.trim() : m) }))
    }
    setEditIdx(null)
  }
  const remove = (i: number) => setMessages(prev => ({ ...prev, [category]: prev[category].filter((_, idx) => idx !== i) }))
  const add = () => {
    if (!newMsg.trim()) return
    setMessages(prev => ({ ...prev, [category]: [...(prev[category] ?? []), newMsg.trim()] }))
    setNewMsg('')
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ psychMessages: messages })
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => { setCategory(c.id); setEditIdx(null) }}
            className="px-3 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer border transition-all"
            style={category === c.id
              ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' }
              : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">{CATEGORIES.find(c => c.id === category)?.label} Messages</div>
          <span className="font-mono text-[9px] text-muted-foreground">{current.length} messages</span>
        </div>

        {current.map((msg, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-sm bg-surface border border-border group">
            {editIdx === i ? (
              <input autoFocus className={`${inp} flex-1`} value={editText} onChange={e => setEditText(e.target.value)}
                onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditIdx(null) }} />
            ) : (
              <span className="flex-1 font-mono text-[11px] text-text cursor-pointer hover:text-primary leading-relaxed" onClick={() => startEdit(i)}>{msg}</span>
            )}
            <button onClick={() => remove(i)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all shrink-0">×</button>
          </div>
        ))}

        {current.length === 0 && (
          <div className="text-center py-4 text-[11px] font-mono text-muted-foreground">No messages. Add one below.</div>
        )}

        <div className="pt-2 flex gap-2 border-t border-border mt-2">
          <input className={`${inp} flex-1`} placeholder="New message..." value={newMsg} onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') add() }} />
          <button onClick={add} disabled={!newMsg.trim()} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Add</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save All Categories'}
        </button>
        <button onClick={() => onSaveConfig({ psychMessages: null })} disabled={saving}
          className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
