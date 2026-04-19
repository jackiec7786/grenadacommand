"use client"

import { useState } from 'react'
import { Wifi, Plus, Trash2 } from 'lucide-react'

interface SpeedEntry {
  id: string
  date: string
  download: number
  upload: number
  connection: 'wired' | 'wifi' | 'hotspot'
  notes: string
}

interface InternetLogProps {
  speedLog: SpeedEntry[]
  onAdd: (entry: SpeedEntry) => void
  onRemove: (id: string) => void
}

export function InternetLog({ speedLog, onAdd, onRemove }: InternetLogProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    download: '', upload: '', connection: 'wired' as SpeedEntry['connection'], notes: '',
  })

  const today = new Date().toISOString().slice(0, 10)

  const handleAdd = () => {
    const dl = parseFloat(form.download)
    if (!dl) return
    onAdd({
      id: `spd-${Date.now()}`,
      date: today,
      download: dl,
      upload: parseFloat(form.upload) || 0,
      connection: form.connection,
      notes: form.notes,
    })
    setForm({ download: '', upload: '', connection: 'wired', notes: '' })
    setShowForm(false)
  }

  const sorted = [...speedLog].sort((a, b) => b.date.localeCompare(a.date))
  const recent = sorted.slice(0, 8)
  const latestEntry = sorted[0]
  const avgDownload = recent.length > 0 ? Math.round(recent.reduce((s, e) => s + e.download, 0) / recent.length) : 0
  const minDownload = recent.length > 0 ? Math.min(...recent.map(e => e.download)) : 0

  const getSpeedColor = (mbps: number) => {
    if (mbps >= 50) return 'var(--accent)'
    if (mbps >= 25) return 'var(--accent2)'
    if (mbps >= 10) return 'var(--warn)'
    return 'var(--danger)'
  }

  const getSpeedLabel = (mbps: number) => {
    if (mbps >= 50) return 'Excellent'
    if (mbps >= 25) return 'Good — call centre OK'
    if (mbps >= 10) return 'Marginal — monitor'
    return 'Too slow — fix now'
  }

  const hasIssue = minDownload > 0 && minDownload < 25

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: latestEntry ? getSpeedColor(latestEntry.download) : 'var(--muted)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Internet Speed Log</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{speedLog.length} entries · 25+ Mbps required</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all uppercase"
          style={showForm ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)' } : { borderColor: 'var(--accent2)', color: 'var(--accent2)' }}
        >
          <Plus className="w-3 h-3" /> Log Speed
        </button>
      </div>

      {/* Current status */}
      {latestEntry && (
        <div
          className="p-3 rounded-md border mb-4"
          style={{ borderColor: getSpeedColor(latestEntry.download) + '40', background: getSpeedColor(latestEntry.download) + '08' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[28px] font-extrabold leading-none" style={{ color: getSpeedColor(latestEntry.download) }}>
                {latestEntry.download} Mbps
              </div>
              <div className="font-mono text-[10px] mt-1" style={{ color: getSpeedColor(latestEntry.download) }}>
                {getSpeedLabel(latestEntry.download)}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                {latestEntry.date} · {latestEntry.connection} · ↑{latestEntry.upload} Mbps
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[12px] text-muted-foreground">7-day avg</div>
              <div className="font-mono text-[18px] font-bold" style={{ color: getSpeedColor(avgDownload) }}>{avgDownload} Mbps</div>
              <div className="font-mono text-[10px] text-muted-foreground">min {minDownload} Mbps</div>
            </div>
          </div>
        </div>
      )}

      {hasIssue && (
        <div className="mb-4 p-2.5 rounded-sm border text-[11px] font-mono" style={{ borderColor: 'var(--danger)40', color: 'var(--danger)', background: 'var(--danger)08' }}>
          ⚠ Speed dropped below 25 Mbps. Call Flow or Digicel support. This will affect call centre work.
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border bg-surface2 space-y-2" style={{ borderColor: 'var(--accent2)30' }}>
          <div className="text-[9px] font-mono text-muted-foreground mb-1">
            Run test at fast.com, then enter results below.
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] font-mono text-muted-foreground mb-1">Download (Mbps) *</div>
              <input type="number" className="w-full bg-surface border border-border text-text font-mono text-sm p-2 rounded-sm focus:outline-none" value={form.download} placeholder="e.g. 45" min={0} onChange={e => setForm(f => ({ ...f, download: e.target.value }))} />
            </div>
            <div>
              <div className="text-[9px] font-mono text-muted-foreground mb-1">Upload (Mbps)</div>
              <input type="number" className="w-full bg-surface border border-border text-text font-mono text-sm p-2 rounded-sm focus:outline-none" value={form.upload} placeholder="e.g. 15" min={0} onChange={e => setForm(f => ({ ...f, upload: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-1.5">
            {(['wired', 'wifi', 'hotspot'] as const).map(c => (
              <button key={c} onClick={() => setForm(f => ({ ...f, connection: c }))} className="flex-1 text-[10px] font-mono py-1.5 rounded-sm border cursor-pointer transition-all capitalize" style={form.connection === c ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)' } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
                {c}
              </button>
            ))}
          </div>
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none" placeholder="Notes (e.g. after ISP visit, during rain)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.download} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: 'var(--accent2)', color: 'var(--bg)' }}>Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}

      {/* Speed history */}
      {recent.length > 1 && (
        <div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Speed History</div>
          <div className="flex items-end gap-1.5 h-12 mb-2">
            {recent.slice().reverse().map(entry => {
              const pct = Math.min(100, (entry.download / 100) * 100)
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-0.5" title={`${entry.date}: ${entry.download} Mbps`}>
                  <div className="text-[7px] font-mono" style={{ color: getSpeedColor(entry.download) }}>{entry.download}</div>
                  <div className="w-full bg-dim rounded-sm overflow-hidden" style={{ height: '28px' }}>
                    <div className="w-full rounded-sm" style={{ height: `${pct}%`, marginTop: `${100 - pct}%`, background: getSpeedColor(entry.download) }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
            {sorted.slice(0, 5).map(entry => (
              <div key={entry.id} className="flex items-center gap-2 group">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: getSpeedColor(entry.download) }} />
                <span className="font-mono text-[10px] text-muted-foreground w-20 shrink-0">{entry.date}</span>
                <span className="font-mono text-[11px] font-bold" style={{ color: getSpeedColor(entry.download) }}>{entry.download} Mbps</span>
                <span className="font-mono text-[9px] text-muted-foreground capitalize">{entry.connection}</span>
                {entry.notes && <span className="font-mono text-[9px] text-muted-foreground truncate flex-1">{entry.notes}</span>}
                <button onClick={() => onRemove(entry.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-danger cursor-pointer ml-auto">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {speedLog.length === 0 && !showForm && (
        <div className="text-center py-5 text-[11px] font-mono text-muted-foreground">
          Test weekly at fast.com. Log here. 25+ Mbps required for call centre work.
        </div>
      )}
    </div>
  )
}
