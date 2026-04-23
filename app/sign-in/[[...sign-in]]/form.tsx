"use client"

import { useState } from 'react'

export default function SignInForm({ errorCode }: { errorCode: string | null }) {
  const [loading, setLoading] = useState(false)

  const errorMsg =
    errorCode === 'locked' ? 'Too many attempts. Try again in 5 minutes.' :
    errorCode ? 'Incorrect password.' :
    null

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="w-full max-w-sm p-8 bg-surface border border-border rounded-md shadow-sm">
        <div className="text-[9px] font-mono tracking-[0.25em] text-primary uppercase mb-2">
          // Grenada Command Center
        </div>
        <h1 className="text-2xl font-extrabold text-text mb-6">Sign in</h1>
        <form method="POST" action="/api/login" onSubmit={() => setLoading(true)} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.1em] block mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full bg-dim border border-border text-text font-mono text-sm px-3 py-2.5 rounded-sm focus:outline-none focus:border-primary"
              placeholder="Enter password"
              autoFocus
              disabled={errorCode === 'locked'}
            />
          </div>
          {errorMsg && (
            <div className="text-[11px] font-mono text-danger">{errorMsg}</div>
          )}
          <button
            type="submit"
            disabled={loading || errorCode === 'locked'}
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
