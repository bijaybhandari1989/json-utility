<script setup lang="ts">
const model = defineModel<string>({ required: true })

defineProps<{
  title: string
  error?: string
}>()

const emit = defineEmits<{
  format: []
}>()
</script>

<template>
  <section class="card">
    <div class="card-header">
      <span class="card-title">{{ title }}</span>
      <div class="card-actions">
        <slot name="actions" />
        <button type="button" class="btn btn-sm" @click="emit('format')">
          Format
        </button>
        <CopyButton :text="model" />
      </div>
    </div>
    <div class="card-body">
      <textarea
        v-model="model"
        class="json-editor"
        :class="{ invalid: error }"
        spellcheck="false"
      />
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </section>
</template>

<style scoped>
.card-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
</style>
