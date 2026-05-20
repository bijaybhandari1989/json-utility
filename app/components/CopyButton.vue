<script setup lang="ts">
const props = defineProps<{
  text: string
  label?: string
}>()

const copied = ref(false)
const { copy, isSupported } = useClipboard()

async function onCopy() {
  if (!props.text || !isSupported.value) return
  await copy(props.text)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <button
    type="button"
    class="btn btn-sm"
    :disabled="!text || !isSupported"
    :title="isSupported ? 'Copy to clipboard' : 'Clipboard not supported'"
    @click="onCopy"
  >
    {{ copied ? 'Copied!' : (label ?? 'Copy') }}
  </button>
</template>
