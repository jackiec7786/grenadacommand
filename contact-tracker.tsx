"use client"

import { useState } from 'react'
import { type Contact, type ContactCategory, type ContactStatus, CONTACT_CATEGORIES, CONTACT_STATUSES } from '@/lib/data'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface ContactTrackerProps {
  contacts: Contact[]
  onAdd: (contact: Contact) => void
  onUpdate: (id: string, updates: Partial<Contact>) => void
  onRemove: (id: string) => void
}

const STATUS_COLORS: Record<ContactStatus, string> = {
  'To Contact': 'var(--danger)',
  'Contacted':  'var(--warn)',
  'In Progress':'var(--accent2)',
  'Active':     'var(--accent)',
  'On Hold':    'var(--muted)',
  'Closed':     'var(--muted)',
}

const CATEGORY_ICONS: Record<ContactCategory, string> = {
  'Call Center':       '📞',
  'Upwork Client':     '💼',
  'Agency Client':     '🏨',
  'Developer':         '💻',
  'Marina / Network':  '⛵',
  'Amazon Supplier':   '📦',
  'Property Owner':    '🏠',
  'SpiceClassifieds':  '🌶',
  'Other':             '👤',
}

export function ContactTracker({ contacts, onAdd, onUpdate, onRemove }: ContactTrackerProps) {
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<ContactStatus | 'All'>('All')
  const [form, setForm] = useState({
    name: '', category: 'Call Center' as ContactCategory,
    status: 'To Contact' as ContactStatus,
    nextAction: '', notes: '', phone: '', email: '',
  })

  const todayStr = new Date().toISOString().slice(0, 10)

  const handleAdd = () => {
    if (!form.name.trim()) return
    onAdd({
      id: `ct-${Date.now()}`,
      name: form.name,
      category: form.category,
      status: form.status,
      lastContactDate: todayStr,
      nextAction: form.nextAction,
      notes: form.notes,
      phone: form.phone || undefined,
      email: form.email || undefined,
    })
    setForm({ name: '', category: 'Call Center', status: 'To Contact', nextAction: '', notes: '', phone: '', email: '' })
    setShowForm(false)
  }

  const filtered = filterStatus === 'All' ? contacts : contacts.filter(c => c.status === filterStatus)
  const sortedContacts = [...filtered].sort((a, b) => {
    const order = { 'To Contact': 0, 'Contacted': 1, 'In Progress': 2, 'Active': 3, 'On Hold': 4, 'Closed': 5 }
    return order[a.status] - order[b.status]
  })

  const actionNeeded = contacts.filter(c => c.status === 'To Contact' || c.status === 'Contacted').length

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent2)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">// Contact Tracker</div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="font-mono text-[11px] text-muted-foreground">{contacts.length} contacts</span>
            {actionNeeded > 0 && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm" style={{ background: 'var(--warn)20', color: 'var(--warn)' }}>
                {actionNeeded} need follow-up
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-mono px-3 py-1.5 rounded-sm border cursor-pointer transition-all tracking-[0.1em] uppercase"
          style={showForm
            ? { background: 'var(--accent2)', color: 'var(--bg)', borderColor: 'var(--accent2)' }
            : { borderColor: 'var(--accent2)', color: 'var(--accent2)' }
          }
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border border-accent2/30 bg-surface2 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent2"
              placeholder="Name / Company *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <select
              className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent2"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value as ContactCategory }))}
            >
              {CONTACT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent2"
              placeholder="Phone / WhatsApp"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <input
              className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent2"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <input
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent2"
            placeholder="Next action (e.g. Follow up Monday, Send rate card)"
            value={form.nextAction}
            onChange={e => setForm(f => ({ ...f, nextAction: e.target.value }))}
          />
          <textarea
            className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm resize-none h-14 focus:outline-none focus:border-accent2"
            placeholder="Notes..."
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.name.trim()} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer transition-all disabled:opacity-40" style={{ background: 'var(--accent2)', color: 'var(--bg)' }}>
              Save Contact
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground hover:border-muted-foreground transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {contacts.length > 0 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {(['All', 'To Contact', 'In Progress', 'Active'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="text-[9px] font-mono px-2 py-1 rounded-sm border cursor-pointer transition-all tracking-[0.1em]"
              style={filterStatus === s
                ? { background: s === 'All' ? 'var(--dim)' : STATUS_COLORS[s as ContactStatus], color: s === 'All' ? 'var(--text)' : 'var(--bg)', borderColor: s === 'All' ? 'var(--muted)' : STATUS_COLORS[s as ContactStatus] }
                : { borderColor: 'var(--border)', color: 'var(--muted)' }
              }
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Contact list */}
      <div className="flex flex-col gap-1.5 max-h-96 overflow-y-auto">
        {sortedContacts.map(contact => {
          const isExpanded = expandedId === contact.id
          return (
            <div key={contact.id} className="border border-border rounded-sm overflow-hidden">
              <div
                className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-surface2 transition-all"
                onClick={() => setExpandedId(isExpanded ? null : contact.id)}
              >
                <span className="text-sm shrink-0">{CATEGORY_ICONS[contact.category]}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[12px] text-text truncate">{contact.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground truncate">{contact.nextAction || contact.category}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: STATUS_COLORS[contact.status] + '20', color: STATUS_COLORS[contact.status] }}>
                    {contact.status}
                  </span>
                  {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                </div>
              </div>
              {isExpanded && (
                <div className="px-3 pb-3 pt-2 bg-surface2 border-t border-border space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Status</div>
                      <select
                        className="bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm w-full focus:outline-none"
                        value={contact.status}
                        onChange={e => onUpdate(contact.id, { status: e.target.value as ContactStatus, lastContactDate: todayStr })}
                      >
                        {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Last Contact</div>
                      <div className="font-mono text-[11px] text-text">{contact.lastContactDate}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1">Next Action</div>
                    <input
                      className="w-full bg-surface border border-border text-text font-mono text-xs p-1.5 rounded-sm focus:outline-none focus:border-accent2"
                      value={contact.nextAction}
                      onChange={e => onUpdate(contact.id, { nextAction: e.target.value })}
                    />
                  </div>
                  {contact.notes && (
                    <div>
                      <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-0.5">Notes</div>
                      <div className="text-[11px] text-text">{contact.notes}</div>
                    </div>
                  )}
                  {(contact.phone || contact.email) && (
                    <div className="flex gap-4">
                      {contact.phone && <div className="font-mono text-[10px] text-accent2">{contact.phone}</div>}
                      {contact.email && <div className="font-mono text-[10px] text-accent2">{contact.email}</div>}
                    </div>
                  )}
                  <button
                    onClick={() => { onRemove(contact.id); setExpandedId(null) }}
                    className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground hover:text-danger transition-all cursor-pointer mt-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove contact
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {contacts.length === 0 && !showForm && (
        <div className="text-center py-6 text-[11px] font-mono text-muted-foreground">
          No contacts yet. Add TTEC, your developer, Upwork clients, marina contacts.
        </div>
      )}
    </div>
  )
}
