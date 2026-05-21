export const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzhmM2EyYjFjIiwibmFtZSI6IkFsZXggUml2ZXJhIiwiZW1haWwiOiJhbGV4QGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciIsImFkbWluIl0sImlhdCI6MTc3OTI4NTkyNCwibmJmIjoxNzc5Mjg1OTI0LCJleHAiOjE3Nzk0MjQ5Mjd9.R1gxLSF0G9WMMXrY30ArKjpofiF-jyL2GeZkWknK_oY'

export const SAMPLE_SECRET = 'your-256-bit-secret'

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
