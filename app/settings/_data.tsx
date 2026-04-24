"use client"

import { useState, useRef } from 'react'
import { DEFAULT_STATE } from '@/lib/data'

export function DataTab() {
  const [importMsg, setImportMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [clearing, setClearing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    const res = await fetch('/api/export')
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grenada-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setImportMsg({ text: 'File too large (max 5 MB).', ok: false }); return }

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        const data = parsed.state ?? parsed // support both raw state and wrapped export
        if (typeof data !== 'object' || !data?.currentPhase) {
          setImportMsg({ text: 'Invalid backup file.', ok: false }); return
        }
        const res = await fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        setImportMsg(res.ok ? { text: '✓ Data imported. Reload the dashboard to see changes.', ok: true } : { text: 'Import failed.', ok: false })
      } catch {
        setImportMsg({ text: 'Could not parse file.', ok: false })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClear = async () => {
    if (!confirm('Clear all data? This cannot be undone.')) return
    setClearing(true)
    await fetch('/api/state', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(DEFAULT_STATE) })
    setClearing(false)
    setImportMsg({ text: '✓ All data cleared.', ok: true })
  }

  const btn = 'w-full py-2.5 rounded-sm font-mono text-[11px] tracking-[0.1em] uppercase font-semibold cursor-pointer transition-all'

  return (
    <div className="space-y-4">
      <div className="bg-surface2 border border-border rounded-md p-4 space-y-3">
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Backup & Restore</div>
        <p className="text-[11px] font-mono text-muted-foreground leading-relaxed">
          Export includes your full dashboard state. Import will overwrite existing data. Recommend exporting monthly.
        </p>

        <button onClick={handleExport} className={`${btn} border border-accent2 text-accent2 hover:bg-accent2/10`}>
          ↓ Export Backup JSON
        </button>

        <label className={`${btn} border border-border text-muted-foreground hover:border-muted-foreground hover:text-text flex items-center justify-center`}>
          ↑ Import Backup JSON
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </label>

        {importMsg && (
          <div className={`text-[11px] font-mono ${importMsg.ok ? 'text-primary' : 'text-danger'}`}>{importMsg.text}</div>
        )}
      </div>

      <div className="bg-surface2 border border-danger/20 rounded-md p-4 space-y-3">
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Danger Zone</div>
        <p className="text-[11px] font-mono text-muted-foreground">Resets all dashboard data to defaults. Settings are not affected.</p>
        <button onClick={handleClear} disabled={clearing} className={`${btn} border border-danger text-danger hover:bg-danger/10 disabled:opacity-40`}>
          {clearing ? 'Clearing...' : '✕ Clear All Data'}
        </button>
      </div>
    </div>
  )
}
