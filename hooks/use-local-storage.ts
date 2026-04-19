"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)
  const latestValueRef = useRef<T>(initialValue)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        latestValueRef.current = parsed
        setStoredValue(parsed)
      }
    } catch (error) {
      console.error('Error reading localStorage:', error)
    }
    setIsInitialized(true)
  }, [key])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value
      latestValueRef.current = valueToStore

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        try {
          window.localStorage.setItem(key, JSON.stringify(latestValueRef.current))
        } catch (error) {
          console.error('Error writing to localStorage:', error)
        }
      }, 300)

      return valueToStore
    })
  }, [key])

  return [isInitialized ? storedValue : initialValue, setValue]
}
