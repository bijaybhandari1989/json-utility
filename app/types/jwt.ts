export type { JwtAlgorithm } from '~/constants/jwtAlgorithms'
export type KeyFormat = 'text' | 'pem' | 'base64'
export type KeyRole = 'secret' | 'private' | 'public'

export interface VerifyResult {
  valid: boolean
  error?: string
}
