import type { ClaimValueType, PayloadClaim } from '~/types/payload'

export function newClaimId() {
  return crypto.randomUUID()
}

export function createClaim(
  key = '',
  value = '',
  type: ClaimValueType = 'string',
): PayloadClaim {
  return { id: newClaimId(), key, value, type }
}

export function getDefaultPayloadObject(): Record<string, unknown> {
  return {
    sub: '1234567890',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000),
  }
}

export function objectToClaims(obj: Record<string, unknown>): PayloadClaim[] {
  return Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'number') {
      return createClaim(key, String(value), 'number')
    }
    if (typeof value === 'boolean') {
      return createClaim(key, String(value), 'boolean')
    }
    if (value === null) {
      return createClaim(key, '', 'null')
    }
    if (typeof value === 'object') {
      return createClaim(key, JSON.stringify(value), 'json')
    }
    return createClaim(key, String(value ?? ''), 'string')
  })
}

export function claimsToObject(claims: PayloadClaim[]): Record<string, unknown> {
  const obj: Record<string, unknown> = {}

  for (const claim of claims) {
    const key = claim.key.trim()
    if (!key) continue

    switch (claim.type) {
      case 'number': {
        const num = Number(claim.value)
        if (Number.isNaN(num)) {
          throw new Error(`"${key}" must be a valid number`)
        }
        obj[key] = num
        break
      }
      case 'boolean':
        obj[key] = claim.value === 'true'
        break
      case 'null':
        obj[key] = null
        break
      case 'json': {
        try {
          obj[key] = JSON.parse(claim.value || 'null')
        } catch {
          throw new Error(`"${key}" must be valid JSON`)
        }
        break
      }
      default:
        obj[key] = claim.value
    }
  }

  return obj
}
