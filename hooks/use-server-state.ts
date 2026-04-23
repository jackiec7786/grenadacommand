'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_STATE, type AppState } from '@/lib/data'

type Setter = (v: AppState | ((prev: AppState) => AppState)) => void

const LS_KEY = 'grenada_state'

function readLocalStorage(): AppState | null {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as AppState) : null
  } catch {
    return null
  }
}

function writeLocalStorage(state: AppState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)) } catch {}
}

async function postState(state: AppState) {
  const res = await fetch('/api/state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  if (!res.ok) throw new Error(`POST /api/state ${res.status}`)
}

export function useServerState(): [AppState, Setter, boolean, boolean] {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef = useRef<AppState>(DEFAULT_STATE)

  useEffect(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then((data: AppState | null) => {
        if (data === null) {
          // First login — migrate from localStorage if data exists
          const local = readLocalStorage()
          if (local) {
            setState(local)
            latestRef.current = local
            postState(local).catch(err => console.error('[state] migration save failed:', err))
            return
          }
          setState(DEFAULT_STATE)
          latestRef.current = DEFAULT_STATE
        } else {
          setState(data)
          latestRef.current = data
          writeLocalStorage(data) // keep local shadow in sync
        }
      })
      .catch(err => {
        console.error('[state] Redis fetch failed, using localStorage fallback:', err)
        const local = readLocalStorage()
        const fallback = local ?? DEFAULT_STATE
        setState(fallback)
        latestRef.current = fallback
        setUsingFallback(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const setValue = useCallback<Setter>((value) => {
    setState(prev => {
      const next = value instanceof Function ? value(prev) : value
      latestRef.current = next
      writeLocalStorage(next) // shadow write — always keep local copy current

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        if (retryRef.current) clearTimeout(retryRef.current)
        postState(latestRef.current)
          .then(() => setUsingFallback(false))
          .catch(err => {
            console.error('[state] Redis save failed, will retry in 5s:', err)
            setUsingFallback(true)
            // Single retry after 5 seconds
            retryRef.current = setTimeout(() => {
              postState(latestRef.current)
                .then(() => setUsingFallback(false))
                .catch(e => console.error('[state] retry also failed:', e))
            }, 5000)
          })
      }, 1000)
      return next
    })
  }, [])

  return [state, setValue, loading, usingFallback]
}
