'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { DEFAULT_STATE, type AppState } from '@/lib/data'

export function useServerState(): [AppState, (v: AppState | ((p: AppState) => AppState)) => void, boolean] {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestRef = useRef<AppState>(DEFAULT_STATE)

  useEffect(() => {
    fetch('/api/state')
      .then(r => r.json())
      .then(data => {
        if (data === null) {
          const local = localStorage.getItem('grenada_state')
          if (local) {
            try {
              const parsed = JSON.parse(local)
              setState(parsed)
              latestRef.current = parsed
              fetch('/api/state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: local,
              })
            } catch {
              setState(DEFAULT_STATE)
              latestRef.current = DEFAULT_STATE
            }
          } else {
            setState(DEFAULT_STATE)
            latestRef.current = DEFAULT_STATE
          }
        } else {
          setState(data)
          latestRef.current = data
        }
        setLoading(false)
      })
      .catch(() => {
        setState(DEFAULT_STATE)
        latestRef.current = DEFAULT_STATE
        setLoading(false)
      })
  }, [])

  const setValue = useCallback((value: AppState | ((prev: AppState) => AppState)) => {
    setState(prev => {
      const next = value instanceof Function ? value(prev) : value
      latestRef.current = next
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(latestRef.current),
        })
      }, 1000)
      return next
    })
  }, [])

  return [state, setValue, loading]
}
