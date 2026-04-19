"use client"

import { useState, useEffect, useCallback } from 'react'
import { Plus, Eye, EyeOff, Copy, Trash2, Check, Lock, Unlock, Shield, AlertTriangle } from 'lucide-react'
import {
  initVault, unlockVault, encryptVault, decryptVault,
  vaultExists, clearVault, lockVault,
  isVaultUnlocked, resetLockTimer,
} from '@/lib/vault-crypto'
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

type VaultView = 'locked' | 'setup' | 'unlocked'

interface CredentialsVaultProps {
  // Vault manages its own encrypted state — no props needed for credentials
}

export function CredentialsVault(_: CredentialsVaultProps) {
  const [view, setView] = useState<VaultView>('locked')
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password fields
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showMasterPw, setShowMasterPw] = useState(false)

  // Rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockedOut, setLockedOut] = useState(false)
  const MAX_ATTEMPTS = 5

  // Vault UI state
  const [showForm, setShowForm] = useState(false)
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set())
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [filterCat, setFilterCat] = useState('All')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [autoLockMsg, setAutoLockMsg] = useState(false)

  const [form, setForm] = useState({
    platform: '', category: 'Call Center / Jobs', username: '',
    email: '', password: '', accountNumber: '', notes: '', url: '',
  })

  // ── Init: check if vault exists and if session is still active ──────────
  useEffect(() => {
    if (vaultExists()) {
      if (isVaultUnlocked()) {
        // Session still active — restore
        restoreSession()
      } else {
        setView('locked')
      }
    } else {
      setView('setup')
    }
  }, [])

  // Listen for auto-lock event
  useEffect(() => {
    const handler = () => {
      setView('locked')
      setCredentials([])
      setAutoLockMsg(true)
      setTimeout(() => setAutoLockMsg(false), 3000)
    }
    window.addEventListener('vault-locked', handler)
    return () => window.removeEventListener('vault-locked', handler)
  }, [])

  // Reset auto-lock timer on any interaction
  const handleActivity = () => {
    if (isVaultUnlocked()) resetLockTimer()
  }

  const restoreSession = async () => {
    const data = await decryptVault<Credential[]>()
    if (data) { setCredentials(data); setView('unlocked') }
    else { lockVault(); setView('locked') }
  }

  // ── SAVE helper — always re-encrypt after any change ────────────────────
  const saveCredentials = useCallback(async (updated: Credential[]) => {
    await encryptVault(updated)
    setCredentials(updated)
  }, [])

  // ── SETUP: create new vault ──────────────────────────────────────────────
  const handleSetup = async () => {
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    await initVault(password)
    setCredentials([])
    setView('unlocked')
    setPassword(''); setConfirmPassword('')
    setLoading(false)
  }

  // ── UNLOCK ───────────────────────────────────────────────────────────────
  const handleUnlock = async () => {
    if (lockedOut) return
    setError('')
    setLoading(true)
    const ok = await unlockVault(password)
    if (!ok) {
      const next = failedAttempts + 1
      setFailedAttempts(next)
      if (next >= MAX_ATTEMPTS) {
        setLockedOut(true)
        setError(`Too many failed attempts. Reload the page to try again.`)
      } else {
        setError(`Incorrect password. ${MAX_ATTEMPTS - next} attempt${MAX_ATTEMPTS - next === 1 ? '' : 's'} remaining.`)
      }
      setLoading(false)
      return
    }
    const data = await decryptVault<Credential[]>()
    if (data === null) { setError('Could not decrypt vault.'); setLoading(false); return }
    setCredentials(data)
    setView('unlocked')
    setPassword('')
    setFailedAttempts(0)
    setLoading(false)
  }

  // ── LOCK ─────────────────────────────────────────────────────────────────
  const handleLock = () => {
    lockVault()
    setCredentials([])
    setRevealedIds(new Set())
    setView('locked')
  }

  // ── CREDENTIAL CRUD ──────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!form.platform.trim()) return
    const newCred: Credential = {
      id: `cred-${Date.now()}`,
      platform: form.platform, category: form.category,
      username: form.username, email: form.email,
      password: form.password, accountNumber: form.accountNumber,
      notes: form.notes, url: form.url,
    }
    const updated = [...credentials, newCred]
    await saveCredentials(updated)
    setForm({ platform: '', category: 'Call Center / Jobs', username: '', email: '', password: '', accountNumber: '', notes: '', url: '' })
    setShowForm(false)
  }

  const handleUpdate = async (id: string, updates: Partial<Credential>) => {
    const updated = credentials.map(c => c.id === id ? { ...c, ...updates } : c)
    await saveCredentials(updated)
  }

  const handleRemove = async (id: string) => {
    const updated = credentials.filter(c => c.id !== id)
    await saveCredentials(updated)
  }

  const handleDeleteVault = () => {
    clearVault(); lockVault()
    setCredentials([]); setView('setup'); setShowDeleteConfirm(false)
  }

  const copyToClipboard = async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text); setCopiedKey(key); setTimeout(() => setCopiedKey(null), 1500) } catch {}
  }

  const filtered = filterCat === 'All' ? credentials : credentials.filter(c => c.category === filterCat)
  const missing = QUICK_PLATFORMS.filter(qp => !credentials.find(c => c.platform.toLowerCase().includes(qp.name.toLowerCase())))

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: SETUP (first time)
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'setup') {
    return (
      <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--warn)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-warn" />
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Credentials Vault — Setup</div>
        </div>

        <div className="space-y-3 mb-5 p-3 rounded-md border border-border bg-surface2">
          <div className="text-[11px] font-mono text-text font-semibold">How this vault works:</div>
          <div className="space-y-1.5 text-[11px] font-mono text-muted-foreground">
            <div>✓ Credentials encrypted with AES-256 before saving</div>
            <div>✓ Master password never stored — only you know it</div>
            <div>✓ Auto-locks after 5 minutes of inactivity</div>
            <div>✓ Session key lives in memory only — cleared on tab close</div>
            <div className="text-warn mt-2">⚠ Forgotten password = permanent data loss. No recovery.</div>
            <div className="text-muted-foreground">Use a password manager for banking credentials.</div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">Master Password</div>
            <div className="relative">
              <input
                type={showMasterPw ? 'text' : 'password'}
                className="w-full bg-dim border border-border text-text font-mono text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-warn pr-10"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && confirmPassword && handleSetup()}
              />
              <button onClick={() => setShowMasterPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-text cursor-pointer">
                {showMasterPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="flex gap-1 mt-1.5">
                {[8, 10, 12, 16].map(len => (
                  <div key={len} className="h-1 flex-1 rounded-sm" style={{ background: password.length >= len ? 'var(--accent)' : 'var(--dim)' }} />
                ))}
                <span className="font-mono text-[9px] text-muted-foreground ml-1">
                  {password.length < 8 ? 'Too short' : password.length < 12 ? 'OK' : 'Strong'}
                </span>
              </div>
            )}
          </div>

          <div>
            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.1em] mb-1.5">Confirm Password</div>
            <input
              type={showMasterPw ? 'text' : 'password'}
              className="w-full bg-dim border border-border text-text font-mono text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-warn"
              placeholder="Repeat password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSetup()}
            />
          </div>

          {error && <div className="text-[11px] font-mono text-danger">{error}</div>}

          <button
            onClick={handleSetup}
            disabled={loading || password.length < 8 || password !== confirmPassword}
            className="w-full py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] font-semibold cursor-pointer transition-all disabled:opacity-40"
            style={{ background: 'var(--warn)', color: 'var(--bg)' }}
          >
            {loading ? 'Creating vault...' : 'Create Encrypted Vault'}
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: LOCKED
  // ─────────────────────────────────────────────────────────────────────────
  if (view === 'locked') {
    return (
      <div className="bg-surface border border-border rounded-md p-5" style={{ borderTopWidth: 2, borderTopColor: 'var(--warn)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-warn" />
          <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Credentials Vault — Locked</div>
        </div>

        {autoLockMsg && (
          <div className="mb-3 p-2.5 rounded-sm border border-warn/40 text-[11px] font-mono text-warn">
            Vault auto-locked after 5 minutes of inactivity.
          </div>
        )}

        <div className="text-center py-4 mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-warn flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5 text-warn" />
          </div>
          <div className="font-mono text-[12px] text-muted-foreground">Enter your master password to unlock</div>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <input
              type={showMasterPw ? 'text' : 'password'}
              className="w-full bg-dim border border-border text-text font-mono text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-warn pr-10"
              placeholder="Master password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              autoFocus
            />
            <button onClick={() => setShowMasterPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-text cursor-pointer">
              {showMasterPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[11px] font-mono text-danger">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleUnlock}
            disabled={loading || !password || lockedOut}
            className="w-full py-3 rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] font-semibold cursor-pointer transition-all disabled:opacity-40"
            style={{ background: 'var(--warn)', color: 'var(--bg)' }}
          >
            {loading ? 'Unlocking...' : 'Unlock Vault'}
          </button>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: UNLOCKED
  // ─────────────────────────────────────────────────────────────────────────
  const categories = ['All', ...new Set(credentials.map(c => c.category))]

  return (
    <div
      className="bg-surface border border-border rounded-md p-5"
      style={{ borderTopWidth: 2, borderTopColor: 'var(--accent)' }}
      onMouseMove={handleActivity}
      onKeyDown={handleActivity}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Unlock className="w-4 h-4 text-accent" />
          <div>
            <div className="text-[9px] font-mono tracking-[0.25em] text-muted-foreground uppercase">Credentials Vault</div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
              {credentials.length} platforms · AES-256 encrypted · auto-locks in 5min
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 rounded-sm border cursor-pointer transition-all uppercase"
            style={showForm ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            <Plus className="w-3 h-3" /> Add
          </button>
          <button
            onClick={handleLock}
            className="flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1.5 rounded-sm border border-border text-muted-foreground hover:border-warn hover:text-warn cursor-pointer transition-all"
          >
            <Lock className="w-3 h-3" /> Lock
          </button>
        </div>
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
              Save (encrypted)
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
            <div key={cred.id} className="p-2.5 rounded-sm border border-border bg-surface2 group" onClick={handleActivity}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[12px] font-semibold text-text">{cred.platform}</span>
                  {cred.url && <span className="font-mono text-[9px] text-muted-foreground">{cred.url}</span>}
                </div>
                <button onClick={() => handleRemove(cred.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger cursor-pointer transition-all">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {cred.email && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">Email</span>
                    <span className="font-mono text-[10px] text-text flex-1 truncate">{cred.email}</span>
                    <button onClick={() => copyToClipboard(cred.email, cred.id + 'e')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0 transition-all">
                      {copiedKey === cred.id + 'e' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.username && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">User</span>
                    <span className="font-mono text-[10px] text-text flex-1 truncate">{cred.username}</span>
                    <button onClick={() => copyToClipboard(cred.username, cred.id + 'u')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0 transition-all">
                      {copiedKey === cred.id + 'u' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.password && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">Pass</span>
                    <span className="font-mono text-[10px] text-text flex-1 font-mono">
                      {revealed ? cred.password : '••••••••'}
                    </span>
                    <button onClick={() => setRevealedIds(prev => { const n = new Set(prev); n.has(cred.id) ? n.delete(cred.id) : n.add(cred.id); return n })} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0 transition-all">
                      {revealed ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                    </button>
                    <button onClick={() => copyToClipboard(cred.password, cred.id + 'p')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0 transition-all">
                      {copiedKey === cred.id + 'p' ? <Check className="w-2.5 h-2.5 text-primary" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                )}
                {cred.accountNumber && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] text-muted-foreground w-12 shrink-0">Acct</span>
                    <span className="font-mono text-[10px] text-text truncate">{cred.accountNumber}</span>
                    <button onClick={() => copyToClipboard(cred.accountNumber, cred.id + 'a')} className="p-0.5 text-muted-foreground hover:text-text cursor-pointer shrink-0 transition-all">
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
          Vault unlocked. Add your first credential.
        </div>
      )}

      {/* Danger zone */}
      <div className="mt-4 pt-3 border-t border-border">
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-[9px] font-mono text-muted-foreground hover:text-danger transition-all cursor-pointer"
          >
            Delete vault and all credentials
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-danger">This cannot be undone.</span>
            <button onClick={handleDeleteVault} className="text-[10px] font-mono px-2.5 py-1 rounded-sm cursor-pointer" style={{ background: 'var(--danger)', color: 'var(--bg)' }}>
              Delete everything
            </button>
            <button onClick={() => setShowDeleteConfirm(false)} className="text-[10px] font-mono text-muted-foreground hover:text-text cursor-pointer">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
