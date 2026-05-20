<script setup lang="ts">
import type { JwtAlgorithm, KeyFormat, KeyRole } from '~/types/jwt'

const keyMaterial = defineModel<string>('keyMaterial', { required: true })
const keyFormat = defineModel<KeyFormat>('keyFormat', { required: true })
const keyRole = defineModel<KeyRole>('keyRole', { required: true })

withDefaults(
  defineProps<{
    algorithm: JwtAlgorithm
    mode?: 'sign' | 'verify'
  }>(),
  { mode: 'sign' },
)

const fileInput = ref<HTMLInputElement | null>(null)

const placeholder = computed(() => {
  if (keyFormat.value === 'pem') {
    return keyRole.value === 'private'
      ? '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----'
      : '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----'
  }
  return 'Enter HMAC secret'
})

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    keyMaterial.value = String(reader.result ?? '')
    keyFormat.value = 'pem'
  }
  reader.readAsText(file)
  input.value = ''
}

function openFilePicker() {
  fileInput.value?.click()
}
</script>

<template>
  <section class="card key-panel">
    <div class="card-header">
      <span class="card-title">{{ mode === 'verify' ? 'Verify signature' : 'Signing key' }}</span>
      <button type="button" class="btn btn-sm" @click="openFilePicker">
        Upload .pem
      </button>
      <input
        ref="fileInput"
        type="file"
        accept=".pem,.key,.pub,.txt"
        hidden
        @change="onFileChange"
      >
    </div>
    <div class="card-body key-body">
      <div class="key-row">
        <label class="field-label">
          Format
          <select v-model="keyFormat" class="field-select">
            <option v-if="algorithm === 'HS256'" value="text">Plain text</option>
            <option v-if="algorithm === 'HS256'" value="base64">Base64</option>
            <option v-if="algorithm === 'RS256'" value="pem">PEM</option>
          </select>
        </label>
        <label v-if="algorithm === 'RS256'" class="field-label">
          Key type
          <select v-model="keyRole" class="field-select">
            <option value="public">Public (verify)</option>
            <option value="private">Private (sign)</option>
          </select>
        </label>
      </div>
      <textarea
        v-model="keyMaterial"
        class="key-textarea"
        :placeholder="placeholder"
        spellcheck="false"
        rows="5"
      />
      <p class="hint-text">
        <template v-if="mode === 'verify'">
          <template v-if="algorithm === 'HS256'">
            Enter the shared secret to verify the signature.
          </template>
          <template v-else>
            Use the public key to verify. Switch to Encode to sign with a private key.
          </template>
        </template>
        <template v-else-if="algorithm === 'HS256'">
          HS256 uses a shared secret to sign the token.
        </template>
        <template v-else>
          RS256 requires a private key in PEM format to sign.
        </template>
      </p>
    </div>
  </section>
</template>

<style scoped>
.key-body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.key-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.field-label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.field-select {
  padding: 0.35rem 0.5rem;
  min-width: 8rem;
}

.key-textarea {
  min-height: 88px;
  padding: 0.65rem;
  font-size: 0.78rem;
  line-height: 1.4;
}
</style>
