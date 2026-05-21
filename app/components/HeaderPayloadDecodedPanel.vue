<script setup lang="ts">
import { formatJson } from '~/composables/useJwt'

const headerText = defineModel<string>({ required: true })

const props = defineProps<{
  payloadObject: Record<string, unknown>
  headerError?: string
}>()

const emit = defineEmits<{
  format: []
}>()

const payloadPreview = computed(() => formatJson(props.payloadObject))
</script>

<template>
  <section class="card decoded-panel">
    <div class="card-header">
      <span class="card-title">Header &amp; payload (JSON)</span>
    </div>

    <div class="card-body decoded-panel-body">
      <div class="decoded-block">
        <div class="decoded-block-header">
          <span class="decoded-block-label">Header</span>
          <div class="decoded-block-actions">
            <button type="button" class="btn btn-sm" @click="emit('format')">
              Format
            </button>
            <CopyButton :text="headerText" />
          </div>
        </div>
        <textarea
          v-model="headerText"
          class="json-editor"
          :class="{ invalid: headerError }"
          spellcheck="false"
        />
        <p v-if="headerError" class="error-text">{{ headerError }}</p>
      </div>

      <div class="decoded-block">
        <div class="decoded-block-header">
          <span class="decoded-block-label">Payload (read-only)</span>
          <CopyButton :text="payloadPreview" label="Copy JSON" />
        </div>
        <CollapsibleJsonViewer
          :data="payloadObject"
          :show-toolbar="false"
          class="decoded-payload-tree"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.decoded-panel-body {
  display: flex;
  flex-direction: column;
  gap: var(--stack-gap);
}

.decoded-block-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.decoded-block-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.decoded-block-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.decoded-payload-tree :deep(.json-tree-scroll) {
  min-height: 8rem;
  max-height: 20rem;
}
</style>
