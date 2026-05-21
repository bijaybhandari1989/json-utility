<script setup lang="ts">
import type { ClaimValueType, PayloadClaim } from '~/types/payload'
import {
  claimsToObject,
  createClaim,
  objectToClaims,
} from '~/composables/usePayloadClaims'
import { formatJson } from '~/composables/useJwt'
import { snapshotJson, toPlainObject } from '~/utils/plain'
import { getUnixTimestampTooltip } from '~/utils/unixTime'

const model = defineModel<Record<string, unknown>>({ required: true })

const emit = defineEmits<{
  applyClaim: [claim: 'iat' | 'exp', offsetSeconds: number]
  clearClaim: [claim: string]
  validationError: [message: string]
}>()

const claims = ref<PayloadClaim[]>([])
const error = ref('')
let syncingFromParent = false

const jsonPreview = computed(() => {
  try {
    const obj = claimsToObject(claims.value)
    return formatJson(obj)
  } catch {
    return formatJson(model.value)
  }
})

function syncFromParent(obj: Record<string, unknown>) {
  syncingFromParent = true
  claims.value = objectToClaims(obj)
  syncingFromParent = false
}

function emitPayload() {
  if (syncingFromParent) return
  try {
    const obj = claimsToObject(claims.value)
    error.value = ''
    emit('validationError', '')
    model.value = toPlainObject(obj)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Invalid payload'
    emit('validationError', error.value)
  }
}

watch(
  () => snapshotJson(model.value),
  () => {
    const incoming = snapshotJson(model.value)
    const current = snapshotJson(claimsToObject(claims.value))
    if (incoming !== current) {
      syncFromParent(toPlainObject(model.value))
    }
  },
  { immediate: true },
)

watch(claims, emitPayload, { deep: true })

function addClaim() {
  claims.value.push(createClaim())
}

function removeClaim(id: string) {
  claims.value = claims.value.filter((c) => c.id !== id)
}

function onTypeChange(claim: PayloadClaim) {
  if (claim.type === 'boolean' && !['true', 'false'].includes(claim.value)) {
    claim.value = 'true'
  }
  if (claim.type === 'null') {
    claim.value = ''
  }
}

function claimValueTooltip(claim: PayloadClaim): string | undefined {
  if (claim.type !== 'number' && claim.type !== 'string') return undefined
  return getUnixTimestampTooltip(claim.key, claim.value) ?? undefined
}
</script>

<template>
  <section class="card payload-panel">
    <div class="card-header">
      <span class="card-title">Payload</span>
      <div class="card-actions">
        <button type="button" class="btn btn-sm" @click="emit('applyClaim', 'iat', 0)">
          iat now
        </button>
        <button type="button" class="btn btn-sm" @click="emit('applyClaim', 'exp', 3600)">
          exp +1h
        </button>
        <button type="button" class="btn btn-sm" @click="emit('applyClaim', 'exp', 86400)">
          exp +24h
        </button>
        <button type="button" class="btn btn-sm" @click="emit('clearClaim', 'exp')">
          clear exp
        </button>
        <button type="button" class="btn btn-sm" @click="addClaim">Add claim</button>
        <CopyButton :text="jsonPreview" label="Copy JSON" />
      </div>
    </div>

    <div class="card-body">
      <div class="claims-form">
        <div v-if="claims.length === 0" class="hint-text empty-hint">
          No claims yet. Add a claim or paste a JWT to decode.
        </div>

        <div
          v-for="claim in claims"
          :key="claim.id"
          class="claim-row"
        >
          <input
            v-model="claim.key"
            class="claim-key field-input"
            type="text"
            placeholder="Claim name"
            spellcheck="false"
          >
          <select
            v-model="claim.type"
            class="claim-type field-select"
            @change="onTypeChange(claim)"
          >
            <option value="string">String</option>
            <option value="number">Number</option>
            <option value="boolean">Boolean</option>
            <option value="null">Null</option>
            <option value="json">JSON</option>
          </select>

          <select
            v-if="claim.type === 'boolean'"
            v-model="claim.value"
            class="claim-value field-select"
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
          <input
            v-else-if="claim.type === 'number'"
            v-model="claim.value"
            class="claim-value field-input"
            :class="{ 'claim-value--unix': claimValueTooltip(claim) }"
            type="number"
            placeholder="Value"
            :title="claimValueTooltip(claim)"
          >
          <span
            v-else-if="claim.type === 'null'"
            class="claim-null"
          >null</span>
          <textarea
            v-else-if="claim.type === 'json'"
            v-model="claim.value"
            class="claim-value claim-value-json field-input"
            placeholder='{"role":"admin"}'
            rows="2"
            spellcheck="false"
          />
          <input
            v-else
            v-model="claim.value"
            class="claim-value field-input"
            :class="{ 'claim-value--unix': claimValueTooltip(claim) }"
            type="text"
            placeholder="Value"
            spellcheck="false"
            :title="claimValueTooltip(claim)"
          >

          <button
            type="button"
            class="btn btn-sm claim-remove"
            title="Remove claim"
            @click="removeClaim(claim.id)"
          >
            ×
          </button>
        </div>
      </div>

      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </section>
</template>

<style scoped>
.card-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.claims-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.empty-hint {
  padding: 0.5rem 0;
}

.claim-row {
  display: grid;
  grid-template-columns: minmax(6rem, 1fr) 6.5rem minmax(8rem, 2fr) auto;
  gap: 0.4rem;
  align-items: start;
}

.claim-key,
.claim-type,
.claim-value {
  padding: 0.4rem 0.5rem;
  font-size: 0.85rem;
}

.claim-value-json {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  resize: vertical;
  min-height: 2.2rem;
}

.claim-value--unix {
  cursor: help;
}

.claim-null {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.5rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.85rem;
}

.claim-remove {
  min-width: 2rem;
  padding-inline: 0.4rem;
  font-size: 1.1rem;
  line-height: 1;
}

@media (min-width: 1440px) {
  .claim-row {
    grid-template-columns: minmax(7rem, 1fr) 6.5rem minmax(10rem, 2.5fr) auto;
  }
}

@media (max-width: 640px) {
  .claim-row {
    grid-template-columns: 1fr 1fr;
  }

  .claim-value,
  .claim-value-json {
    grid-column: 1 / -1;
  }

  .claim-remove {
    grid-column: 2;
    justify-self: end;
  }
}
</style>
