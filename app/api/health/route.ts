import { cookies } from 'next/headers'
import { verifyAuthToken, COOKIE_NAME } from '@/lib/auth-cookie'
import { getRedis } from '@/lib/db'

export async function GET() {
  let redis = false
  let auth = false

  try {
    redis = await getRedis().ping() === 'PONG'
  } catch {}

  try {
    const store = await cookies()
    const token = store.get(COOKIE_NAME)?.value
    const secret = process.env.SESSION_SECRET
    if (token && secret) auth = await verifyAuthToken(token, secret)
  } catch {}

  return Response.json({ redis, auth })
}
