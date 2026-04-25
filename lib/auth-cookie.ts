const COOKIE_NAME = 'grenada_session'
const PAYLOAD = 'grenada:authenticated'

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

export async function createAuthToken(secret: string): Promise<string> {
  const key = await getKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(PAYLOAD))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export async function verifyAuthToken(token: string, secret: string): Promise<boolean> {
  try {
    const key = await getKey(secret)
    const sig = Uint8Array.from(atob(token), c => c.charCodeAt(0))
    return crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(PAYLOAD))
  } catch {
    return false
  }
}

export const SESSION_DURATION_LONG = 60 * 60 * 24 * 30  // 30 days (remember me)
export const SESSION_DURATION_SHORT = 60 * 60 * 24 * 7   // 7 days (no remember me)

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: SESSION_DURATION_LONG,
  path: '/',
}

export { COOKIE_NAME }
