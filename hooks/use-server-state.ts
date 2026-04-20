'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_STATE, type AppState } from '@/lib/data'

type Setter = (v: AppState | ((prev: AppState) => AppState)) => void

export function useServerState(): [AppState, Setter, boolean] {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef = useRef<AppState>(DEFAULT_STATE)

  useEffect(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then((data: AppState | null) => {
        if (data === null) {
          try {
            const local = localStorage.getItem('grenada_state')
            if (local) {
              const parsed = JSON.parse(local) as AppState
              setState(parsed)
              latestRef.current = parsed
              fetch('/api/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: local,
              }).catch(() => {})
              return
            }
          } catch {}
          setState(DEFAULT_STATE)
          latestRef.current = DEFAULT_STATE
        } else {
          setState(data)
          latestRef.current = data
        }
      })
      .catch(() => {
        setState(DEFAULT_STATE)
        latestRef.current = DEFAULT_STATE
      })
      .finally(() => setLoading(false))
  }, [])

  const setValue = useCallback<Setter>((value) => {
    setState(prev => {
      const next = value instanceof Function ? value(prev) : value
      latestRef.current = next
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(latestRef.current),
        }).catch(() => {})
      }, 1000)
      return next
    })
  }, [])

  return [state, setValue, loading]
}
