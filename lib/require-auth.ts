import { cookies } from 'next/headers'
import { verifyAuthToken, COOKIE_NAME } from './auth-cookie'

export async function requireAuth(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(COOKIE_NAME)?.value
  if (!token) return false
  const secret = process.env.SESSION_SECRET
  if (!secret) return false
  return verifyAuthToken(token, secret)
}
