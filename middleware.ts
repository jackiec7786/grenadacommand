import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (
    pathname.startsWith('/sign-in') ||
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/logout')
  ) {
    return NextResponse.next()
  }

  const hasSession = req.cookies.has('grenada_session')
  if (!hasSession) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
}
