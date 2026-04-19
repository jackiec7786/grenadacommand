import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST(req: Request) {
  const { password } = await req.json()
  const correct = process.env.AUTH_PASSWORD

  if (!correct || password !== correct) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  const session = await getSession()
  session.isLoggedIn = true
  await session.save()

  return NextResponse.json({ ok: true })
}
