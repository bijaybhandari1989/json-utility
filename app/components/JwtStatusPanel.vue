<script setup lang="ts">
defineProps<{
  jwtValid: boolean
  signatureVerified: boolean
  visible: boolean
}>()
</script>

<template>
  <div v-if="visible" class="jwt-status" role="status" aria-live="polite">
    <div class="status-chip" :class="jwtValid ? 'ok' : 'bad'">
      <span class="status-dot" aria-hidden="true" />
      {{ jwtValid ? 'Valid JWT' : 'Invalid JWT' }}
    </div>
    <div class="status-chip" :class="signatureVerified ? 'ok' : 'bad'">
      <span class="status-dot" aria-hidden="true" />
      {{ signatureVerified ? 'Signature Verified' : 'Signature Not Verified' }}
    </div>
  </div>
</template>

<style scoped>
.jwt-status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
}

.status-chip.ok {
  background: var(--success-soft);
  color: var(--success);
}

.status-chip.bad {
  background: var(--danger-soft);
  color: var(--danger);
}
</style>
