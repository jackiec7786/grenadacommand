"use client"

import { useState, useEffect } from 'react'
import { Plus, Eye, EyeOff, Copy, Trash2, Check, Shield } from 'lucide-react'
import type { Credential } from '@/lib/data'

const PLATFORM_CATEGORIES = [
  'Call Center / Jobs', 'Freelance Income', 'Business / Banking',
  'E-Commerce', 'Research / Studies', 'Hosting / Tools', 'Other',
]

const QUICK_PLATFORMS = [
  { name: 'TTEC',           category: 'Call Center / Jobs',  url: 'ttec.com' },
  { name: 'Transcom',       category: 'Call Center / Jobs',  url: 'transcom.com' },
  { name: 'OutPlex',        category: 'Call Center / Jobs',  url: 'outplex.com' },
  { name: 'Cambly',         category: 'Freelance Income',    url: 'cambly.com' },
  { name: 'Upwork',         category: 'Freelance Income',    url: 'upwork.com' },
  { name: 'Respondent.io',  category: 'Research / Studies',  url: 'respondent.io' },
  { name: 'UserTesting',    category: 'Research / Studies',  url: 'usertesting.com' },
  { name: 'Mercury Bank',   category: 'Business / Banking',  url: 'mercury.com' },
  { name: 'Wise',           category: 'Business / Banking',  url: 'wise.com' },
  { name: 'Amazon Seller',  category: 'E-Commerce',          url: 'sellercentral.amazon.com' },
  { name: 'Etsy',           category: 'E-Commerce',          url: 'etsy.com' },
  { name: 'Helium10',       category: 'E-Commerce',          url: 'helium10.com' },
]

