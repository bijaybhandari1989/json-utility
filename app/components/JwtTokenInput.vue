<script setup lang="ts">
import { renderColoredJwtHtml } from '~/utils/jwtSegments'
import { asJwtString } from '~/utils/string'

const model = defineModel<string>({ required: true })

const tokenText = computed({
  get: () => asJwtString(model.value),
  set: (value: string) => {
    model.value = asJwtString(value)
  },
})

const coloredHtml = computed(() => renderColoredJwtHtml(tokenText.value))
</script>

<template>
  <div class="jwt-token-wrap">
    <div class="jwt-legend" aria-hidden="true">
      <span class="jwt-legend-chip jwt-header">Header</span>
      <span class="jwt-legend-chip jwt-payload">Payload</span>
      <span class="jwt-legend-chip jwt-signature">Signature</span>
    </div>
    <div class="jwt-editor-stack">
      <pre
        class="jwt-colored-mirror"
        aria-hidden="true"
        v-html="coloredHtml"
      />
      <textarea
        v-model="tokenText"
        class="jwt-textarea-overlay"
        placeholder="Paste a JWT here — it decodes automatically"
        spellcheck="false"
        rows="6"
      />
    </div>
  </div>
</template>

<style scoped>
.jwt-token-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.jwt-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.jwt-legend-chip {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.jwt-legend-chip.jwt-header {
  color: var(--jwt-header);
  background: color-mix(in srgb, var(--jwt-header) 14%, transparent);
}

.jwt-legend-chip.jwt-payload {
  color: var(--jwt-payload);
  background: color-mix(in srgb, var(--jwt-payload) 14%, transparent);
}

.jwt-legend-chip.jwt-signature {
  color: var(--jwt-signature);
  background: color-mix(in srgb, var(--jwt-signature) 14%, transparent);
}

.jwt-editor-stack {
  position: relative;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--bg-elevated);
  min-height: 5.5rem;
}

.jwt-editor-stack:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.jwt-colored-mirror,
.jwt-textarea-overlay {
  margin: 0;
  padding: 0.65rem;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.55;
  word-break: break-all;
  white-space: pre-wrap;
  border: none;
  border-radius: var(--radius);
}

.jwt-colored-mirror {
  min-height: 5.5rem;
  pointer-events: none;
}

.jwt-textarea-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  resize: vertical;
  color: transparent;
  caret-color: var(--text);
  background: transparent;
  outline: none;
}

.jwt-colored-mirror :deep(.jwt-part) {
  font-weight: 500;
}

.jwt-colored-mirror :deep(.jwt-header) {
  color: var(--jwt-header);
}

.jwt-colored-mirror :deep(.jwt-payload) {
  color: var(--jwt-payload);
}

.jwt-colored-mirror :deep(.jwt-part.jwt-signature) {
  color: var(--jwt-signature);
}

.jwt-colored-mirror :deep(.jwt-dot) {
  color: var(--text-muted);
  font-weight: 700;
}
</style>
