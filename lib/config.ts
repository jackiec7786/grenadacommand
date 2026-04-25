import { getRedis } from './db'
import { encrypt, decrypt } from './crypto'
import {
  TASKS, MILESTONES, PHASE_CHECKLISTS, INCOME_STREAMS,
  GRENADA_EVENTS, RISK_SCENARIOS, PSYCH_MESSAGES, RESILIENCE_ITEMS,
} from './data'
import type { GrenadaEvent, RiskScenario } from './data'

export type ConfigTask = { label: string; tag: string; time: string }
export type ConfigMilestone = { id: string; text: string; month: string; phase: number }
export type ConfigChecklistItem = { id: string; category: string; text: string }
export type ConfigIncomeStream = { id: string; name: string; max: number }
export type ConfigResilienceItem = { id: string; category: string; text: string; ideal: string }

// Raw stored config — null means "use default from data.ts"
export interface AppConfig {
  tasks: Record<number, ConfigTask[]> | null
  milestones: ConfigMilestone[] | null
  phaseChecklists: Record<number, ConfigChecklistItem[]> | null
  incomeStreams: ConfigIncomeStream[] | null
  events: GrenadaEvent[] | null
  riskScenarios: RiskScenario[] | null
  psychMessages: Record<string, string[]> | null
  resilienceItems: ConfigResilienceItem[] | null
}

// What components receive after merging with defaults
export interface MergedConfig {
  tasks: Record<number, ConfigTask[]>
  milestones: ConfigMilestone[]
  phaseChecklists: Record<number, ConfigChecklistItem[]>
  incomeStreams: ConfigIncomeStream[]
  events: GrenadaEvent[]
  riskScenarios: RiskScenario[]
  psychMessages: Record<string, string[]>
  resilienceItems: ConfigResilienceItem[]
}

const KEY = 'grenada:config'
const EMPTY: AppConfig = {
  tasks: null, milestones: null, phaseChecklists: null,
  incomeStreams: null, events: null, riskScenarios: null,
  psychMessages: null, resilienceItems: null,
}

export function mergeWithDefaults(config: AppConfig): MergedConfig {
  return {
    tasks: config.tasks ?? (TASKS as Record<number, ConfigTask[]>),
    milestones: config.milestones ?? (MILESTONES as ConfigMilestone[]),
    phaseChecklists: config.phaseChecklists ?? PHASE_CHECKLISTS,
    incomeStreams: config.incomeStreams ?? (INCOME_STREAMS as ConfigIncomeStream[]),
    events: config.events ?? GRENADA_EVENTS,
    riskScenarios: config.riskScenarios ?? RISK_SCENARIOS,
    psychMessages: config.psychMessages ?? (PSYCH_MESSAGES as Record<string, string[]>),
    resilienceItems: config.resilienceItems ?? (RESILIENCE_ITEMS as ConfigResilienceItem[]),
  }
}

export async function getConfig(): Promise<AppConfig> {
  try {
    const raw = await getRedis().get(KEY)
    if (!raw) return { ...EMPTY }
    return { ...EMPTY, ...JSON.parse(await decrypt(raw)) }
  } catch {
    return { ...EMPTY }
  }
}

export async function saveConfig(config: AppConfig): Promise<void> {
  await getRedis().set(KEY, await encrypt(JSON.stringify(config)))
}
