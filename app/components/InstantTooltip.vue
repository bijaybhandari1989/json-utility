<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()

const visible = ref(false)
const position = ref({ top: 0, left: 0 })

function updatePosition(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  position.value = {
    top: rect.top,
    left: rect.left + rect.width / 2,
  }
}

function show(el: HTMLElement) {
  if (!props.text) return
  updatePosition(el)
  visible.value = true
}

function hide() {
  visible.value = false
}

function onMouseEnter(event: MouseEvent) {
  show(event.currentTarget as HTMLElement)
}

function onMouseLeave() {
  hide()
}

function onFocusIn(event: FocusEvent) {
  show(event.currentTarget as HTMLElement)
}

function onFocusOut() {
  hide()
}
</script>

<template>
  <span
    class="instant-tooltip-anchor"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />
  </span>
  <Teleport to="body">
    <div
      v-if="visible && text"
      class="instant-tooltip-bubble"
      role="tooltip"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }"
    >
      {{ text }}
    </div>
  </Teleport>
</template>

<style scoped>
.instant-tooltip-anchor {
  display: inline;
  max-width: 100%;
}

.instant-tooltip-anchor:has(> input),
.instant-tooltip-anchor:has(> textarea),
.instant-tooltip-anchor:has(> select) {
  display: block;
  width: 100%;
}
</style>

<style>
.instant-tooltip-bubble {
  position: fixed;
  z-index: 9999;
  max-width: min(20rem, calc(100vw - 1.5rem));
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.35;
  white-space: nowrap;
  box-shadow: var(--shadow);
  pointer-events: none;
  transform: translate(-50%, calc(-100% - 8px));
  animation: instant-tooltip-in 0.1s ease-out;
}

@keyframes instant-tooltip-in {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% - 4px));
  }

  to {
    opacity: 1;
    transform: translate(-50%, calc(-100% - 8px));
  }
}
</style>
