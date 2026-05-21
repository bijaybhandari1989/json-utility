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
  tokenError,
  showJwtStatus,
  jwtValid,
  signatureVerified,
  tokenHasSignature,
  formatHeader,
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
  <div class="decode-workspace">
    <div class="toolbar">
      <button type="button" class="btn btn-ghost btn-sm" @click="loadSample">
        Load sample
      </button>
      <button type="button" class="btn btn-ghost btn-sm" @click="clearAll">
        Clear
      </button>
      <span class="toolbar-spacer" />
      <label class="field-label inline">
        Algorithm
        <AlgorithmSelect v-model="algorithm" />
      </label>
    </div>

    <section class="card decode-token-card">
      <div class="card-header">
        <span class="card-title">Paste JWT</span>
        <CopyButton :text="token" label="Copy" />
      </div>
      <div class="card-body">
        <p class="hint-text decode-hint">
          Paste a signed JWT to decode. The signature appears as the third (teal) segment. Use Encode to edit and re-sign.
        </p>
        <JwtTokenInput v-model="token" />
        <JwtStatusPanel
          :visible="showJwtStatus"
          :jwt-valid="jwtValid"
          :has-signature="tokenHasSignature"
          :signature-verified="signatureVerified"
        />
        <p v-if="tokenError" class="error-text">
          {{ tokenError }}
        </p>
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
      mode="verify"
    />
  </div>
</template>

<style scoped>
.decode-hint {
  margin: 0 0 0.75rem;
}
</style>
