<script setup lang="ts">
import { SAMPLE_JSON } from '~/constants/samples'
import type { JsonFormatStyle } from '~/types/jsonFormat'
import { JSON_FORMAT_OPTIONS, formatJsonValue } from '~/utils/jsonFormat'

const jsonInput = ref(SAMPLE_JSON)
const style = ref<JsonFormatStyle>('pretty')

const formatted = computed(() => formatJsonValue(jsonInput.value, style.value))

const hasInput = computed(() => jsonInput.value.trim().length > 0)
const canCopy = computed(
  () => hasInput.value && !formatted.value.error && formatted.value.text.length > 0,
)

const showTree = computed(
  () => hasInput.value && !formatted.value.error && formatted.value.data !== null,
)

function loadSample() {
  jsonInput.value = SAMPLE_JSON
}

function clearAll() {
  jsonInput.value = ''
}
</script>

<template>
  <div class="format-workspace">
    <div class="toolbar">
      <button type="button" class="btn btn-ghost btn-sm" @click="loadSample">
        Load sample
      </button>
      <button type="button" class="btn btn-ghost btn-sm" @click="clearAll">
        Clear
      </button>
    </div>

    <div class="grid-format-split">
      <section class="card">
        <div class="card-header">
          <span class="card-title">JSON input</span>
        </div>
        <div class="card-body">
          <p class="hint-text format-hint">
            Paste any JSON — pick a format style to update the tree and copy text.
          </p>
          <textarea
            v-model="jsonInput"
            class="json-editor format-input"
            placeholder='{"key": "value"}'
            spellcheck="false"
            rows="12"
          />
        </div>
      </section>

      <section class="card format-output-card">
        <div class="card-header">
          <span class="card-title">Formatted output</span>
          <div class="card-actions format-output-actions">
            <div class="format-style-control">
              <span id="format-style-label" class="format-style-label">Format style</span>
              <select
                id="format-style"
                v-model="style"
                class="field-select format-style-select"
                aria-labelledby="format-style-label"
              >
                <option
                  v-for="option in JSON_FORMAT_OPTIONS"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <CopyButton
              :text="formatted.text"
              label="Copy"
              :disabled="!canCopy"
            />
          </div>
        </div>
        <div class="card-body format-output-body">
          <p v-if="formatted.option" class="hint-text format-style-hint">
            {{ formatted.option.description }}
          </p>
          <p v-if="!hasInput" class="hint-text empty-hint">
            Paste JSON to see formatted output.
          </p>
          <p v-else-if="formatted.error" class="error-text">
            {{ formatted.error }}
          </p>
          <template v-else-if="showTree">
            <pre
              v-if="formatted.option.showMinifiedPreview"
              class="json-minified-preview"
            >{{ formatted.text }}</pre>
            <pre
              v-if="formatted.option.showFormattedPreview"
              class="json-formatted-preview"
            >{{ formatted.text }}</pre>
            <CollapsibleJsonViewer
              :key="style"
              :data="formatted.data"
              :collapse-default="formatted.option.collapse"
              :indent-spaces="formatted.option.indent || 2"
            />
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.format-hint {
  margin: 0 0 0.75rem;
}

.format-input {
  min-height: 12rem;
}

.format-output-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 0.65rem;
}

@media (min-width: 960px) {
  .format-input {
    min-height: 28rem;
  }
}

.format-output-actions {
  flex-shrink: 0;
}

.format-style-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.format-style-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
}

.format-style-select {
  min-width: 12.5rem;
  max-width: min(18rem, 42vw);
}

.format-style-hint {
  margin: 0;
}

.empty-hint {
  margin: 0;
}

.json-minified-preview {
  margin: 0;
  padding: 0.55rem 0.65rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background-color: var(--editor-bg);
  color: var(--editor-fg);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
  flex-shrink: 0;
  max-height: 5rem;
  overflow: auto;
}

.json-formatted-preview {
  margin: 0;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background-color: var(--editor-bg);
  color: var(--editor-fg);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.45;
  white-space: pre;
  overflow: auto;
  flex-shrink: 0;
  max-height: 10rem;
  tab-size: 4;
}
</style>
