export const JWT_ALGORITHMS = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
  'EdDSA',
] as const

export type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number]

export type JwtKeyFamily = 'hmac' | 'rsa' | 'ec' | 'eddsa'

export const JWT_ALGORITHM_LABELS: Record<JwtAlgorithm, string> = {
  HS256: 'HS256',
  HS384: 'HS384',
  HS512: 'HS512',
  RS256: 'RS256',
  RS384: 'RS384',
  RS512: 'RS512',
  ES256: 'ES256',
  ES384: 'ES384',
  ES512: 'ES512',
  PS256: 'PS256',
  PS384: 'PS384',
  PS512: 'PS512',
  EdDSA: 'EdDSA (Ed25519)',
}

export function getJwtAlgorithmLabel(alg: JwtAlgorithm): string {
  return JWT_ALGORITHM_LABELS[alg]
}

export function isSupportedJwtAlgorithm(value: string): value is JwtAlgorithm {
  return (JWT_ALGORITHMS as readonly string[]).includes(value)
}

export function getJwtKeyFamily(alg: JwtAlgorithm): JwtKeyFamily {
  if (alg.startsWith('HS')) return 'hmac'
  if (alg === 'EdDSA') return 'eddsa'
  if (alg.startsWith('ES')) return 'ec'
  return 'rsa'
}

export function isHmacAlgorithm(alg: JwtAlgorithm): boolean {
  return getJwtKeyFamily(alg) === 'hmac'
}

export function isAsymmetricAlgorithm(alg: JwtAlgorithm): boolean {
  return !isHmacAlgorithm(alg)
}
