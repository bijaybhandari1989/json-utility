import {
  isHmacAlgorithm,
  type JwtAlgorithm,
} from '~/constants/jwtAlgorithms'
import { JWT_ALGORITHM_SAMPLES } from '~/constants/jwtSamples.generated'
import type { KeyFormat, KeyRole } from '~/types/jwt'

export type { JwtAlgorithmSample } from '~/constants/jwtSamples.generated'
export { JWT_ALGORITHM_SAMPLES }

export function getJwtAlgorithmSample(algorithm: JwtAlgorithm) {
  return JWT_ALGORITHM_SAMPLES[algorithm]
}

export function getSampleKeyMaterial(
  algorithm: JwtAlgorithm,
  mode: 'encode' | 'decode',
): { keyMaterial: string; keyFormat: KeyFormat; keyRole: KeyRole } {
  const sample = getJwtAlgorithmSample(algorithm)

  if (isHmacAlgorithm(algorithm)) {
    return {
      keyMaterial: sample.hmacSecret ?? '',
      keyFormat: 'text',
      keyRole: 'secret',
    }
  }

  const signing = mode === 'encode'
  return {
    keyMaterial: signing
      ? (sample.privateKeyPem ?? '')
      : (sample.publicKeyPem ?? ''),
    keyFormat: 'pem',
    keyRole: signing ? 'private' : 'public',
  }
}
