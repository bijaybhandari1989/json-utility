import { JWT_ALGORITHM_SAMPLES } from '~/constants/jwtSamples.generated'

export const SAMPLE_JWT = JWT_ALGORITHM_SAMPLES.HS256.jwt

export const SAMPLE_SECRET = JWT_ALGORITHM_SAMPLES.HS256.hmacSecret!

export const SAMPLE_JSON = JSON.stringify(
  {
    sub: 'user_8f3a2b1c',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    roles: ['user', 'admin'],
    iat: 1779285924,
    nbf: 1779285924,
    exp: 1779424927,
    metadata: {
      plan: 'pro',
      region: 'us-east-1',
    },
  },
  null,
  2,
)
