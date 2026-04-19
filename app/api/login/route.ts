import { NextResponse } from 'next/server'
import { createAuthToken, COOKIE_NAME } from '@/lib/auth-cookie'

export async function POST(req: Request) {
  const { password } = await req.json()
  const correct = process.env.AUTH_PASSWORD
  if (!correct || password !== correct) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const secret = process.env.SESSION_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const token = await createAuthToken(secret)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
