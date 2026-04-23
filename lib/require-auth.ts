import { cookies } from 'next/headers'
import { verifyAuthToken, COOKIE_NAME } from './auth-cookie'
import { getRedis } from './db'

export async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false
  const [tokenValid, sessionActive] = await Promise.all([
    verifyAuthToken(token, secret),
    getRedis().exists('grenada:session:active'),
  ])
  return tokenValid && sessionActive === 1
}
