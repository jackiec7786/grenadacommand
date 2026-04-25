"use client"

import { useState, useEffect, useRef } from 'react'
import type { Outage } from '@/app/api/grenada/power-outage/route'

function fmtDuration(ms: number): string {
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function PowerOutage() {
  const [outages, setOutages] = useState<Outage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [now, setNow] = useState(Date.now())
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const active = outages.find(o => o.restoredAt === null) ?? null

  useEffect(() => {
    fetch('/api/grenada/power-outage')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setOutages(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (active) {
      timer.current = setInterval(() => setNow(Date.now()), 60_000)
    }
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [active?.id])

  const startOutage = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/grenada/power-outage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' }),
      }).then(r => r.json())
      if (res?.ok) {
        setOutages(prev => [{ id: res.id, startedAt: new Date().toISOString(), restoredAt: null, notes: '' }, ...prev])
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const restoreOutage = async () => {
    if (!active) return
    setSaving(true)
    try {
      const res = await fetch('/api/grenada/power-outage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', id: active.id }),
      }).then(r => r.json())
      if (res?.ok) {
        const restoredAt = new Date().toISOString()
        setOutages(prev => prev.map(o => o.id === active.id ? { ...o, restoredAt } : o))
      }
    } catch { /* ignore */ }
    setSaving(false)
  }

  const remove = async (id: string) => {
    await fetch('/api/grenada/power-outage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    }).catch(() => {})
    setOutages(prev => prev.filter(o => o.id !== id))
  }

  const elapsedMs = active ? now - new Date(active.startedAt).getTime() : 0
  const accentColor = active ? 'var(--danger)' : 'var(--warn)'

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: accentColor }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Power Outages</div>
        <span className="text-[9px] font-mono" style={{ color: active ? 'var(--danger)' : 'var(--accent)' }}>
          {active ? `● OUT ${fmtDuration(elapsedMs)}` : '● Power OK'}
        </span>
      </div>

      <button
        onClick={active ? restoreOutage : startOutage}
        disabled={saving || loading}
        className="w-full py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] font-semibold cursor-pointer transition-all disabled:opacity-40 mb-4"
        style={{ background: active ? 'var(--accent)' : 'var(--danger)', color: 'var(--bg)' }}
      >
        {saving ? '...' : active ? 'Mark Power Restored' : 'Log Outage Start'}
      </button>

      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-2">History</div>

      {loading ? (
        <div className="animate-pulse space-y-1.5">
          {[1, 2, 3].map(i => <div key={i} className="h-6 bg-dim rounded" />)}
        </div>
      ) : outages.length === 0 ? (
        <div className="font-mono text-[11px] text-muted-foreground">No outages logged.</div>
      ) : (
        <div className="space-y-1.5 max-h-44 overflow-y-auto">
          {outages.map(o => {
            const dur = o.restoredAt
              ? fmtDuration(new Date(o.restoredAt).getTime() - new Date(o.startedAt).getTime())
              : `${fmtDuration(now - new Date(o.startedAt).getTime())} (ongoing)`
            return (
              <div key={o.id} className="flex items-center gap-2 group">
                <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">
                  {new Date(o.startedAt).toLocaleDateString()}
                </span>
                <span
                  className="font-mono text-[11px] font-semibold flex-1"
                  style={{ color: o.restoredAt ? 'var(--text)' : 'var(--danger)' }}
                >
                  {dur}
                </span>
                <button
                  onClick={() => remove(o.id)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all shrink-0"
                >×</button>
              </div>
            )
          })}
        </div>
      )}

      {outages.filter(o => o.restoredAt).length > 1 && (
        <div className="border-t border-border pt-2 mt-2 grid grid-cols-2 gap-2">
          <div>
            <div className="font-mono text-[10px] text-muted-foreground">Total outages</div>
            <div className="font-mono text-[13px] font-semibold text-text">{outages.length}</div>
          </div>
          <div>
            <div className="font-mono text-[10px] text-muted-foreground">Avg duration</div>
            <div className="font-mono text-[13px] font-semibold text-text">
              {fmtDuration(
                outages.filter(o => o.restoredAt).reduce((acc, o) =>
                  acc + (new Date(o.restoredAt!).getTime() - new Date(o.startedAt).getTime()), 0
                ) / outages.filter(o => o.restoredAt).length
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
