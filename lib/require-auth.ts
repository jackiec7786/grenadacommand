import { cookies } from 'next/headers'
import { verifyAuthToken, COOKIE_NAME } from './auth-cookie'
import { getRedis } from './db'

export async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false

  const tokenValid = await verifyAuthToken(token, secret)
  if (!tokenValid) return false

  // Verify the server-side session flag. If Redis is unavailable, trust the
  // HMAC token alone — a valid signed token is sufficient proof of login.
  try {
    const sessionActive = await getRedis().exists('grenada:session:active')
    return sessionActive === 1
  } catch {
    return true
  }
}
