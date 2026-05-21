const JWT_TIME_CLAIMS = new Set(['iat', 'exp', 'nbf'])

/** Earliest: 1990-01-01 UTC. Latest: 2100-01-01 UTC */
const MIN_UNIX_SECONDS = 631_152_000
const MAX_UNIX_SECONDS = 4_102_444_800

function formatUnixDate(seconds: number): string {
  const date = new Date(seconds * 1000)
  if (Number.isNaN(date.getTime())) return ''

  // dateStyle/timeStyle cannot be combined with timeZoneName in Node/V8 Intl.
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  }).format(date)
}

function isPlausibleUnixSeconds(seconds: number): boolean {
  return (
    Number.isInteger(seconds) &&
    seconds >= MIN_UNIX_SECONDS &&
    seconds <= MAX_UNIX_SECONDS
  )
}

/** Normalize seconds or milliseconds to whole Unix seconds, or null if not numeric. */
export function parseUnixTimestamp(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null

  let n: number
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    n = value
  } else if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!/^-?\d+(\.\d+)?$/.test(trimmed)) return null
    n = Number(trimmed)
    if (!Number.isFinite(n)) return null
  } else {
    return null
  }

  const absStr = String(Math.trunc(Math.abs(n)))
  if (absStr.length >= 13) {
    return Math.trunc(n / 1000)
  }

  return Math.trunc(n)
}

/**
 * Human-readable datetime for tooltips on JWT time claims (iat, exp, nbf)
 * and other values that look like Unix timestamps.
 */
export function getUnixTimestampTooltip(
  key: string | number | undefined,
  value: unknown,
): string | null {
  const seconds = parseUnixTimestamp(value)
  if (seconds === null) return null

  const keyName = typeof key === 'string' ? key.trim().toLowerCase() : ''

  if (JWT_TIME_CLAIMS.has(keyName)) {
    const formatted = formatUnixDate(seconds)
    return formatted || null
  }

  if (isPlausibleUnixSeconds(seconds)) {
    const formatted = formatUnixDate(seconds)
    return formatted || null
  }

  return null
}

export function isUnixTimestampDisplay(
  key: string | number | undefined,
  value: unknown,
): boolean {
  return getUnixTimestampTooltip(key, value) !== null
}
