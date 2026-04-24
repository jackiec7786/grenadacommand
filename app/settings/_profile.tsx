"use client"

import { useState } from 'react'

interface Props {
  theme: 'dark' | 'light'
  sessionTimeoutDays: number
  onSave: (data: { theme: 'dark' | 'light'; sessionTimeoutDays: number }) => Promise<void>
}

export function ProfileTab({ theme, sessionTimeoutDays, onSave }: Props) {
  const [localTheme, setLocalTheme] = useState(theme)
  const [timeout, setTimeout_] = useState(sessionTimeoutDays)
  const [saving, setSaving] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const [pwLoading, setPwLoading] = useState(false)

  const inp = 'bg-dim border border-border text-text font-mono text-xs p-2 rounded-sm focus:outline-none focus:border-accent w-full'
  const section = 'bg-surface2 border border-border rounded-md p-4 space-y-4'

  const handleSave = async () => {
    setSaving(true)
    await onSave({ theme: localTheme, sessionTimeoutDays: timeout })
    if (localTheme !== theme) {
      document.cookie = `grenada_theme=${localTheme};path=/;max-age=${60 * 60 * 24 * 365};samesite=strict`
      window.location.reload()
    }
    setSaving(false)
  }

  const handlePasswordChange = async () => {
    if (next !== confirm) { setPwMsg({ text: 'Passwords do not match.', ok: false }); return }
    if (next.length < 8) { setPwMsg({ text: 'New password must be at least 8 characters.', ok: false }); return }
    setPwLoading(true)
    setPwMsg(null)
    const res = await fetch('/api/settings/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: current, newPassword: next }),
    }).catch(() => null)
    setPwLoading(false)
    if (res?.ok) {
      setPwMsg({ text: '✓ Password changed successfully.', ok: true })
      setCurrent(''); setNext(''); setConfirm('')
    } else {
      const d = await res?.json().catch(() => null)
      setPwMsg({ text: d?.error ?? 'Failed to change password.', ok: false })
    }
  }

  return (
    <div className="space-y-5">
      <div className={section}>
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Display & Session</div>
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-2">Theme</label>
          <div className="flex gap-2">
            {(['light', 'dark'] as const).map(t => (
              <button key={t} onClick={() => setLocalTheme(t)} className="px-3 py-1.5 rounded-sm font-mono text-[10px] uppercase cursor-pointer border transition-all"
                style={localTheme === t ? { background: 'var(--accent)', color: 'var(--bg)', borderColor: 'var(--accent)' } : { borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                {t === 'light' ? '☀ Light' : '◐ Dark'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-2">
            Session timeout — {timeout} {timeout === 1 ? 'day' : 'days'}
          </label>
          <input type="range" min="1" max="30" value={timeout} onChange={e => setTimeout_(Number(e.target.value))} className="w-full cursor-pointer accent-primary" />
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-1">
            <span>1 day</span><span>30 days</span>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">Takes effect on next sign-in.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 transition-all" style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className={section}>
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Change Password</div>
        <input type="password" className={inp} placeholder="Current password" value={current} onChange={e => setCurrent(e.target.value)} />
        <input type="password" className={inp} placeholder="New password (min 8 chars)" value={next} onChange={e => setNext(e.target.value)} />
        <input type="password" className={inp} placeholder="Confirm new password" value={confirm} onChange={e => setConfirm(e.target.value)} />
        {pwMsg && <div className={`text-[11px] font-mono ${pwMsg.ok ? 'text-primary' : 'text-danger'}`}>{pwMsg.text}</div>}
        <button onClick={handlePasswordChange} disabled={pwLoading || !current || !next || !confirm} className="font-mono text-[10px] uppercase px-4 py-2 rounded-sm cursor-pointer disabled:opacity-40 border border-accent text-accent transition-all">
          {pwLoading ? 'Updating...' : 'Change Password'}
        </button>
      </div>
    </div>
  )
}
