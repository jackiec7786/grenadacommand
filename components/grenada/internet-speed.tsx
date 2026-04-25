"use client"

import { useState, useEffect } from 'react'
import type { SpeedResult } from '@/app/api/grenada/speed-test/route'

const SLOW_MBPS = 1.0
const WARN_MBPS = 5.0

function speedColor(mbps: number): string {
  if (mbps < SLOW_MBPS) return 'var(--danger)'
  if (mbps < WARN_MBPS) return 'var(--warn)'
  return 'var(--accent2)'
}

function SpeedBar({ value, max }: { value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 bg-dim rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: speedColor(value) }}
      />
    </div>
  )
}

export function InternetSpeed() {
  const [history, setHistory] = useState<SpeedResult[]>([])
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)

  const latest = history[0] ?? null

  useEffect(() => {
    fetch('/api/grenada/speed-test')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setHistory(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const runTest = async () => {
    setTesting(true)
    try {
      // Latency: round-trip to /api/health
      const t0 = performance.now()
      await fetch('/api/health', { cache: 'no-store' })
      const latencyMs = Math.round(performance.now() - t0)

      // Download speed: fetch a 50 KB payload and time it
      const start = performance.now()
      const res = await fetch('/api/grenada/speed-test/ping', { cache: 'no-store' })
      const buf = await res.arrayBuffer()
      const elapsed = (performance.now() - start) / 1000
      const downloadMbps = parseFloat(((buf.byteLength * 8) / elapsed / 1_000_000).toFixed(2))

      const saved = await fetch('/api/grenada/speed-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadMbps, latencyMs }),
      }).then(r => r.json()).catch(() => null)

      const result: SpeedResult = {
        id: saved?.id ?? crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        downloadMbps,
        latencyMs,
      }
      setHistory(prev => [result, ...prev].slice(0, 20))
    } catch { /* ignore */ }
    setTesting(false)
  }

  const color = latest ? speedColor(latest.downloadMbps) : 'var(--muted-foreground)'
  const isSlow = latest && latest.downloadMbps < SLOW_MBPS

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Internet Speed</div>
        {latest && (
          <span className="text-[9px] font-mono" style={{ color }}>
            {isSlow ? '⚠ Slow' : '● OK'}
          </span>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-2 mb-4">
          <div className="h-8 bg-dim rounded w-32" />
          <div className="h-2 bg-dim rounded" />
        </div>
      ) : latest ? (
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-mono text-[32px] font-extrabold leading-none" style={{ color }}>
              {latest.downloadMbps}
            </span>
            <span className="font-mono text-[13px] text-muted-foreground">Mbps</span>
          </div>
          <SpeedBar value={latest.downloadMbps} max={20} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <div className="font-mono text-[10px] text-muted-foreground">Latency</div>
              <div className="font-mono text-[13px] font-semibold text-text">{latest.latencyMs} ms</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-muted-foreground">Tested</div>
              <div className="font-mono text-[13px] font-semibold text-text">
                {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-mono text-[11px] text-muted-foreground mb-4">No tests run yet.</div>
      )}

      <button
        onClick={runTest}
        disabled={testing}
        className="w-full py-2 rounded-sm font-mono text-[10px] uppercase tracking-[0.15em] cursor-pointer disabled:opacity-40 transition-all mb-3"
        style={{ background: 'var(--accent2)', color: 'var(--bg)' }}
      >
        {testing ? 'Testing...' : 'Run Speed Test'}
      </button>

      {history.length > 1 && (
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Recent</div>
          <div className="space-y-1">
            {history.slice(1, 5).map(r => (
              <div key={r.id} className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground w-16 shrink-0">
                  {new Date(r.timestamp).toLocaleDateString()}
                </span>
                <span className="font-mono text-[11px] font-semibold flex-1" style={{ color: speedColor(r.downloadMbps) }}>
                  {r.downloadMbps} Mbps
                </span>
                <span className="font-mono text-[10px] text-muted-foreground shrink-0">{r.latencyMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
