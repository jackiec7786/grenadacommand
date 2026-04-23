import { NextResponse } from 'next/server'
import { createAuthToken, COOKIE_NAME, COOKIE_OPTIONS } from '@/lib/auth-cookie'
import { getRedis } from '@/lib/db'

const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 300 // 5 minutes

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  const rateLimitKey = `login_attempts:${ip}`

  const attempts = parseInt((await getRedis().get(rateLimitKey)) ?? '0')
  if (attempts >= MAX_ATTEMPTS) {
    return NextResponse.redirect(new URL('/sign-in?error=locked', req.url), 303)
  }

  const formData = await req.formData()
  const password = (formData.get('password') as string) ?? ''

  const correct = process.env.AUTH_PASSWORD
  const secret = process.env.SESSION_SECRET

  if (!correct || !secret || password !== correct) {
    await getRedis().set(rateLimitKey, attempts + 1, 'EX', LOCKOUT_SECONDS)
    return NextResponse.redirect(new URL('/sign-in?error=1', req.url), 303)
  }

  await getRedis().del(rateLimitKey)
  await getRedis().set('grenada:session:active', '1')

  const token = await createAuthToken(secret)
  const res = NextResponse.redirect(new URL('/', req.url), 303)
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS)
  return res
}
