'use client'
import { useState, useEffect } from 'react'
import {
  TASKS, MILESTONES, PHASE_CHECKLISTS, INCOME_STREAMS,
  GRENADA_EVENTS, RISK_SCENARIOS, PSYCH_MESSAGES, RESILIENCE_ITEMS,
} from '@/lib/data'
import type { MergedConfig } from '@/lib/config'

const DEFAULT: MergedConfig = {
  tasks: TASKS as Record<number, { label: string; tag: string; time: string }[]>,
  milestones: MILESTONES as MergedConfig['milestones'],
  phaseChecklists: PHASE_CHECKLISTS as MergedConfig['phaseChecklists'],
  incomeStreams: INCOME_STREAMS as MergedConfig['incomeStreams'],
  events: GRENADA_EVENTS as MergedConfig['events'],
  riskScenarios: RISK_SCENARIOS as MergedConfig['riskScenarios'],
  psychMessages: PSYCH_MESSAGES as Record<string, string[]>,
  resilienceItems: RESILIENCE_ITEMS as MergedConfig['resilienceItems'],
}

let _cache: MergedConfig | null = null
let _cachedAt = 0
const TTL = 60_000

export function invalidateConfigCache() {
  _cache = null
  _cachedAt = 0
}

export function useConfig(): MergedConfig {
  const [config, setConfig] = useState<MergedConfig>(_cache ?? DEFAULT)

  useEffect(() => {
    const now = Date.now()
    if (_cache && now - _cachedAt < TTL) {
      setConfig(_cache)
      return
    }
    fetch('/api/config')
      .then(r => r.json())
      .then((data: MergedConfig) => {
        if (data) {
          _cache = data
          _cachedAt = Date.now()
          setConfig(data)
        }
      })
      .catch(() => {})
  }, [])

  return config
}