export function CredentialsVault() {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [showForm, setShowForm] = useState(false)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState('All')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const [form, setForm] = useState({
    platform: '', category: 'Call Center / Jobs', username: '',
    email: '', password: '', accountNumber: '', notes: '', url: '',
  })

  useEffect(() => {
    fetch('/api/credentials')
      .then(r => r.json())
      .then((data: Credential[]) => { if (Array.isArray(data)) setCredentials(data) })
      .catch(err => console.error('[credentials] load failed:', err))
  }, [])

  const handleAdd = async () => {
    if (!form.platform.trim()) return
    const tempId = `temp-${Date.now()}`
    const newCred: Credential = {
      id: tempId,
      platform: form.platform, category: form.category,
      username: form.username, email: form.email,
      password: form.password, accountNumber: form.accountNumber,
      notes: form.notes, url: form.url,
    }
    setCredentials(prev => [newCred, ...prev])
    setForm({ platform: '', category: 'Call Center / Jobs', username: '', email: '', password: '', accountNumber: '', notes: '', url: '' })
    setShowForm(false)
    try {
      const res = await fetch('/api/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCred),
      })
      if (res.ok) {
        const { id } = await res.json()
        setCredentials(prev => prev.map(c => c.id === tempId ? { ...c, id } : c))
      }
    } catch (err) {
      console.error('[credentials] save failed:', err)
    }
  }

  const handleRemove = async (id: string) => {
    setCredentials(prev => prev.filter(c => c.id !== id))
    setShowDeleteConfirm(null)
    fetch(`/api/credentials/${id}`, { method: 'DELETE' })
      .catch(err => console.error('[credentials] delete failed:', err))
  }

  const copyToClipboard = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) } catch {}
  }

  const filtered = filterCat === 'All' ? credentials : credentials.filter(c => c.category === filterCat)
  const missing = QUICK_PLATFORMS.filter(qp => !credentials.find(c => c.platform.toLowerCase().includes(qp.name.toLowerCase())))
  const categories = ['All', ...new Set(credentials.map(c => c.category))]

  return (
    <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <div>
            <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Credentials Vault</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{credentials.length} platforms stored</div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all uppercase"
          style={showForm ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Missing platforms */}
      {missing.length > 0 && (
        <div className="mb-4">
          <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-2">Not yet added ({missing.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {missing.slice(0, 8).map(p => (
              <button
                key={p.name}
                onClick={() => { setForm(f => ({ ...f, platform: p.name, category: p.category, url: p.url })); setShowForm(true) }}
                className="text-[9px] font-mono px-2 py-1 rounded-sm border border-border text-muted-foreground hover:border-accent hover:text-accent transition-all cursor-pointer"
              >
                + {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="mb-4 p-3 rounded-md border bg-surface2 space-y-2" style={{ borderColor: 'var(--accent)30' }}>
          <div className="grid grid-cols-2 gap-2">
            <input className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="Platform name *" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} />
            <select className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              {PLATFORM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <input className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="Username" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="password" className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            <input className="bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="Account / ID number" value={form.accountNumber} onChange={e => setForm(f => ({ ...f, accountNumber: e.target.value }))} />
          </div>
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="URL (e.g. ttec.com)" value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} />
          <input className="w-full bg-surface border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent" placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={!form.platform.trim()} className="flex-1 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer disabled:opacity-40" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-sm font-mono text-[10px] uppercase cursor-pointer border border-border text-muted-foreground">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      {credentials.length > 3 && (
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)} className="text-[9px] font-mono px-2 py-1 rounded-sm border cursor-pointer transition-all" style={filterCat === cat ? { background: 'var(--dim)', color: 'var(--text)', borderColor: 'var(--muted)' } : { borderColor: 'var(--border)', color: 'var(--muted)' }}>
              {cat === 'All' ? `All (${credentials.length})` : cat.split(' / ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Credentials list */}
      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
        {filtered.map(cred => {
          const revealed = revealedIds.has(cred.id)
          return (
            <div key={cred.id} className="p-2.5 rounded-sm border border-border bg-surface2 group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-semibold text-text">{cred.platform}</span>
                  {cred.url && <span className="font-mono text-[9px] text-muted-foreground">{cred.url}</span>}
                </div>
                {showDeleteConfirm === cred.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-danger">Delete?</span>
                    <button onClick={() => handleRemove(cred.id)} className="text-[9px] font-mono text-danger cursor-pointer">Yes</button>
                    <button onClick={() => setShowDeleteConfirm(null)} className="text-[9px] font-mono text-muted-foreground cursor-pointer">No</button>
                  </div>
                ) : (
                  <button onClick={() => setShowDeleteConfirm(cred.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger cursor-pointer transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {cred.email && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">Email</span>
                    <span className="font-mono text-[10px] text-text flex-1 truncate">{cred.email}</span>
                    <button onClick={() => copyToClipboard(cred.email, cred.id + 'e')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0">
                      {copiedKey === cred.id + 'e' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.username && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">User</span>
                    <span className="font-mono text-[10px] text-text flex-1 truncate">{cred.username}</span>
                    <button onClick={() => copyToClipboard(cred.username, cred.id + 'u')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0">
                      {copiedKey === cred.id + 'u' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.password && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">Pass</span>
                    <span className="font-mono text-[10px] text-text flex-1">{revealed ? cred.password : '••••••••'}</span>
                    <button onClick={() => setRevealedIds(prev => { const n = new Set(prev); n.has(cred.id) ? n.delete(cred.id) : n.add(cred.id); return n })} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0">
                      {revealed ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                    </button>
                    <button onClick={() => copyToClipboard(cred.password, cred.id + 'p')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0">
                      {copiedKey === cred.id + 'p' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.accountNumber && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">Acct</span>
                    <span className="font-mono text-[10px] text-text truncate">{cred.accountNumber}</span>
                    <button onClick={() => copyToClipboard(cred.accountNumber, cred.id + 'a')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0">
                      {copiedKey === cred.id + 'a' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.notes && <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{cred.notes}</div>}
              </div>
            </div>
          )
        })}
      </div>

      {credentials.length === 0 && !showForm && (
        <div className="text-center py-5 text-[11px] font-mono text-muted-foreground">
          No credentials yet. Add your first platform.
        </div>
      )}
    </div>
  )
}
