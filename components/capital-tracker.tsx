"use client"

import { useState } from 'react'
import { type CapitalEntry } from '@/lib/data'

interface CapitalTrackerProps {
  capitalHistory: CapitalEntry[]
  currentMonth: string
  cash: number
  onSave: (entry: CapitalEntry) => void
}

function getNetPosition(entry: CapitalEntry): number {
  return entry.cashBalance + entry.businessAssets + entry.platformBalances - entry.liabilities
}

export function CapitalTracker({ capitalHistory, currentMonth, cash, onSave }: CapitalTrackerProps) {
  const existing = capitalHistory.find(e => e.month === currentMonth)
  const [form, setForm] = useState({
    cashBalance: existing?.cashBalance ?? cash,
    businessAssets: existing?.businessAssets ?? 0,
    platformBalances: existing?.platformBalances ?? 0,
    liabilities: existing?.liabilities ?? 0,
    notes: existing?.notes ?? '',
  })
  const [saved, setSaved] = useState(false)

  // Sync cash input with runway
  const netNow = form.cashBalance + form.businessAssets + form.platformBalances - form.liabilities

  const handleSave = () => {
    onSave({
      id: existing?.id || `cap-${Date.now()}`,
      month: currentMonth,
      cashBalance: form.cashBalance,
      businessAssets: form.businessAssets,
      platformBalances: form.platformBalances,
      liabilities: form.liabilities,
      notes: form.notes,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // History sorted by month desc
  const sorted = [...capitalHistory].sort((a, b) => b.month.localeCompare(a.month)).slice(0, 6)
  const maxNet = Math.max(...sorted.map(getNetPosition), 1)

  function getMonthLabel(ym: string) {
    const [y, m] = ym.split('-')
    return new Date(Number(y), Number(m) - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--purple)' }}>
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">
        // Capital Position — {getMonthLabel(currentMonth)}
      </div>

      {/* Net position big number */}
      <div className="mb-4">
        <div className="flex items-end gap-2 mb-1">
          <div
            className="text-[36px] font-extrabold font-mono leading-none"
            style={{ color: netNow >= 10000 ? 'var(--accent)' : netNow >= 5000 ? 'var(--accent2)' : netNow >= 2000 ? 'var(--warn)' : 'var(--danger)' }}
          >
            ${netNow.toLocaleString()}
          </div>
          <div className="text-[11px] font-mono text-muted-foreground pb-1">net position</div>
        </div>
        <div className="h-1.5 bg-dim rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{
              width: `${Math.min(100, (netNow / 20000) * 100)}%`,
              background: netNow >= 15000 ? 'var(--accent)' : netNow >= 10000 ? 'var(--accent2)' : netNow >= 5000 ? 'var(--warn)' : 'var(--danger)',
            }}
          />
        </div>
        <div className="text-[9px] font-mono text-muted-foreground mt-1">$20,000 = FBA + TikTok fully funded</div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { key: 'cashBalance', label: 'Cash / Bank', color: 'var(--accent)' },
          { key: 'businessAssets', label: 'Business Assets', color: 'var(--accent2)' },
          { key: 'platformBalances', label: 'Platform Balances', color: 'var(--warn)' },
          { key: 'liabilities', label: 'Liabilities (−)', color: 'var(--danger)' },
        ].map(({ key, label, color }) => (
          <div key={key}>
            <div className="text-[9px] font-mono uppercase tracking-[0.1em] mb-1" style={{ color }}>{label}</div>
            <input
              type="number"
              className="w-full bg-dim border border-border font-mono text-[13px] px-2 py-1.5 rounded-sm text-right focus:outline-none focus:border-primary"
              style={{ color }}
              value={(form as any)[key] || ''}
              placeholder="0"
              min={0}
              onChange={e => setForm(f => ({ ...f, [key]: parseFloat(e.target.value) || 0 }))}
            />
          </div>
        ))}
      </div>

      <input
        className="w-full bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm mb-3 focus:outline-none focus:border-primary"
        placeholder="Notes (e.g. PO placed $3,200, inventory en route...)"
        value={form.notes}
        onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
      />

      <button
        onClick={handleSave}
        className="w-full py-2 rounded-sm font-mono text-[11px] uppercase tracking-[0.1em] cursor-pointer transition-all"
        style={saved ? { background: 'var(--accent)', color: 'var(--bg)' } : { background: 'var(--dim)', color: 'var(--text)', border: '1px solid var(--border)' }}
      >
        {saved ? '✓ Saved' : `Save ${getMonthLabel(currentMonth)} Position`}
      </button>

      {/* History chart */}
      {sorted.length > 1 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-3">Net Position History</div>
          <div className="flex items-end gap-2 h-16">
            {sorted.slice().reverse().map(entry => {
              const net = getNetPosition(entry)
              const pct = Math.max(4, (Math.max(0, net) / maxNet) * 100)
              const color = net >= 10000 ? 'var(--accent)' : net >= 5000 ? 'var(--accent2)' : net >= 2000 ? 'var(--warn)' : 'var(--danger)'
              const isCurrentMonth = entry.month === currentMonth
              return (
                <div key={entry.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="text-[8px] font-mono text-muted-foreground">${net >= 1000 ? (net / 1000).toFixed(1) + 'k' : net}</div>
                  <div className="w-full bg-dim rounded-sm" style={{ height: '36px' }}>
                    <div
                      className="w-full rounded-sm transition-all duration-500"
                      style={{ height: `${pct}%`, marginTop: `${100 - pct}%`, background: color, opacity: isCurrentMonth ? 1 : 0.5 }}
                    />
                  </div>
                  <div className="text-[8px] font-mono" style={{ color: isCurrentMonth ? color : 'var(--muted)' }}>
                    {getMonthLabel(entry.month).split(' ')[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
