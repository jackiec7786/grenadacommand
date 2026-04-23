import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthToken, COOKIE_NAME } from '@/lib/auth-cookie'

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/sign-in')) {
    return NextResponse.next()
  }

  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  const secret = process.env.SESSION_SECRET
  if (!secret || !await verifyAuthToken(token, secret)) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
}
