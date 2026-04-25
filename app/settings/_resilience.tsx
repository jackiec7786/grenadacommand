"use client"

import { useState } from 'react'
import type { MergedConfig, ConfigResilienceItem } from '@/lib/config'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent'

const CATEGORIES = ['Platform', 'Suppliers', 'Logistics', 'Banking', 'Emergency', 'Insurance', 'Platforms', 'SpiceClass']

export function ResilienceTab({ config, onSaveConfig }: Props) {
  const [items, setItems] = useState<ConfigResilienceItem[]>(() => config.resilienceItems.map(i => ({ ...i })))
  const [editId, setEditId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editIdeal, setEditIdeal] = useState('')
  const [editCat, setEditCat] = useState('')
  const [newText, setNewText] = useState('')
  const [newIdeal, setNewIdeal] = useState('')
  const [newCat, setNewCat] = useState('Platform')
  const [saving, setSaving] = useState(false)

  const startEdit = (item: ConfigResilienceItem) => {
    setEditId(item.id); setEditText(item.text); setEditIdeal(item.ideal); setEditCat(item.category)
  }

  const commitEdit = () => {
    if (editId && editText.trim()) {
      setItems(prev => prev.map(i => i.id === editId
        ? { ...i, text: editText.trim(), ideal: editIdeal.trim(), category: editCat || i.category } : i))
    }
    setEditId(null)
  }

  const remove = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const add = () => {
    if (!newText.trim()) return
    const id = `res_${Date.now()}`
    setItems(prev => [...prev, { id, category: newCat, text: newText.trim(), ideal: newIdeal.trim() }])
    setNewText(''); setNewIdeal('')
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ resilienceItems: items })
    setSaving(false)
  }

  const grouped = CATEGORIES.filter(cat => items.some(i => i.category === cat))
  const ungrouped = [...new Set(items.map(i => i.category))].filter(c => !CATEGORIES.includes(c))
  const allCats = [...grouped, ...ungrouped]

  return (
    <div className="space-y-4">
      <div className="bg-surface2 border border-border rounded-md p-4 space-y-4">
        {allCats.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          return (
            <div key={cat}>
              <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-muted-foreground mb-2">{cat}</div>
              <div className="space-y-1.5">
                {catItems.map(item => (
                  <div key={item.id} className="flex items-start gap-2 p-2 rounded-sm bg-surface border border-border group">
                    {editId === item.id ? (
                      <div className="flex-1 space-y-1.5">
                        <div className="flex gap-2">
                          <select className={`${inp} w-28`} value={editCat} onChange={e => setEditCat(e.target.value)}>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <input autoFocus className={`${inp} flex-1`} value={editText} onChange={e => setEditText(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') commitEdit(); if (e.key === 'Escape') setEditId(null) }} />
                        </div>
                        <input className={`${inp} w-full`} placeholder="Ideal state..." value={editIdeal} onChange={e => setEditIdeal(e.target.value)}
                          onBlur={commitEdit} onKeyDown={e => { if (e.key === 'Enter') commitEdit() }} />
                      </div>
                    ) : (
                      <div className="flex-1 cursor-pointer" onClick={() => startEdit(item)}>
                        <span className="font-mono text-[11px] text-text hover:text-primary block">{item.text}</span>
                        {item.ideal && <span className="font-mono text-[9px] text-muted-foreground">Ideal: {item.ideal}</span>}
                      </div>
                    )}
                    <button onClick={() => remove(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all shrink-0 mt-0.5">×</button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="pt-2 space-y-2 border-t border-border">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Add item</div>
          <div className="flex gap-2">
            <select className={`${inp} w-28`} value={newCat} onChange={e => setNewCat(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input className={`${inp} flex-1`} placeholder="Item text *" value={newText} onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') add() }} />
          </div>
          <div className="flex gap-2">
            <input className={`${inp} flex-1`} placeholder="Ideal state (optional)" value={newIdeal} onChange={e => setNewIdeal(e.target.value)} />
            <button onClick={add} disabled={!newText.trim()} className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Add</button>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => onSaveConfig({ resilienceItems: null })} disabled={saving}
          className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
