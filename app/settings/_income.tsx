"use client"

import { useState } from 'react'

interface Props {
  currency: 'USD' | 'XCD'
  monthlyGoal: number
  onSave: (data: { currency?: 'USD' | 'XCD'; monthlyGoal?: number }) => Promise<void>
}

export function IncomeTab({ currency, monthlyGoal, onSave }: Props) {
  const [localCurrency, setLocalCurrency] = useState(currency)
  const [goal, setGoal] = useState(monthlyGoal)
  const [saving, setSaving] = useState(false)

  const inp = 'bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent'

  const handleSave = async () => {
    setSaving(true)
    await onSave({ currency: localCurrency, monthlyGoal: goal })
    setSaving(false)
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
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-2">Currency display</label>
          <div className="flex gap-2">
            {(['USD', 'XCD'] as const).map(c => (
              <button key={c} onClick={() => setLocalCurrency(c)} className="px-3 py-1.5 rounded-sm font-mono text-[10px] cursor-pointer border transition-all"
                style={localCurrency === c ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="p-3 rounded-sm border border-border bg-surface2">
        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Income Streams</div>
        <div className="text-[11px] font-mono text-muted-foreground">
          Edit stream names and max values in the <span className="text-primary">Streams</span> tab.
        </div>
      </div>
    </div>
  )
}
