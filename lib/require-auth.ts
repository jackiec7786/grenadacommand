import { cookies } from 'next/headers'
import { verifyAuthToken, COOKIE_NAME, COOKIE_OPTIONS } from './auth-cookie'
import { getRedis } from './db'

export async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false

  const valid = await verifyAuthToken(token, secret)
  if (!valid) return false

  // Slide the cookie expiry on every authenticated API call
  try { store.set(COOKIE_NAME, token, COOKIE_OPTIONS) } catch { /* server components don't allow set() */ }

  // Keep the Redis session flag alive while the user is active (non-blocking)
  try { getRedis().expire('grenada:session:active', 86400).catch(() => {}) } catch { /* Redis unavailable */ }

  return true
}
