import type { JsonFormatOption, JsonFormatStyle } from '~/types/jsonFormat'

export interface JsonFormatResult {
  output: string
  error: string
}

export interface JsonFormatValueResult {
  data: unknown
  text: string
  error: string
  option: JsonFormatOption
}

export const JSON_FORMAT_OPTIONS: JsonFormatOption[] = [
  {
    id: 'pretty',
    label: 'Pretty (2 spaces)',
    description: 'Indented tree view; copy uses 2-space JSON',
    sortKeys: false,
    collapse: 'expanded',
    showMinifiedPreview: false,
    showFormattedPreview: true,
    indent: 2,
  },
  {
    id: 'tab',
    label: 'Tab',
    description: 'Tab-indented preview and tree; copy uses tab-indented JSON',
    sortKeys: false,
    collapse: 'expanded',
    showMinifiedPreview: false,
    showFormattedPreview: true,
    indent: 4,
  },
  {
    id: 'pretty-collapsed',
    label: 'Pretty (collapsed)',
    description: 'Tree collapsed by default; copy uses 2-space JSON',
    sortKeys: false,
    collapse: 'collapsed',
    showMinifiedPreview: false,
    showFormattedPreview: true,
    indent: 2,
  },
  {
    id: 'tab-collapsed',
    label: 'Tab (collapsed)',
    description: 'Tab-indented preview, collapsed tree; copy uses tab-indented JSON',
    sortKeys: false,
    collapse: 'collapsed',
    showMinifiedPreview: false,
    showFormattedPreview: true,
    indent: 4,
  },
  {
    id: 'sorted-pretty',
    label: 'Sorted keys (pretty)',
    description: 'Sorted keys in tree; copy uses 2-space JSON',
    sortKeys: true,
    collapse: 'expanded',
    showMinifiedPreview: false,
    showFormattedPreview: true,
    indent: 2,
  },
  {
    id: 'sorted-pretty-collapsed',
    label: 'Sorted keys (collapsed)',
    description: 'Sorted keys, tree collapsed; copy uses 2-space JSON',
    sortKeys: true,
    collapse: 'collapsed',
    showMinifiedPreview: false,
    showFormattedPreview: true,
    indent: 2,
  },
  {
    id: 'minify',
    label: 'Minify',
    description: 'Collapsible tree plus minified single-line preview',
    sortKeys: false,
    collapse: 'expanded',
    showMinifiedPreview: true,
    showFormattedPreview: false,
    indent: 0,
  },
  {
    id: 'sorted-minify',
    label: 'Sorted keys (minify)',
    description: 'Sorted keys in tree plus minified preview',
    sortKeys: true,
    collapse: 'expanded',
    showMinifiedPreview: true,
    showFormattedPreview: false,
    indent: 0,
  },
  {
    id: 'sorted-minify-collapsed',
    label: 'Sorted minify (collapsed)',
    description: 'Sorted keys, collapsed tree, minified preview',
    sortKeys: true,
    collapse: 'collapsed',
    showMinifiedPreview: true,
    showFormattedPreview: false,
    indent: 0,
  },
]

const optionById = Object.fromEntries(
  JSON_FORMAT_OPTIONS.map((option) => [option.id, option]),
) as Record<JsonFormatStyle, JsonFormatOption>

export function getJsonFormatOption(style: JsonFormatStyle): JsonFormatOption {
  return optionById[style]
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys)
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    return Object.keys(record)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys(record[key])
        return acc
      }, {})
  }
  return value
}

function stringifyValue(data: unknown, indent: 0 | 2 | 4): string {
  if (indent === 0) {
    return JSON.stringify(data)
  }
  return JSON.stringify(data, null, indent)
}

export function formatJsonValue(
  input: string,
  style: JsonFormatStyle,
): JsonFormatValueResult {
  const option = getJsonFormatOption(style)
  const trimmed = input.trim()

  if (!trimmed) {
    return { data: null, text: '', error: '', option }
  }

  try {
    let data: unknown = JSON.parse(trimmed)
    if (option.sortKeys) {
      data = sortKeys(data)
    }
    const text = stringifyValue(data, option.indent)
    return { data, text, error: '', option }
  } catch (e) {
    return {
      data: null,
      text: '',
      error: e instanceof Error ? e.message : 'Invalid JSON',
      option,
    }
  }
}

export function formatJsonText(
  input: string,
  style: JsonFormatStyle,
): JsonFormatResult {
  const result = formatJsonValue(input, style)
  return { output: result.text, error: result.error }
}
