export type ClaimValueType = 'string' | 'number' | 'boolean' | 'null' | 'json'

export interface PayloadClaim {
  id: string
  key: string
  value: string
  type: ClaimValueType
}
