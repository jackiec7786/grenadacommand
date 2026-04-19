"use client"

import { useState } from 'react'

export default function SignInPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        window.location.href = '/'
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Incorrect password.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="w-full max-w-sm p-8 bg-surface border border-border rounded-md shadow-sm">
        <div className="text-[9px] font-mono tracking-[0.25em] text-primary uppercase mb-2">
          // Grenada Command Center
        </div>
        <h1 className="text-2xl font-extrabold text-text mb-6">Sign in</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-dim border border-border text-text font-mono text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-primary"
              placeholder="Enter password"
              autoFocus
            />
          </div>
          {error && <div className="text-[11px] font-mono text-danger">{error}</div>}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 rounded-sm font-mono text-[11px] uppercase tracking-[0.15em] font-semibold cursor-pointer transition-all disabled:opacity-40"
            style={{ background: 'var(--primary)', color: '#ffffff' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
