import { isRef, toRaw, unref } from 'vue'

function deepToPlain(value: unknown): unknown {
  const raw = unref(value)

  if (raw === null || typeof raw !== 'object') {
    return raw
  }

  if (isRef(raw)) {
    return deepToPlain(unref(raw))
  }

  if (Array.isArray(raw)) {
    return raw.map((item) => deepToPlain(item))
  }

  const obj = toRaw(raw) as Record<string, unknown>
  const out: Record<string, unknown> = {}

  for (const key of Object.keys(obj)) {
    const entry = obj[key]
    if (typeof entry === 'function' || isRef(entry)) {
      continue
    }
    out[key] = deepToPlain(entry)
  }

  return out
}

export function toPlainObject<T = Record<string, unknown>>(value: unknown): T {
  return deepToPlain(value) as T
}

export function snapshotJson(value: unknown): string {
  return JSON.stringify(deepToPlain(value))
}
