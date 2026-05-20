export const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

export const SAMPLE_JSON = JSON.stringify(
  {
    sub: '1234567890',
    name: 'John Doe',
    iat: 1516239022,
    roles: ['user', 'admin'],
  },
  null,
  2,
)
