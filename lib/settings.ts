import { getRedis } from './db'
import { encrypt, decrypt } from './crypto'

export interface AppSettings {
  sessionTimeoutDays: number
  currency: 'USD' | 'XCD'
  theme: 'dark' | 'light'
  monthlyGoal: number
  customTaskLists: Record<number, { label: string; tag: string; time: string }[]> | null
  customIncomeSources: { id: string; name: string; max: number }[] | null
  passwordHash: string | null
}

const KEY = 'grenada:settings'

export const DEFAULT_SETTINGS: AppSettings = {
  sessionTimeoutDays: 7,
  currency: 'USD',
  theme: 'light',
  monthlyGoal: 2500,
  customTaskLists: null,
  customIncomeSources: null,
  passwordHash: null,
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const raw = await getRedis().get(KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(await decrypt(raw)) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await getRedis().set(KEY, await encrypt(JSON.stringify(settings)))
}
