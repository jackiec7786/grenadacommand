import { NextResponse } from 'next/server'
import { createAuthToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth-cookie'
import { getRedis } from '@/lib/db'
import { getSettings } from '@/lib/settings'
import { verifyPassword } from '@/lib/password'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 300 // 5 minutes

async function rateLimitKey(password: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
  return `login_attempts:${hex.slice(0, 16)}`
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const password = (formData.get('password') as string) ?? ''

  const key = await rateLimitKey(password)
  const attempts = parseInt((await getRedis().get(key)) ?? '0')
  if (attempts >= MAX_ATTEMPTS) {
    return NextResponse.redirect(new URL('/sign-in?error=locked', req.url), 303)
  }

  const envPassword = process.env.AUTH_PASSWORD
  const secret = process.env.SESSION_SECRET

  if (!secret) {
    return NextResponse.redirect(new URL('/sign-in?error=1', req.url), 303)
  }

  // Check Redis password override first, then fall back to env var
  const settings = await getSettings()
  const passwordValid = settings.passwordHash
    ? await verifyPassword(password, settings.passwordHash)
    : !!(envPassword && password === envPassword)

  if (!passwordValid) {
    await getRedis().set(key, attempts + 1, 'EX', LOCKOUT_SECONDS)
    return NextResponse.redirect(new URL('/sign-in?error=1', req.url), 303)
  }

  await getRedis().del(key)
  await getRedis().set('grenada:session:active', '1')

  const token = await createAuthToken(secret)
  const timeoutDays = settings.sessionTimeoutDays ?? 7
  const maxAge = timeoutDays * 24 * 60 * 60

  const res = NextResponse.redirect(new URL('/', req.url), 303)
  res.cookies.set(COOKIE_NAME, token, { ...COOKIE_OPTIONS, maxAge })
  res.cookies.set('grenada_ts', Date.now().toString(), { sameSite: 'strict', maxAge, path: '/' })
  return res
}
