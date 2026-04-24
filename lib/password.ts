export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, key, 256)
  return `${btoa(String.fromCharCode(...salt))}:${btoa(String.fromCharCode(...new Uint8Array(bits)))}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [saltB64, hashB64] = stored.split(':')
    const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
    const expected = Uint8Array.from(atob(hashB64), c => c.charCodeAt(0))
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' }, key, 256)
    const computed = new Uint8Array(bits)
    if (computed.length !== expected.length) return false
    let diff = 0
    for (let i = 0; i < computed.length; i++) diff |= computed[i] ^ expected[i]
    return diff === 0
  } catch {
    return false
  }
}
