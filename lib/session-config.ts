export const SESSION_OPTIONS = {
  password: process.env.SESSION_SECRET as string,
  cookieName: 'grenada_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30,
  },
}
