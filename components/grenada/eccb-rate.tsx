"use client"

import { useState, useEffect } from 'react'
import type { RateEntry } from '@/app/api/grenada/eccb-rate/route'

const OFFICIAL_RATE = 2.70
const inp = 'bg-dim border border-border text-text font-mono text-xs px-2 py-1.5 rounded-sm focus:outline-none focus:border-accent'

export function EccbRate() {
  const [entries, setEntries] = useState<RateEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [usd, setUsd] = useState('')
  const [showLog, setShowLog] = useState(false)
  const [rate, setRate] = useState('')
  const [source, setSource] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/grenada/eccb-rate')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setEntries(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const xcd = usd && !isNaN(parseFloat(usd))
    ? (parseFloat(usd) * OFFICIAL_RATE).toFixed(2)
    : ''

  const logRate = async () => {
    const n = parseFloat(rate)
    if (!n || n < 1 || n > 10) return
    setSaving(true)
    try {
      const res = await fetch('/api/grenada/eccb-rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: n, source: source.trim() || 'Unknown' }),
      }).then(r => r.json())
      if (res?.ok) {
        setEntries(prev => [{ id: res.id, date: new Date().toISOString(), rate: n, source: source.trim() || 'Unknown', notes: '' }, ...prev])
        setRate('')
        setSource('')
        setShowLog(false)
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const remove = async (id: string) => {
    await fetch('/api/grenada/eccb-rate', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// USD / XCD Rate</div>
        <span className="text-[9px] font-mono text-primary">● ECCB Peg</span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-mono text-[32px] font-extrabold text-text leading-none">2.70</span>
        <span className="font-mono text-[13px] text-muted-foreground">XCD per USD</span>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className={`${inp} flex-1`}
          type="number"
          placeholder="USD amount"
          value={usd}
          onChange={e => setUsd(e.target.value)}
        />
        <div className="flex items-center px-2 font-mono text-[11px] text-muted-foreground">=</div>
        <input
          className={`${inp} flex-1`}
          readOnly
          value={xcd ? `${xcd} XCD` : ''}
          placeholder="XCD"
        />
      </div>

      <div className="border-t border-border pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em]">Exchange Log</div>
          <button
            onClick={() => setShowLog(p => !p)}
            className="text-[9px] font-mono text-muted-foreground hover:text-text cursor-pointer transition-all"
          >
            {showLog ? 'Cancel' : '+ Log Rate'}
          </button>
        </div>

        {showLog && (
          <div className="flex gap-2 mb-3">
            <input
              className={`${inp} w-20`}
              type="number"
              step="0.001"
              placeholder="Rate"
              value={rate}
              onChange={e => setRate(e.target.value)}
              autoFocus
            />
            <input
              className={`${inp} flex-1`}
              placeholder="Source (e.g. Scotiabank)"
              value={source}
              onChange={e => setSource(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && logRate()}
            />
            <button
              onClick={logRate}
              disabled={!rate.trim() || saving}
              className="font-mono text-[10px] uppercase px-3 py-1.5 rounded-sm cursor-pointer disabled:opacity-40"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {saving ? '...' : 'Add'}
            </button>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-1.5">
            {[1, 2].map(i => <div key={i} className="h-6 bg-dim rounded" />)}
          </div>
        ) : entries.length === 0 ? (
          <div className="font-mono text-[11px] text-muted-foreground">No rates logged yet.</div>
        ) : (
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {entries.slice(0, 8).map(e => (
              <div key={e.id} className="flex items-center gap-2 group">
                <span className="font-mono text-[12px] font-semibold text-text w-14 shrink-0">{e.rate.toFixed(3)}</span>
                <span className="font-mono text-[10px] text-muted-foreground flex-1 truncate">{e.source} · {new Date(e.date).toLocaleDateString()}</span>
                <button
                  onClick={() => remove(e.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all shrink-0"
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
