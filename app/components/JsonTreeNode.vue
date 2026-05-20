<script setup lang="ts">
const props = defineProps<{
  name?: string | number
  value: unknown
  path: string
  depth?: number
}>()

const depth = computed(() => props.depth ?? 0)

const indentCh = inject<ComputedRef<number>>(
  'jsonTreeIndentCh',
  () => computed(() => 2),
)

const depthPadding = computed(() => `${depth.value * indentCh.value}ch`)

const collapsed = inject<Ref<Set<string>>>('jsonTreeCollapsed')!
const togglePath = inject<(path: string) => void>('jsonTreeToggle')!

const isExpandable = computed(
  () => props.value !== null && typeof props.value === 'object',
)

const isCollapsed = computed(() => collapsed.value.has(props.path))

const childEntries = computed(() => {
  if (!isExpandable.value) return []
  if (Array.isArray(props.value)) {
    return (props.value as unknown[]).map((item, index) => ({
      key: index,
      value: item,
      path: `${props.path}[${index}]`,
    }))
  }
  return Object.entries(props.value as Record<string, unknown>).map(
    ([key, value]) => ({
      key,
      value,
      path: `${props.path}.${key}`,
    }),
  )
})

const bracketOpen = computed(() => (Array.isArray(props.value) ? '[' : '{'))
const bracketClose = computed(() => (Array.isArray(props.value) ? ']' : '}'))

const summaryLabel = computed(() => {
  if (Array.isArray(props.value)) {
    return `${(props.value as unknown[]).length} item${(props.value as unknown[]).length === 1 ? '' : 's'}`
  }
  const count = Object.keys(props.value as object).length
  return `${count} key${count === 1 ? '' : 's'}`
})

function formatKey(key: string | number): string {
  if (typeof key === 'number') return String(key)
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(key) ? key : JSON.stringify(key)
}

function formatPrimitive(value: unknown): string {
  if (value === null) return 'null'
  if (typeof value === 'string') return JSON.stringify(value)
  return String(value)
}

function valueTypeClass(value: unknown): string {
  if (value === null) return 'json-tree-null'
  switch (typeof value) {
    case 'string':
      return 'json-tree-string'
    case 'number':
      return 'json-tree-number'
    case 'boolean':
      return 'json-tree-boolean'
    default:
      return ''
  }
}
</script>

<template>
  <div class="json-tree-node">
    <div
      v-if="isExpandable"
      class="json-tree-branch"
      :style="{ paddingLeft: depthPadding }"
    >
      <button
        type="button"
        class="json-tree-toggle"
        :aria-expanded="!isCollapsed"
        @click="togglePath(path)"
      >
        <span class="json-tree-caret" aria-hidden="true">{{ isCollapsed ? '▶' : '▼' }}</span>
        <span v-if="name !== undefined" class="json-tree-key">{{ formatKey(name) }}:</span>
        <span class="json-tree-meta">{{ bracketOpen }}</span>
        <span v-if="isCollapsed" class="json-tree-ellipsis"> … </span>
        <span v-if="isCollapsed" class="json-tree-summary">{{ summaryLabel }}</span>
        <span v-if="isCollapsed" class="json-tree-meta">{{ bracketClose }}</span>
      </button>
      <div v-show="!isCollapsed" class="json-tree-children">
        <JsonTreeNode
          v-for="child in childEntries"
          :key="child.path"
          :name="child.key"
          :value="child.value"
          :path="child.path"
          :depth="depth + 1"
        />
        <div
          class="json-tree-close"
          :style="{ paddingLeft: depthPadding }"
        >
          <span class="json-tree-meta">{{ bracketClose }}</span>
        </div>
      </div>
    </div>

    <div
      v-else
      class="json-tree-leaf"
      :style="{ paddingLeft: depthPadding }"
    >
      <span v-if="name !== undefined" class="json-tree-key">{{ formatKey(name) }}:</span>
      <span class="json-tree-value" :class="valueTypeClass(value)">{{ formatPrimitive(value) }}</span>
    </div>
  </div>
</template>

<style scoped>
.json-tree-node {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.55;
}

.json-tree-toggle {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.25rem;
  width: 100%;
  padding: 0.1rem 0;
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
}

.json-tree-toggle:hover {
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}

.json-tree-caret {
  width: 0.85rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

.json-tree-key {
  color: var(--jwt-payload);
}

.json-tree-meta {
  color: var(--text-muted);
}

.json-tree-ellipsis,
.json-tree-summary {
  color: var(--text-subtle);
}

.json-tree-leaf {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding: 0.1rem 0;
}

.json-tree-value.json-tree-string {
  color: var(--success);
}

.json-tree-value.json-tree-number {
  color: var(--jwt-header);
}

.json-tree-value.json-tree-boolean {
  color: var(--accent);
}

.json-tree-value.json-tree-null {
  color: var(--text-muted);
  font-style: italic;
}

.json-tree-close {
  padding-top: 0.1rem;
}
</style>
