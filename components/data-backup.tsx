"use client"

import { useState } from 'react'
import { type AppState } from '@/lib/data'

interface DataBackupProps {
  state: AppState
  onImport: (state: AppState) => void
}

export function DataBackup({ state, onImport }: DataBackupProps) {
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState(false)

  const handleExport = () => {
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
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

    const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
    if (file.size > MAX_SIZE_BYTES) {
      setImportError('File too large. Maximum backup size is 5 MB.')
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string)
        if (
          typeof parsed !== 'object' || parsed === null || Array.isArray(parsed) ||
          typeof parsed.currentPhase !== 'number' ||
          typeof parsed.income !== 'object' || parsed.income === null ||
          typeof parsed.milestones !== 'object' || parsed.milestones === null ||
          typeof parsed.tasks !== 'object' || parsed.tasks === null ||
          !Array.isArray(parsed.mood)
        ) {
          setImportError('Invalid backup file. Make sure you are importing a Grenada Command Center backup.')
          return
        }
        onImport(parsed)
        setImportError('')
        setImportSuccess(true)
        setTimeout(() => setImportSuccess(false), 3000)
      } catch {
        setImportError('Could not read file. Make sure it is a valid JSON backup.')
      }
    }
    reader.readAsText(file)
    // Reset input so same file can be re-imported
    e.target.value = ''
  }

  const dataSize = Math.round(JSON.stringify(state).length / 1024 * 10) / 10

  return (
    <div className="bg-surface border border-border rounded-md p-5 border-t-2 border-t-muted-foreground">
      <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase mb-4">
        // Data Backup & Restore
      </div>

      <div className="text-[11px] font-mono text-muted-foreground mb-4 leading-relaxed">
        All data lives in your browser. Export a backup before clearing cache, switching devices, or installing a new browser.
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-4 p-3 bg-surface2 rounded-sm border border-border">
        <div>
          <div className="font-mono text-[15px] font-bold text-text">{dataSize} KB</div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Data size</div>
        </div>
        <div>
          <div className="font-mono text-[15px] font-bold text-text">
            {Object.values(state.milestones).filter(Boolean).length}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Milestones done</div>
        </div>
        <div>
          <div className="font-mono text-[15px] font-bold text-text">
            {state.mood.length}
          </div>
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em]">Mood logs</div>
        </div>
      </div>

      {/* Export */}
      <button
        onClick={handleExport}
        className="w-full py-2.5 mb-3 rounded-sm border border-accent2 text-accent2 font-mono text-[11px] tracking-[0.15em] uppercase font-semibold cursor-pointer hover:bg-accent2/10 transition-all"
      >
        ↓ Export Backup JSON
      </button>

      {/* Import */}
      <label className="w-full py-2.5 rounded-sm border border-border text-muted-foreground font-mono text-[11px] tracking-[0.15em] uppercase font-semibold cursor-pointer hover:border-muted-foreground hover:text-text transition-all flex items-center justify-center">
        ↑ Import Backup JSON
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>

      {importError && (
        <div className="mt-2 text-[11px] font-mono text-danger">{importError}</div>
      )}
      {importSuccess && (
        <div className="mt-2 text-[11px] font-mono text-primary">✓ Data imported successfully</div>
      )}

      <div className="mt-3 text-[10px] font-mono text-muted-foreground">
        Tip: Export at the end of each month.
      </div>
    </div>
  )
}
