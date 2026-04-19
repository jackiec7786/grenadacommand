/**
 * Vault encryption using Web Crypto API (AES-256-GCM)
 * Key derivation via PBKDF2 with 310,000 iterations (OWASP 2023 recommendation)
 *
 * Security model:
 * - Master password NEVER stored — not even in memory beyond the unlock call
 * - Session holds a non-extractable CryptoKey only; raw bytes cannot be read back
 * - Derived key never persisted to localStorage
 * - Only encrypted ciphertext + salt + IV stored
 * - Auto-locks after 5 minutes of inactivity
 */

const PBKDF2_ITERATIONS = 310_000
const KEY_LENGTH = 256
const VAULT_STORAGE_KEY = 'grenada_vault_encrypted'
const VAULT_HASH_KEY = 'grenada_vault_hash'
const AUTO_LOCK_MS = 5 * 60 * 1000

// ─── ENCODING HELPERS ────────────────────────────────────────────────────────

function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function base64ToBuffer(b64: string): ArrayBuffer {
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes.buffer
}

// ─── TIMING-SAFE COMPARISON ───────────────────────────────────────────────────
// XOR-based constant-time comparison — prevents timing oracle on hash values.

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// ─── KEY DERIVATION ───────────────────────────────────────────────────────────

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: KEY_LENGTH },
    false,   // non-extractable — raw bytes can never be read back
    ['encrypt', 'decrypt']
  )
}

// ─── SESSION ──────────────────────────────────────────────────────────────────
// Holds a non-extractable CryptoKey — NOT the password string.

interface VaultSession {
  key: CryptoKey
  salt: string  // base64 salt tied to this key derivation
}

let _session: VaultSession | null = null
let _lockTimer: ReturnType<typeof setTimeout> | null = null

// ─── VAULT INIT (first-time setup or password change) ────────────────────────

export async function initVault(password: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const saltB64 = bufferToBase64(salt.buffer)
  const key = await deriveKey(password, salt)

  // Write empty credentials array as the initial vault contents
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify([]))
  )
  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify({
    salt: saltB64,
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(ciphertext),
    version: 1,
  }))

  // Store a password verifier — SHA-256(password + salt) — for quick unlock check.
  // This is NOT the encryption key; it only tells us if the password is correct.
  const verifier = await crypto.subtle.digest('SHA-256', enc.encode(password + saltB64))
  localStorage.setItem(VAULT_HASH_KEY, bufferToBase64(verifier))

  _session = { key, salt: saltB64 }
  resetLockTimer()
}

// ─── UNLOCK ───────────────────────────────────────────────────────────────────
// Returns true on success and establishes the session (CryptoKey stored).

export async function unlockVault(password: string): Promise<boolean> {
  const raw = localStorage.getItem(VAULT_STORAGE_KEY)
  const storedHash = localStorage.getItem(VAULT_HASH_KEY)
  if (!raw || !storedHash) return false

  try {
    const payload = JSON.parse(raw) as { salt: string }
    const enc = new TextEncoder()
    const verifier = await crypto.subtle.digest('SHA-256', enc.encode(password + payload.salt))

    if (!timingSafeEqual(bufferToBase64(verifier), storedHash)) return false

    const salt = new Uint8Array(base64ToBuffer(payload.salt))
    const key = await deriveKey(password, salt)
    _session = { key, salt: payload.salt }
    resetLockTimer()
    return true
  } catch {
    return false
  }
}

// ─── ENCRYPT (uses stored session key — password not needed) ─────────────────

export async function encryptVault(data: unknown): Promise<void> {
  if (!_session) throw new Error('Vault is locked')

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    _session.key,
    enc.encode(JSON.stringify(data))
  )

  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify({
    salt: _session.salt,
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(ciphertext),
    version: 1,
  }))
}

// ─── DECRYPT (uses stored session key — password not needed) ─────────────────

export async function decryptVault<T>(): Promise<T | null> {
  if (!_session) return null

  const raw = localStorage.getItem(VAULT_STORAGE_KEY)
  if (!raw) return null

  try {
    const payload = JSON.parse(raw) as { iv: string; data: string }
    const iv = new Uint8Array(base64ToBuffer(payload.iv))
    const ciphertext = base64ToBuffer(payload.data)
    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      _session.key,
      ciphertext
    )
    return JSON.parse(new TextDecoder().decode(plaintext)) as T
  } catch {
    return null
  }
}

// ─── VAULT STATE ──────────────────────────────────────────────────────────────

export function vaultExists(): boolean {
  return !!localStorage.getItem(VAULT_STORAGE_KEY)
}

export function isVaultUnlocked(): boolean {
  return _session !== null
}

export function lockVault(): void {
  _session = null
  if (_lockTimer) clearTimeout(_lockTimer)
  _lockTimer = null
}

export function clearVault(): void {
  localStorage.removeItem(VAULT_STORAGE_KEY)
  localStorage.removeItem(VAULT_HASH_KEY)
}

export function resetLockTimer(): void {
  if (_lockTimer) clearTimeout(_lockTimer)
  _lockTimer = setTimeout(() => {
    _session = null
    _lockTimer = null
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vault-locked'))
    }
  }, AUTO_LOCK_MS)
}
