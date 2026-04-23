"use client"

import { useState, useEffect } from 'react'

const SESSION_MAX_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const WARN_THRESHOLD_MS = 24 * 60 * 60 * 1000  // warn when < 1 day remains

export function SessionWarning() {
  const [expiresSoon, setExpiresSoon] = useState(false)

  useEffect(() => {
    const match = document.cookie.match(/grenada_ts=(\d+)/)
    if (!match) return
    const issuedAt = parseInt(match[1])
    const remaining = issuedAt + SESSION_MAX_MS - Date.now()
    setExpiresSoon(remaining > 0 && remaining < WARN_THRESHOLD_MS)
  }, [])

  if (!expiresSoon) return null

  return (
    <div
      className="w-full px-4 py-2 text-center font-mono text-[11px] border-b border-border"
      style={{ background: 'var(--warn)20', color: 'var(--warn)', borderColor: 'var(--warn)40' }}
    >
      Session expires in less than 24 hours —{' '}
      <button
        onClick={async () => {
          await fetch('/api/logout', { method: 'POST' })
          window.location.href = '/sign-in'
        }}
        className="underline cursor-pointer"
      >
        sign out and back in to renew
      </button>
    </div>
  )
}
