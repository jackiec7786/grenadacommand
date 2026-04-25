"use client"

import { useState } from 'react'
import type { MergedConfig } from '@/lib/config'
import type { GrenadaEvent } from '@/lib/data'

interface Props {
  config: MergedConfig
  onSaveConfig: (updates: Record<string, unknown>) => Promise<void>
}

const inp = 'bg-dim border border-border text-text font-mono text-[11px] p-1.5 rounded-sm focus:outline-none focus:border-accent w-full'

const URGENCY_COLORS: Record<string, string> = {
  now: 'var(--danger)', soon: 'var(--warn)', upcoming: 'var(--accent2)', future: 'var(--muted)',
}

export function EventsTab({ config, onSaveConfig }: Props) {
  const [events, setEvents] = useState<GrenadaEvent[]>(() => config.events.map(e => ({ ...e })))
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const update = (id: string, field: keyof GrenadaEvent, value: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const remove = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const addEvent = () => {
    const id = `ev_${Date.now()}`
    const blank: GrenadaEvent = {
      id, name: 'New Event', dates: '', confirmedDates: new Date().toISOString().slice(0, 10),
      audience: '', audienceSize: '', spiceAction: '', revenueModel: '', realisticRevenue: '',
      urgency: 'upcoming', category: 'culture',
    }
    setEvents(prev => [...prev, blank])
    setExpandedId(id)
  }

  const handleSave = async () => {
    setSaving(true)
    await onSaveConfig({ events })
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Grenada Events</div>
          <button onClick={addEvent} className="font-mono text-[9px] uppercase px-2.5 py-1 rounded-sm cursor-pointer"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>+ Add</button>
        </div>

        {events.map(ev => {
          const isOpen = expandedId === ev.id
          return (
            <div key={ev.id} className="border border-border rounded-sm overflow-hidden">
              <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-surface transition-all group"
                onClick={() => setExpandedId(isOpen ? null : ev.id)}>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-sm shrink-0"
                  style={{ background: URGENCY_COLORS[ev.urgency] + '20', color: URGENCY_COLORS[ev.urgency] }}>
                  {ev.urgency.toUpperCase()}
                </span>
                <span className="flex-1 font-mono text-[11px] text-text">{ev.name}</span>
                <span className="font-mono text-[9px] text-muted-foreground shrink-0">{ev.dates || '—'}</span>
                <button onClick={e => { e.stopPropagation(); remove(ev.id) }}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-danger font-mono text-[13px] px-1 cursor-pointer transition-all">×</button>
                <span className="font-mono text-[9px] text-muted-foreground">{isOpen ? '▼' : '▶'}</span>
              </div>

              {isOpen && (
                <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Name</label>
                      <input className={inp} value={ev.name} onChange={e => update(ev.id, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Dates</label>
                      <input className={inp} value={ev.dates} onChange={e => update(ev.id, 'dates', e.target.value)} placeholder="e.g. May 22–27, 2026" />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Confirmed Date (ISO)</label>
                      <input className={inp} value={ev.confirmedDates} onChange={e => update(ev.id, 'confirmedDates', e.target.value)} placeholder="YYYY-MM-DD" />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Audience Size</label>
                      <input className={inp} value={ev.audienceSize} onChange={e => update(ev.id, 'audienceSize', e.target.value)} />
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Urgency</label>
                      <select className={`${inp} cursor-pointer`} value={ev.urgency} onChange={e => update(ev.id, 'urgency', e.target.value)}>
                        {['now', 'soon', 'upcoming', 'future'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-mono text-muted-foreground uppercase">Category</label>
                      <select className={`${inp} cursor-pointer`} value={ev.category} onChange={e => update(ev.id, 'category', e.target.value)}>
                        {['festival', 'sailing', 'food', 'culture', 'business'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-muted-foreground uppercase">SpiceClassifieds Action</label>
                    <textarea className={`${inp} resize-none`} rows={2} value={ev.spiceAction} onChange={e => update(ev.id, 'spiceAction', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-muted-foreground uppercase">Realistic Revenue</label>
                    <input className={inp} value={ev.realisticRevenue} onChange={e => update(ev.id, 'realisticRevenue', e.target.value)} />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all"
          style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={() => onSaveConfig({ events: null })} disabled={saving}
          className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer border border-border text-muted-foreground">
          Reset to Defaults
        </button>
      </div>
    </div>
  )
}
