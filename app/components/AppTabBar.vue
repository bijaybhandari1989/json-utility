<script setup lang="ts">
import type { AppTab } from '~/composables/useJwtWorkbench'

const props = defineProps<{
  modelValue: AppTab
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AppTab]
}>()

const tabs: { id: AppTab; label: string }[] = [
  { id: 'decode', label: 'Decode JWT' },
  { id: 'encode', label: 'Encode JWT' },
  { id: 'format', label: 'Format JSON' },
]

function selectTab(id: AppTab) {
  if (props.modelValue !== id) {
    emit('update:modelValue', id)
  }
}
</script>

<template>
  <nav class="tab-bar" role="tablist" aria-label="JSON Utilities tools">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      role="tab"
      class="tab-btn"
      :class="{ active: modelValue === tab.id }"
      :aria-selected="modelValue === tab.id"
      @click="selectTab(tab.id)"
    >
      <svg
        v-if="tab.id === 'decode'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M4 7h16M4 12h10M4 17h14" stroke-linecap="round" />
        <circle cx="19" cy="17" r="3" />
      </svg>
      <svg
        v-else-if="tab.id === 'encode'"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        aria-hidden="true"
      >
        <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
      </svg>
      {{ tab.label }}
    </button>
  </nav>
</template>
