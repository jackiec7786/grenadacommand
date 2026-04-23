"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { JobApplication } from '@/app/api/job-applications/route'

const PLATFORMS = ['Upwork', 'Cambly', 'TTEC', 'Transcom', 'OutPlex', 'LinkedIn', 'Direct', 'Other']
const STATUSES = ['applied', 'interview', 'hired', 'rejected'] as const

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  applied:   { color: 'var(--muted)',  bg: 'var(--dim)' },
  interview: { color: 'var(--warn)',   bg: 'var(--warn)20' },
  hired:     { color: 'var(--accent)', bg: 'var(--accent)20' },
  rejected:  { color: 'var(--danger)', bg: 'var(--danger)20' },
}

const EMPTY_FORM = { company: '', role: '', platform: 'Upwork', dateApplied: new Date().toISOString().slice(0, 10), status: 'applied' as const, notes: '', followUpDate: '' }

export function JobApplicationTracker() {
  const [apps, setApps] = useState<JobApplication[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const f = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  useEffect(() => {
    fetch('/api/job-applications').then(r => r.json()).then(d => { if (Array.isArray(d)) setApps(d) }).catch(() => {})
  }, [])

  const handleAdd = async () => {
    if (!form.company.trim() || !form.role.trim()) return
    const tempId = `temp-${Date.now()}`
    const optimistic = { ...form, id: tempId }
    setApps(p => [optimistic, ...p])
    setForm(EMPTY_FORM)
    setShowForm(false)
    const res = await fetch('/api/job-applications', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }).catch(() => null)
    if (res?.ok) {
      const { id } = await res.json()
      setApps(p => p.map(a => a.id === tempId ? { ...a, id } : a))
    }
  }

  const updateStatus = (id: string, status: JobApplication['status']) => {
    setApps(p => p.map(a => a.id === id ? { ...a, status } : a))
    fetch(`/api/job-applications/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) }).catch(() => {})
  }

  const remove = (id: string) => {
    setApps(p => p.filter(a => a.id !== id))
    fetch(`/api/job-applications/${id}`, { method: 'DELETE' }).catch(() => {})
  }

  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {} as Record<string, number>)
  const input = 'bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent w-full'

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Job Applications</div>
          <div className="flex gap-3 mt-1">
            {STATUSES.map(s => counts[s] > 0 && (
              <span key={s} className="font-mono text-[9px]" style={{ color: STATUS_STYLES[s].color }}>{counts[s]} {s}</span>
            ))}
          </div>
        </div>
        <button onClick={() => setShowForm(p => !p)} className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all" style={showForm ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--accent)', color: 'var(--accent)' }}>
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-3 rounded-md border space-y-2" style={{ borderColor: 'var(--accent)30', background: 'var(--surface2)' }}>
          <div className="grid grid-cols-2 gap-2">
            <input className={input} placeholder="Company *" value={form.company} onChange={f('company')} />
            <input className={input} placeholder="Role *" value={form.role} onChange={f('role')} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className={input} value={form.platform} onChange={f('platform')}>{PLATFORMS.map(p => <option key={p}>{p}</option>)}</select>
            <input type="date" className={input} value={form.dateApplied} onChange={f('dateApplied')} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <select className={input} value={form.status} onChange={f('status')}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>
            <input type="date" className={input} placeholder="Follow-up date" value={form.followUpDate} onChange={f('followUpDate')} />
          </div>
          <textarea className={input} placeholder="Notes" rows={2} value={form.notes} onChange={f('notes')} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.company || !form.role} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-1.5 max-h-64 overflow-y-auto">
        {apps.length === 0 && !showForm && <div className="text-center py-4 font-mono text-[11px] text-muted-foreground">No applications yet.</div>}
        {apps.map(a => (
          <div key={a.id} className="flex items-center gap-2 p-2.5 rounded-sm border border-border bg-surface2 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[12px] font-semibold text-text truncate">{a.company}</span>
                <span className="font-mono text-[9px] text-muted-foreground truncate">{a.role} · {a.platform}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[9px] text-muted-foreground">{a.dateApplied}</span>
                {a.followUpDate && <span className="font-mono text-[9px] text-muted-foreground">follow-up: {a.followUpDate}</span>}
                {a.notes && <span className="font-mono text-[9px] text-muted-foreground truncate">{a.notes}</span>}
              </div>
            </div>
            <select
              value={a.status}
              onChange={e => updateStatus(a.id, e.target.value as JobApplication['status'])}
              className="font-mono text-[9px] px-1.5 py-1 rounded-sm border-0 cursor-pointer"
              style={{ background: STATUS_STYLES[a.status].bg, color: STATUS_STYLES[a.status].color }}
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => remove(a.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger cursor-pointer transition-all shrink-0">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
