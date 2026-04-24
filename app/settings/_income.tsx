"use client"

import { useState } from 'react'
import { INCOME_STREAMS } from '@/lib/data'
import { EditableList } from '@/components/editable-list'

interface Source { id: string; name: string; max: number }

interface Props {
  currency: 'USD' | 'XCD'
  monthlyGoal: number
  customSources: Source[] | null
  onSave: (data: { currency?: 'USD' | 'XCD'; monthlyGoal?: number; customIncomeSources?: Source[] | null }) => Promise<void>
}

export function IncomeTab({ currency, monthlyGoal, customSources, onSave }: Props) {
  const [localCurrency, setLocalCurrency] = useState(currency)
  const [goal, setGoal] = useState(monthlyGoal)
  const [saving, setSaving] = useState(false)
  const [sources, setSources] = useState<Source[]>(customSources ?? INCOME_STREAMS.map(s => ({ ...s })))
  const [useCustom, setUseCustom] = useState(!!customSources)

  const inp = 'bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent'

  const handleSave = async () => {
    setSaving(true)
    await onSave({
      currency: localCurrency,
      monthlyGoal: goal,
      customIncomeSources: useCustom ? sources : null,
    })
    setSaving(false)
  }

  const sourceNames = sources.map(s => s.name)

  const handleRename = (i: number, name: string) => {
    setSources(prev => prev.map((s, idx) => idx === i ? { ...s, name } : s))
  }
  const handleRemove = (i: number) => {
    setSources(prev => prev.filter((_, idx) => idx !== i))
  }
  const handleAdd = (name: string) => {
    setSources(prev => [...prev, { id: `custom_${Date.now()}`, name, max: 1000 }])
  }

  return (
    <div className="space-y-5">
      <div className="bg-surface2 border border-border rounded-md p-4 space-y-4">
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Goals & Currency</div>

        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-2">Monthly income goal</label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] text-muted-foreground">$</span>
            <input type="number" className={`${inp} w-32`} value={goal} min={0} onChange={e => setGoal(Number(e.target.value) || 0)} />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-2">Currency</label>
          <div className="flex gap-2">
            {(['USD', 'XCD'] as const).map(c => (
              <button key={c} onClick={() => setLocalCurrency(c)} className="px-3 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer border transition-all"
                style={localCurrency === c ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-surface2 border border-border rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Income Sources</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-[10px] font-mono text-muted-foreground">Customize</span>
            <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="cursor-pointer" />
          </label>
        </div>
        {useCustom ? (
          <>
            <p className="text-[10px] font-mono text-muted-foreground">Click a name to rename it. Changes affect the income tracker display.</p>
            <EditableList items={sourceNames} onAdd={handleAdd} onRemove={handleRemove} onRename={handleRename} placeholder="New source name..." />
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
                {saving ? 'Saving...' : 'Save Sources'}
              </button>
              <button onClick={() => { setSources(INCOME_STREAMS.map(s => ({ ...s }))); setUseCustom(false) }} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
                Reset to Defaults
              </button>
            </div>
          </>
        ) : (
          <p className="text-[10px] font-mono text-muted-foreground">Using default income sources. Enable customize to rename, add, or remove.</p>
        )}
      </div>
    </div>
  )
}
