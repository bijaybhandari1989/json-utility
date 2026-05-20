<script setup lang="ts">
const {
  algorithm,
  token,
  headerText,
  payloadObject,
  keyMaterial,
  keyFormat,
  keyRole,
  headerError,
  payloadError,
  actionError,
  isSyncing,
  showJwtStatus,
  jwtValid,
  signatureVerified,
  formatHeader,
  generateJwt,
  loadSample,
  clearAll,
  applyClaim,
  clearClaim,
} = useJwtWorkbench()

const globalError = computed(() => {
  const action = String(actionError.value ?? '').trim()
  if (action) return action
  return String(payloadError.value ?? '').trim()
})

function setPayloadError(message: string) {
  payloadError.value = message
}
</script>

<template>
  <div class="encode-workspace">
    <div class="toolbar">
      <label class="field-label inline">
        Algorithm
        <select v-model="algorithm" class="field-select">
          <option value="HS256">HS256</option>
          <option value="RS256">RS256</option>
        </select>
      </label>
      <button type="button" class="btn btn-ghost btn-sm" @click="loadSample">
        Sample
      </button>
      <button type="button" class="btn btn-ghost btn-sm" @click="clearAll">
        Clear
      </button>
      <span class="toolbar-spacer" />
      <button
        type="button"
        class="btn btn-primary"
        :disabled="isSyncing"
        @click="generateJwt"
      >
        {{ isSyncing ? 'Signing…' : 'Generate JWT' }}
      </button>
    </div>

    <section class="card encode-output-card">
      <div class="card-header">
        <span class="card-title">Signed JWT</span>
        <CopyButton :text="token" label="Copy" />
      </div>
      <div class="card-body">
        <p class="hint-text encode-output-hint">
          Regenerates when you edit header or payload. Key changes only re-verify.
        </p>
        <JwtTokenInput v-model="token" />
        <JwtStatusPanel
          :visible="showJwtStatus"
          :jwt-valid="jwtValid"
          :signature-verified="signatureVerified"
        />
      </div>
    </section>

    <div v-if="globalError" class="alert alert-error">
      {{ globalError }}
    </div>

    <div class="grid-payload-split">
      <HeaderPayloadDecodedPanel
        v-model="headerText"
        :payload-object="payloadObject"
        :header-error="headerError"
        @format="formatHeader"
      />
      <PayloadPanel
        v-model="payloadObject"
        @apply-claim="applyClaim"
        @clear-claim="clearClaim"
        @validation-error="setPayloadError"
      />
    </div>

    <KeyInputPanel
      v-model:key-material="keyMaterial"
      v-model:key-format="keyFormat"
      v-model:key-role="keyRole"
      :algorithm="algorithm"
      mode="sign"
    />
  </div>
</template>

<style scoped>
.encode-output-hint {
  margin: 0 0 0.75rem;
}
</style>
