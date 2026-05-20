import {
  SignJWT,
  base64url,
  decodeJwt,
  decodeProtectedHeader,
  importPKCS8,
  importSPKI,
  jwtVerify,
} from 'jose'
import type { JwtAlgorithm, KeyFormat, KeyRole, VerifyResult } from '~/types/jwt'
import { toPlainObject } from '~/utils/plain'
import { asJwtString } from '~/utils/string'

export { toPlainObject } from '~/utils/plain'

const DEFAULT_HEADER: Record<string, unknown> = {
  alg: 'HS256',
  typ: 'JWT',
}

const DEFAULT_PAYLOAD: Record<string, unknown> = {
  sub: '1234567890',
  name: 'John Doe',
  iat: Math.floor(Date.now() / 1000),
}

export function getDefaultHeader(alg: JwtAlgorithm = 'HS256') {
  return JSON.stringify({ ...DEFAULT_HEADER, alg }, null, 2)
}

export function getDefaultPayload() {
  return JSON.stringify(DEFAULT_PAYLOAD, null, 2)
}

export function parseJsonObject(text: string, label: string): Record<string, unknown> {
  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error(`${label} must be valid JSON`)
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object`)
  }
  return parsed as Record<string, unknown>
}

export function decodeTokenUnsafe(token: unknown) {
  const trimmed = asJwtString(token).trim()
  if (!trimmed) {
    throw new Error('JWT is empty')
  }
  const parts = trimmed.split('.')
  if (parts.length < 2) {
    throw new Error('Invalid JWT format')
  }
  return {
    header: toPlainObject(
      decodeProtectedHeader(trimmed) as Record<string, unknown>,
    ),
    payload: toPlainObject(decodeJwt(trimmed) as Record<string, unknown>),
  }
}

function resolveHmacSecret(secret: string, format: KeyFormat): Uint8Array {
  const value = secret.trim()
  if (!value) {
    throw new Error('Secret is required for HS256')
  }
  if (format === 'base64') {
    const normalized = value.replace(/\s/g, '')
    const binary = atob(normalized)
    return Uint8Array.from(binary, (c) => c.charCodeAt(0))
  }
  return new TextEncoder().encode(value)
}

async function resolveRsaKey(
  pem: string,
  algorithm: JwtAlgorithm,
  role: 'private' | 'public',
) {
  const value = pem.trim()
  if (!value) {
    throw new Error(`RSA ${role} key is required for ${algorithm}`)
  }
  if (role === 'private') {
    return importPKCS8(value, algorithm)
  }
  return importSPKI(value, algorithm)
}

function buildProtectedHeader(
  header: Record<string, unknown>,
  algorithm: JwtAlgorithm,
): Record<string, unknown> {
  const { alg: _ignored, ...rest } = header
  return {
    typ: 'JWT',
    ...rest,
    alg: algorithm,
  }
}

export function canSignToken(
  algorithm: JwtAlgorithm,
  keyMaterial: string,
  keyRole: KeyRole,
): boolean {
  if (!keyMaterial.trim()) return false
  if (algorithm === 'RS256' && keyRole !== 'private') return false
  return true
}

export function buildUnsignedToken(
  headerText: string,
  payload: Record<string, unknown>,
  algorithm: JwtAlgorithm,
): string {
  const header = parseJsonObject(headerText, 'Header')
  const protectedHeader = buildProtectedHeader(header, algorithm)
  const headerPart = base64url.encode(
    new TextEncoder().encode(JSON.stringify(protectedHeader)),
  )
  const payloadPart = base64url.encode(
    new TextEncoder().encode(JSON.stringify(toPlainObject(payload))),
  )
  return `${headerPart}.${payloadPart}.`
}

export async function encodeToken(
  headerText: string,
  payload: Record<string, unknown>,
  algorithm: JwtAlgorithm,
  keyMaterial: string,
  keyFormat: KeyFormat,
): Promise<string> {
  const header = parseJsonObject(headerText, 'Header')
  const protectedHeader = buildProtectedHeader(header, algorithm)

  const signer = new SignJWT(toPlainObject(payload)).setProtectedHeader(protectedHeader)

  if (algorithm === 'HS256') {
    const secret = resolveHmacSecret(keyMaterial, keyFormat)
    return signer.sign(secret)
  }

  const privateKey = await resolveRsaKey(keyMaterial, algorithm, 'private')
  return signer.sign(privateKey)
}

export async function syncTokenFromEditors(
  headerText: string,
  payload: Record<string, unknown>,
  algorithm: JwtAlgorithm,
  keyMaterial: string,
  keyFormat: KeyFormat,
  keyRole: KeyRole,
): Promise<{ token: string; signed: boolean }> {
  if (canSignToken(algorithm, keyMaterial, keyRole)) {
    const signed = await encodeToken(
      headerText,
      payload,
      algorithm,
      keyMaterial,
      keyFormat,
    )
    return { token: signed, signed: true }
  }
  return {
    token: buildUnsignedToken(headerText, payload, algorithm),
    signed: false,
  }
}

export async function verifyToken(
  token: string,
  algorithm: JwtAlgorithm,
  keyMaterial: string,
  keyFormat: KeyFormat,
  keyRole: KeyRole,
): Promise<VerifyResult> {
  const trimmed = asJwtString(token).trim()
  if (!trimmed) {
    return { valid: false, error: 'JWT is empty' }
  }
  if (!keyMaterial.trim()) {
    return { valid: false, error: 'No key provided for verification' }
  }

  try {
    if (algorithm === 'HS256') {
      const secret = resolveHmacSecret(keyMaterial, keyFormat)
      await jwtVerify(trimmed, secret, { algorithms: ['HS256'] })
      return { valid: true }
    }

    const role = keyRole === 'private' ? 'private' : 'public'
    const key = await resolveRsaKey(keyMaterial, algorithm, role)
    await jwtVerify(trimmed, key, { algorithms: ['RS256'] })
    return { valid: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed'
    return { valid: false, error: message }
  }
}

export function formatJson(value: unknown) {
  return JSON.stringify(toPlainObject(value), null, 2)
}
