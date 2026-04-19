import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import type { SessionData } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  if (req.nextUrl.pathname.startsWith('/sign-in')) return res

  const session = await getIronSession<SessionData>(req.cookies, res.cookies, {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'grenada_session',
  })

  if (!session.isLoggedIn) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
