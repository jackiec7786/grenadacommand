async function getKey(algorithm: string): Promise<CryptoKey> {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw || raw.length < 32) throw new Error('ENCRYPTION_KEY must be at least 32 characters')
  const keyBytes = new TextEncoder().encode(raw).slice(0, 32)
  return crypto.subtle.importKey('raw', keyBytes, { name: algorithm }, false, ['encrypt', 'decrypt'])
}

export async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey('AES-GCM')
  const iv = crypto.getRandomValues(new Uint8Array(12)) // 96-bit nonce for GCM
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext)
  )
  const ivB64 = btoa(String.fromCharCode(...iv))
  const ctB64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)))
  return `${ivB64}:${ctB64}`
}

export async function decrypt(encrypted: string): Promise<string> {
  const [ivB64, ctB64] = encrypted.split(':')
  const iv = Uint8Array.from(atob(ivB64), c => c.charCodeAt(0))
  const ciphertext = Uint8Array.from(atob(ctB64), c => c.charCodeAt(0))

  // Detect format by IV length: GCM = 12 bytes (16 b64 chars), CBC = 16 bytes (24 b64 chars)
  const isLegacyCBC = iv.length === 16
  if (isLegacyCBC) {
    const key = await getKey('AES-CBC')
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, ciphertext)
    return new TextDecoder().decode(plaintext)
  }

  const key = await getKey('AES-GCM')
  const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)
  return new TextDecoder().decode(plaintext)
}
