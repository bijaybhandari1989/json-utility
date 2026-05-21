<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text: string
    label?: string
    disabled?: boolean
    /** Icon-only control for tight toolbars */
    iconOnly?: boolean
  }>(),
  {
    label: 'Copy',
    disabled: false,
    iconOnly: false,
  },
)

const copied = ref(false)
const { copy, isSupported } = useClipboard()

const isDisabled = computed(
  () => props.disabled || !props.text?.trim() || !isSupported.value,
)

const ariaLabel = computed(() => {
  if (!isSupported.value) return 'Clipboard not supported'
  if (copied.value) return 'Copied to clipboard'
  return props.iconOnly ? `Copy ${props.label}` : undefined
})

let resetTimer: ReturnType<typeof setTimeout> | undefined

async function onCopy() {
  if (isDisabled.value) return
  await copy(props.text)
  copied.value = true
  if (resetTimer) clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    copied.value = false
  }, 1800)
}

onUnmounted(() => {
  if (resetTimer) clearTimeout(resetTimer)
})
</script>

<template>
  <button
    type="button"
    class="copy-btn"
    :class="{
      'copy-btn--copied': copied,
      'copy-btn--icon-only': iconOnly,
    }"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :title="
      isSupported
        ? copied
          ? 'Copied'
          : 'Copy to clipboard'
        : 'Clipboard not supported'
    "
    @click="onCopy"
  >
    <span class="copy-btn__icon" aria-hidden="true">
      <Transition name="copy-icon" mode="out-in">
        <svg
          v-if="copied"
          key="check"
          class="copy-btn__svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
        <svg
          v-else
          key="copy"
          class="copy-btn__svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </Transition>
    </span>
    <Transition v-if="!iconOnly" name="copy-label" mode="out-in">
      <span :key="copied ? 'copied' : 'copy'" class="copy-btn__label">
        {{ copied ? 'Copied' : label }}
      </span>
    </Transition>
    <span v-if="iconOnly" class="sr-only">
      {{ copied ? 'Copied' : label }}
    </span>
  </button>
</template>

<style scoped>
.copy-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2rem;
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.copy-btn:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--border-strong);
  background: var(--surface-2);
  box-shadow: var(--shadow-sm);
}

.copy-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.copy-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.copy-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.copy-btn--copied:not(:disabled) {
  color: var(--success);
  border-color: color-mix(in srgb, var(--success) 35%, var(--border));
  background: var(--success-soft);
}

.copy-btn--copied:not(:disabled):hover {
  color: var(--success);
  border-color: color-mix(in srgb, var(--success) 50%, var(--border-strong));
  background: var(--success-soft);
}

.copy-btn--icon-only {
  padding: 0.4rem;
  min-width: 2rem;
}

.copy-btn__icon {
  display: flex;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
}

.copy-btn__svg {
  width: 100%;
  height: 100%;
}

.copy-btn__label {
  white-space: nowrap;
}

.copy-icon-enter-active,
.copy-icon-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.copy-icon-enter-from,
.copy-icon-leave-to {
  opacity: 0;
  transform: scale(0.75);
}

.copy-label-enter-active,
.copy-label-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.copy-label-enter-from,
.copy-label-leave-to {
  opacity: 0;
  transform: translateY(2px);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
