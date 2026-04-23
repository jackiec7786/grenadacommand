import { NextResponse } from 'next/server'
import { COOKIE_NAME } from '@/lib/auth-cookie'
import { getRedis } from '@/lib/db'

export async function POST() {
  await getRedis().del('grenada:session:active')
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' })
  return res
}
