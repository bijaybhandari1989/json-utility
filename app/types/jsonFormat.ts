export type JsonFormatStyle =
  | 'pretty'
  | 'tab'
  | 'minify'
  | 'sorted-pretty'
  | 'sorted-minify'
  | 'pretty-collapsed'
  | 'tab-collapsed'
  | 'sorted-pretty-collapsed'
  | 'sorted-minify-collapsed'

export type JsonTreeCollapseDefault = 'expanded' | 'collapsed'

export interface JsonFormatOption {
  id: JsonFormatStyle
  label: string
  description: string
  sortKeys: boolean
  collapse: JsonTreeCollapseDefault
  /** Show minified single-line preview above the tree */
  showMinifiedPreview: boolean
  /** Show pretty-printed JSON preview above the tree */
  showFormattedPreview: boolean
  indent: 0 | 2 | 4
}
