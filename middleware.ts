import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuthToken, COOKIE_NAME } from '@/lib/auth-cookie'

// Paths that never require authentication
const PUBLIC_PATHS = [
  '/sign-in',
  '/api/login',
  '/api/quote',
  '/api/location',
  '/api/weather',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  const token = req.cookies.get(COOKIE_NAME)?.value
  const secret = process.env.SESSION_SECRET
  const valid = !!token && !!secret && await verifyAuthToken(token, secret)

  if (!valid) {
    // API routes get JSON 401; pages get a redirect to /sign-in
    if (pathname.startsWith('/api/')) {
      return Response.json(null, { status: 401 })
    }
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
}

export const config = {
  // Cover all routes except Next.js internals and static assets
  matcher: ['/((?!_next|.*\\..*).*)'],
}
