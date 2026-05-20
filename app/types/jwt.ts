export type JwtAlgorithm = 'HS256' | 'RS256'
export type KeyFormat = 'text' | 'pem' | 'base64'
export type KeyRole = 'secret' | 'private' | 'public'

export interface VerifyResult {
  valid: boolean
  error?: string
}
