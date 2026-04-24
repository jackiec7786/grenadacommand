"use client"

import { useState } from 'react'

type QuickExpense = { amount: number; description: string; category: string; date: string; isRecurring: boolean }

interface RunwaySectionProps {
  cash: number
  onCashChange: (value: number) => void
  monthlyIncome: number
  onAddExpense?: (expense: QuickExpense) => void
}

export function RunwaySection({ cash, onCashChange, monthlyIncome, onAddExpense }: RunwaySectionProps) {
  const monthly = 1300
  const weeks = cash > 0 ? Math.floor((cash / monthly) * 4.33) : 0
  const months = cash > 0 ? (cash / monthly).toFixed(1) : '0'
  const pct = Math.min(100, (weeks / 26) * 100)

  const runwayColor = weeks < 4 ? 'var(--danger)' : weeks < 8 ? 'var(--warn)' : 'var(--accent)'

  const [showExp, setShowExp] = useState(false)
  const [expAmount, setExpAmount] = useState('')
  const [expDesc, setExpDesc] = useState('')

  const submitExpense = () => {
    if (!expAmount || !onAddExpense) return
    onAddExpense({ amount: parseFloat(expAmount), description: expDesc || 'Expense', category: 'Other', date: new Date().toISOString().slice(0, 10), isRecurring: false })
    setExpAmount('')
    setExpDesc('')
    setShowExp(false)
  }

  const inp = 'bg-dim border border-border text-text font-mono text-[12px] px-2 py-1.5 rounded-sm focus:outline-none focus:border-primary min-h-[40px]'

  return (
    <div className="bg-surface border border-border rounded border-l-[3px] p-4 px-5 mb-7" style={{ borderLeftColor: runwayColor }}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase" style={{ color: runwayColor }}>// Cash Runway</span>
        <div className="flex items-center gap-2">
          {onAddExpense && (
            <button onClick={() => setShowExp(p => !p)}
              className="text-[10px] font-mono px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all min-h-[36px]"
              style={showExp ? { background: 'var(--danger)', color: 'var(--bg)', borderColor: 'var(--danger)' } : { borderColor: 'var(--danger)', color: 'var(--danger)' }}>
              {showExp ? '✕' : '− Expense'}
            </button>
          )}
          <label className="text-[11px] text-muted-foreground font-mono">Cash $</label>
          <input type="number" className="bg-dim border border-border text-text font-mono text-[13px] px-2 py-1 rounded-sm w-[90px] text-right focus:outline-none focus:border-primary min-h-[36px]"
            placeholder="0" min={0} value={cash || ''}
            onChange={e => onCashChange(parseFloat(e.target.value) || 0)} />
        </div>
      </div>

      {showExp && (
        <div className="mb-3 flex gap-2 flex-wrap items-end p-3 rounded-sm bg-surface2 border border-border">
          <div className="flex flex-col gap-1 flex-1 min-w-[100px]">
            <label className="text-[9px] font-mono text-muted-foreground uppercase">Amount $</label>
            <input type="number" className={`${inp} w-full`} placeholder="0.00" value={expAmount} onChange={e => setExpAmount(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitExpense()} autoFocus />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[120px]">
            <label className="text-[9px] font-mono text-muted-foreground uppercase">Description</label>
            <input className={`${inp} w-full`} placeholder="e.g. Groceries" value={expDesc} onChange={e => setExpDesc(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submitExpense()} />
          </div>
          <button onClick={submitExpense} disabled={!expAmount}
            className="font-mono text-[10px] uppercase px-3 py-2 rounded-sm cursor-pointer disabled:opacity-40 min-h-[40px]"
            style={{ background: 'var(--danger)', color: 'var(--bg)' }}>
            Log
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-x-8 gap-y-2 mb-3">
        <div>
          <div className="text-[22px] font-bold font-mono" style={{ color: runwayColor }}>{weeks || '—'}</div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">Weeks left</div>
        </div>
        <div>
          <div className="text-[22px] font-bold font-mono" style={{ color: runwayColor }}>{weeks ? months : '—'}</div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">Months left</div>
        </div>
        <div>
          <div className="text-[22px] font-bold font-mono" style={{ color: runwayColor }}>${monthlyIncome.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">Earned this month</div>
        </div>
        <div>
          <div className="text-[22px] font-bold font-mono text-muted-foreground">${monthly.toLocaleString()}</div>
          <div className="text-[10px] text-muted-foreground font-mono tracking-[0.1em] uppercase">Monthly costs</div>
        </div>
      </div>

      <div className="bg-dim h-1.5 rounded-sm overflow-hidden">
        <div className="h-full rounded-sm transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, var(--danger), ${runwayColor})` }} />
      </div>
    </div>
  )
}
