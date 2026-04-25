import { cookies } from 'next/headers'
import { verifyAuthToken, COOKIE_NAME, COOKIE_OPTIONS } from './auth-cookie'
import { getRedis } from './db'

// Rate-limit the Redis EXPIRE side effect to once per hour per process
let lastSessionRefresh = 0

export async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false

  const valid = await verifyAuthToken(token, secret)
  if (!valid) return false

  // Slide the cookie expiry on every authenticated API call
  try { store.set(COOKIE_NAME, token, COOKIE_OPTIONS) } catch { /* not available in server components */ }

  // Refresh the Redis session flag at most once per hour
  const now = Date.now()
  if (now - lastSessionRefresh > 3_600_000) {
    lastSessionRefresh = now
    try { getRedis().expire('grenada:session:active', 86400) } catch { /* Redis unavailable */ }
  }

  return true
}
