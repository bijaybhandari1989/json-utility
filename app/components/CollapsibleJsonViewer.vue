<script setup lang="ts">
import type { JsonTreeCollapseDefault } from '~/types/jsonFormat'

const props = withDefaults(
  defineProps<{
    data: unknown
    collapseDefault?: JsonTreeCollapseDefault
    /** Characters of indent per tree depth (2 or 4) */
    indentSpaces?: number
  }>(),
  {
    indentSpaces: 2,
  },
)

const collapsed = ref(new Set<string>())

provide('jsonTreeCollapsed', collapsed)
provide(
  'jsonTreeIndentCh',
  computed(() => props.indentSpaces),
)

function togglePath(path: string) {
  const next = new Set(collapsed.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  collapsed.value = next
}

provide('jsonTreeToggle', togglePath)

function collectPaths(value: unknown, path = 'root'): string[] {
  if (value === null || typeof value !== 'object') {
    return []
  }

  const paths = [path]

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      paths.push(...collectPaths(item, `${path}[${index}]`))
    })
  } else {
    for (const [key, item] of Object.entries(
      value as Record<string, unknown>,
    )) {
      paths.push(...collectPaths(item, `${path}.${key}`))
    }
  }

  return paths
}

function expandAll() {
  collapsed.value = new Set()
}

function collapseAll() {
  const paths = collectPaths(props.data)
  collapsed.value = new Set(paths)
}

function applyCollapseDefault() {
  if (props.collapseDefault === 'collapsed') {
    collapseAll()
  } else {
    expandAll()
  }
}

watch(
  () => [props.data, props.collapseDefault] as const,
  () => {
    applyCollapseDefault()
  },
  { immediate: true, deep: true },
)

defineExpose({ expandAll, collapseAll })
</script>

<template>
  <div class="json-tree-viewer">
    <div class="json-tree-toolbar">
      <button type="button" class="btn btn-sm" @click="expandAll">
        Expand all
      </button>
      <button type="button" class="btn btn-sm" @click="collapseAll">
        Collapse all
      </button>
    </div>
    <div class="json-tree-scroll">
      <JsonTreeNode :value="data" path="root" :depth="0" />
    </div>
  </div>
</template>

<style scoped>
.json-tree-viewer {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 0.5rem;
}

.json-tree-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  flex-shrink: 0;
}

.json-tree-scroll {
  flex: 1;
  min-height: 12rem;
  overflow: auto;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background-color: var(--editor-bg);
  color: var(--editor-fg);
}

@media (min-width: 960px) {
  .json-tree-scroll {
    min-height: 28rem;
  }
}
</style>
