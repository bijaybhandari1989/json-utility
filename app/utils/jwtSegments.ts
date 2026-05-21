export interface JwtSegments {
  header: string
  payload: string
  signature: string
  hasSignature: boolean
}

export function splitJwt(token: unknown): JwtSegments | null {
  if (typeof token !== 'string') return null
  const trimmed = token.trim().replace(/\s/g, '')
  if (!trimmed) return null

  const firstDot = trimmed.indexOf('.')
  if (firstDot === -1) {
    return { header: trimmed, payload: '', signature: '', hasSignature: false }
  }

  const secondDot = trimmed.indexOf('.', firstDot + 1)
  if (secondDot === -1) {
    return {
      header: trimmed.slice(0, firstDot),
      payload: trimmed.slice(firstDot + 1),
      signature: '',
      hasSignature: false,
    }
  }

  const signature = trimmed.slice(secondDot + 1)
  return {
    header: trimmed.slice(0, firstDot),
    payload: trimmed.slice(firstDot + 1, secondDot),
    signature,
    hasSignature: signature.length > 0,
  }
}

export function joinJwt(segments: JwtSegments): string {
  if (!segments.hasSignature && !segments.signature) {
    return segments.payload
      ? `${segments.header}.${segments.payload}.`
      : segments.header
  }
  return `${segments.header}.${segments.payload}.${segments.signature}`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function renderColoredJwtHtml(token: unknown): string {
  const segments = splitJwt(token)
  if (!segments) return ''

  const header = escapeHtml(segments.header)

  if (!segments.payload) {
    return `<span class="jwt-part jwt-header">${header}</span>`
  }

  const payload = escapeHtml(segments.payload)
  const signaturePart = segments.hasSignature
    ? `<span class="jwt-part jwt-signature">${escapeHtml(segments.signature)}</span>`
    : '<span class="jwt-part jwt-signature jwt-signature-empty">(no signature)</span>'

  return [
    `<span class="jwt-part jwt-header">${header}</span>`,
    '<span class="jwt-dot">.</span>',
    `<span class="jwt-part jwt-payload">${payload}</span>`,
    '<span class="jwt-dot">.</span>',
    signaturePart,
  ].join('')
}
