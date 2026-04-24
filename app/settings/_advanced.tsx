"use client"

import { useState, useEffect } from 'react'

interface Info {
  keyHint: string
  redisStatus: 'connected' | 'error' | 'unknown'
  version: string
}

export function AdvancedTab() {
  const [info, setInfo] = useState<Info | null>(null)

  useEffect(() => {
    fetch('/api/settings/info').then(r => r.json()).then(setInfo).catch(() => {})
  }, [])

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
      <span className="font-mono text-[11px] text-text">{value}</span>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="bg-surface2 border border-border rounded-md p-4">
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase mb-3">System Info</div>
        {!info ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => <div key={i} className="h-8 bg-dim rounded animate-pulse" />)}
          </div>
        ) : (
          <div>
            {row('App version', `v${info.version}`)}
            {row('ENCRYPTION_KEY', <span className="text-muted-foreground">{info.keyHint}</span>)}
            {row('Redis status', (
              <span style={{ color: info.redisStatus === 'connected' ? 'var(--accent)' : 'var(--danger)' }}>
                ● {info.redisStatus}
              </span>
            ))}
            {row('Environment', process.env.NODE_ENV ?? 'unknown')}
          </div>
        )}
      </div>

      <div className="bg-surface2 border border-border rounded-md p-4 space-y-2">
        <div className="text-[9px] font-mono tracking-[0.2em] text-muted-foreground uppercase">Notes</div>
        <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
          ENCRYPTION_KEY is used to encrypt all Redis data at rest. Changing it requires re-encryption of all stored data.
        </p>
        <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
          SESSION_SECRET is used to sign HMAC auth tokens. Changing it invalidates all active sessions.
        </p>
      </div>
    </div>
  )
}
