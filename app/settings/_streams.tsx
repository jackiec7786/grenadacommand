"use client"

import { useState } from 'react'
import type { MergedConfig, ConfigIncomeStream } from '@/lib/config'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent'

export function StreamsTab({ config, onSaveConfig }: Props) {
  const [streams, setStreams] = useState<ConfigIncomeStream[]>(() => (config?.incomeStreams ?? []).map(s => ({ ...s })))
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editMax, setEditMax] = useState('')
  const [newId, setNewId] = useState('')
  const [newName, setNewName] = useState('')
  const [newMax, setNewMax] = useState('')
  const [saving, setSaving] = useState(false)

  const startEdit = (s: ConfigIncomeStream) => { setEditId(s.id); setEditName(s.name); setEditMax(String(s.max)) }

  const commitEdit = () => {
    if (editId && editName.trim()) {
      setStreams(prev => prev.map(s => s.id === editId ? { ...s, name: editName.trim(), max: parseInt(editMax) || s.max } : s))
    }
    setEditId(null)
  }

  const remove = (id: string) => setStreams(prev => prev.filter(s => s.id !== id))

  const add = () => {
    if (!newId.trim() || !newName.trim()) return
    const id = newId.trim().toLowerCase().replace(/\s+/g, '_')
    if (streams.find(s => s.id === id)) return
    setStreams(prev => [...prev, { id, name: newName.trim(), max: parseInt(newMax) || 1000 }])
    setNewId(''); setNewName(''); setNewMax('')
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ incomeStreams: streams })
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-[11px] font-mono text-muted-foreground">
        Edit income stream names and max values. The id must be unique and lowercase. Max is used for progress bars.
      </p>

      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 mb-1 px-2">
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Name</span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] w-16 text-right">ID</span>
          <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] w-16 text-right">Max</span>
          <span className="w-6" />
        </div>

        {streams.map(s => (
          <div key={s.id} className="flex items-center gap-2 p-2 rounded-sm bg-surface border border-border group">
            {editId === s.id ? (
              <>
                <input autoFocus className={`${inp} flex-1`} value={editName} onChange={e => setEditName(e.target.value)}
                  onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditId(null) }} />
                <span className="font-mono text-[9px] text-muted-foreground w-16 text-right shrink-0">{s.id}</span>
                <input className={`${inp} w-16 text-right`} value={editMax} onChange={e => setEditMax(e.target.value)}
                  type="number" onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit() }} />
              </>
            ) : (
              <>
                <span className="flex-1 font-mono text-[11px] text-text cursor-pointer hover:text-primary" onClick={() => startEdit(s)}>{s.name}</span>
                <span className="font-mono text-[9px] text-muted-foreground w-16 text-right shrink-0">{s.id}</span>
                <span className="font-mono text-[10px] text-muted-foreground w-16 text-right shrink-0">${s.max.toLocaleString()}</span>
              </>
            )}
            <button onClick={() => remove(s.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all">×</button>
          </div>
        ))}

        <div className="pt-2 space-y-2 border-t border-border mt-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Add stream</div>
          <div className="grid grid-cols-3 gap-2">
            <input className={inp} placeholder="id (e.g. freelance)" value={newId} onChange={e => setNewId(e.target.value)} />
            <input className={inp} placeholder="Name *" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') add() }} />
            <input className={inp} placeholder="Max ($)" value={newMax} onChange={e => setNewMax(e.target.value)} type="number" />
          </div>
          <button onClick={add} disabled={!newId.trim() || !newName.trim()} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Add Stream</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => { onSaveConfig({ incomeStreams: null }) }} disabled={saving}
          className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
