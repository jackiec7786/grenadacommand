import { NextResponse } from 'next/server'
import { createAuthToken, COOKIE_NAME } from '@/lib/auth-cookie'

export async function POST(req: Request) {
  const formData = await req.formData()
  const password = (formData.get('password') as string) ?? ''

  const correct = process.env.AUTH_PASSWORD
  if (!correct || password !== correct) {
    return NextResponse.redirect(new URL('/sign-in?error=1', req.url), 303)
  }

  const secret = process.env.SESSION_SECRET
  if (!secret) {
    return NextResponse.redirect(new URL('/sign-in?error=1', req.url), 303)
  }

  const token = await createAuthToken(secret)
  const res = NextResponse.redirect(new URL('/', req.url), 303)
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
