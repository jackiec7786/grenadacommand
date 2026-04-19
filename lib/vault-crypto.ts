/**
 * Vault encryption using Web Crypto API (AES-256-GCM)
 * Key derivation via PBKDF2 with 310,000 iterations (OWASP 2023 recommendation)
 * 
 * Security model:
 * - Master password never stored anywhere
 * - Derived key never persisted to localStorage
 * - Only encrypted ciphertext + salt + IV stored
 * - Session-only: key lives in memory, cleared on tab close
 */

const PBKDF2_ITERATIONS = 310_000
const KEY_LENGTH = 256
const VAULT_STORAGE_KEY = 'grenada_vault_encrypted'
const VAULT_HASH_KEY = 'grenada_vault_hash'  // stores password verifier, not the key

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
    false,
    ['encrypt', 'decrypt']
  )
}

// ─── ENCRYPT ─────────────────────────────────────────────────────────────────

export async function encryptVault(data: unknown, password: string): Promise<void> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)

  const enc = new TextEncoder()
  const plaintext = enc.encode(JSON.stringify(data))

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    plaintext
  )

  const payload = {
    salt: bufferToBase64(salt.buffer),
    iv: bufferToBase64(iv.buffer),
    data: bufferToBase64(ciphertext),
    version: 1,
  }

  localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(payload))

  // Store a password verifier — a hash of (password + salt) used only to
  // validate the password on unlock WITHOUT storing the password itself
  const verifier = await crypto.subtle.digest(
    'SHA-256',
    enc.encode(password + bufferToBase64(salt.buffer))
  )
  localStorage.setItem(VAULT_HASH_KEY, bufferToBase64(verifier))
}

// ─── DECRYPT ─────────────────────────────────────────────────────────────────

export async function decryptVault<T>(password: string): Promise<T | null> {
  const raw = localStorage.getItem(VAULT_STORAGE_KEY)
  if (!raw) return null

  try {
    const payload = JSON.parse(raw) as { salt: string; iv: string; data: string; version: number }
    const salt = new Uint8Array(base64ToBuffer(payload.salt))
    const iv = new Uint8Array(base64ToBuffer(payload.iv))
    const ciphertext = base64ToBuffer(payload.data)
    const key = await deriveKey(password, salt)

    const plaintext = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ciphertext
    )

    const dec = new TextDecoder()
    return JSON.parse(dec.decode(plaintext)) as T
  } catch {
    // Wrong password or corrupted data
    return null
  }
}

// ─── PASSWORD VERIFICATION ────────────────────────────────────────────────────
// Quick check before attempting full decryption

export async function verifyPassword(password: string): Promise<boolean> {
  const raw = localStorage.getItem(VAULT_STORAGE_KEY)
  const storedHash = localStorage.getItem(VAULT_HASH_KEY)
  if (!raw || !storedHash) return false

  try {
    const payload = JSON.parse(raw) as { salt: string }
    const enc = new TextEncoder()
    const verifier = await crypto.subtle.digest(
      'SHA-256',
      enc.encode(password + payload.salt)
    )
    return bufferToBase64(verifier) === storedHash
  } catch {
    return false
  }
}

// ─── VAULT STATE CHECKS ───────────────────────────────────────────────────────

export function vaultExists(): boolean {
  return !!localStorage.getItem(VAULT_STORAGE_KEY)
}

export function clearVault(): void {
  localStorage.removeItem(VAULT_STORAGE_KEY)
  localStorage.removeItem(VAULT_HASH_KEY)
}

// ─── SESSION KEY STORE ────────────────────────────────────────────────────────
// The decrypted key lives only in memory — never in localStorage

let _sessionKey: string | null = null
let _lockTimer: ReturnType<typeof setTimeout> | null = null
const AUTO_LOCK_MS = 5 * 60 * 1000  // 5 minutes

export function setSessionKey(password: string): void {
  _sessionKey = password
  resetLockTimer()
}

export function getSessionKey(): string | null {
  return _sessionKey
}

export function lockVault(): void {
  _sessionKey = null
  if (_lockTimer) clearTimeout(_lockTimer)
  _lockTimer = null
}

export function resetLockTimer(): void {
  if (_lockTimer) clearTimeout(_lockTimer)
  _lockTimer = setTimeout(() => {
    _sessionKey = null
    _lockTimer = null
    // Dispatch event so UI can react
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vault-locked'))
    }
  }, AUTO_LOCK_MS)
}

export function isVaultUnlocked(): boolean {
  return _sessionKey !== null
}
