import {
  isAsymmetricAlgorithm,
  isHmacAlgorithm,
  isSupportedJwtAlgorithm,
} from '~/constants/jwtAlgorithms'
import type { JwtAlgorithm, KeyFormat, KeyRole } from '~/types/jwt'
import { getDefaultPayloadObject } from '~/composables/usePayloadClaims'
import { snapshotJson, toPlainObject } from '~/utils/plain'
import { asJwtString } from '~/utils/string'
import {
  decodeTokenUnsafe,
  formatJson,
  getDefaultHeader,
  parseJsonObject,
  syncTokenFromEditors,
  verifyToken,
} from '~/composables/useJwt'
import { SAMPLE_JWT, SAMPLE_SECRET } from '~/constants/samples'

export type AppTab = 'encode' | 'decode' | 'format'

function createWorkbench() {
  const activeTab = ref<AppTab>('decode')

  const algorithm = ref<JwtAlgorithm>('HS256')
  const token = ref('')
  const headerText = ref(getDefaultHeader('HS256'))
  const payloadObject = ref<Record<string, unknown>>(getDefaultPayloadObject())
  const keyMaterial = ref('')
  const keyFormat = ref<KeyFormat>('text')
  const keyRole = ref<KeyRole>('secret')

  const headerError = ref('')
  const payloadError = ref('')
  const tokenError = ref('')
  const actionError = ref('')
  const jwtValid = ref(false)
  const signatureVerified = ref(false)
  const isSyncing = ref(false)

  const suppressTokenDecode = ref(false)
  const suppressAutoEncode = ref(false)
  const isInternalTokenUpdate = ref(false)

  const showJwtStatus = computed(() => asJwtString(token.value).trim().length > 0)

  const payloadSnapshot = computed(() => snapshotJson(payloadObject.value))
  const credentialsSnapshot = computed(() =>
    snapshotJson({
      key: keyMaterial.value,
      format: keyFormat.value,
      role: keyRole.value,
    }),
  )

  watch(algorithm, (alg) => {
    headerError.value = ''
    if (isHmacAlgorithm(alg)) {
      keyFormat.value = keyFormat.value === 'pem' ? 'text' : keyFormat.value
      keyRole.value = 'secret'
    } else {
      keyFormat.value = 'pem'
      keyRole.value = 'private'
    }
    try {
      const header = parseJsonObject(headerText.value, 'Header')
      header.alg = alg
      headerText.value = formatJson(header)
    } catch {
      headerText.value = getDefaultHeader(alg)
    }
  })

  function validateHeader(): boolean {
    try {
      parseJsonObject(headerText.value, 'Header')
      headerError.value = ''
      return true
    } catch (e) {
      headerError.value = e instanceof Error ? e.message : 'Invalid header'
      return false
    }
  }

  function validatePayload(): boolean {
    return !payloadError.value
  }

  function formatHeader() {
    if (!validateHeader()) return
    headerText.value = formatJson(parseJsonObject(headerText.value, 'Header'))
  }

  async function assessJwt(jwt: unknown = token.value) {
    const jwtStr = asJwtString(jwt).trim()
    if (!jwtStr) {
      jwtValid.value = false
      signatureVerified.value = false
      return
    }

    let verifyAlgorithm = algorithm.value

    try {
      const { header } = decodeTokenUnsafe(jwtStr)
      jwtValid.value = true
      const headerAlg = header.alg as string | undefined
      if (headerAlg && isSupportedJwtAlgorithm(headerAlg)) {
        verifyAlgorithm = headerAlg
      }
    } catch {
      jwtValid.value = false
      signatureVerified.value = false
      return
    }

    const normalized = jwtStr.replace(/\s/g, '')
    const parts = normalized.split('.')
    const hasSignature = parts.length >= 3 && Boolean(parts[2])

    if (!hasSignature || !keyMaterial.value.trim()) {
      signatureVerified.value = false
      return
    }

    const role: KeyRole = isHmacAlgorithm(verifyAlgorithm)
      ? 'secret'
      : keyRole.value

    const result = await verifyToken(
      jwtStr,
      verifyAlgorithm,
      keyMaterial.value,
      keyFormat.value,
      role,
    )

    signatureVerified.value = result.valid
  }

  async function decodeFromToken() {
    tokenError.value = ''
    actionError.value = ''
    const trimmed = asJwtString(token.value).trim()
    if (!trimmed) {
      jwtValid.value = false
      signatureVerified.value = false
      return
    }

    try {
      const { header, payload } = decodeTokenUnsafe(trimmed)
      suppressAutoEncode.value = true
      headerText.value = formatJson(header)
      payloadObject.value = toPlainObject(payload)
      headerError.value = ''
      payloadError.value = ''

      const headerAlg = header.alg as string | undefined
      if (headerAlg && isSupportedJwtAlgorithm(headerAlg)) {
        algorithm.value = headerAlg
      }

      await assessJwt(trimmed)
    } catch (e) {
      tokenError.value = e instanceof Error ? e.message : 'Failed to decode JWT'
      jwtValid.value = false
      signatureVerified.value = false
    } finally {
      suppressAutoEncode.value = false
    }
  }

  const decodeDebounced = useDebounceFn(decodeFromToken, 350)

  watch(token, () => {
    if (suppressTokenDecode.value || isInternalTokenUpdate.value) return
    if (activeTab.value === 'decode') {
      decodeDebounced()
    }
  })

  async function syncJwtFromEditors() {
    if (suppressAutoEncode.value) return
    if (!validateHeader() || !validatePayload()) return

    isSyncing.value = true
    suppressTokenDecode.value = true
    actionError.value = ''

    try {
      const { token: next } = await syncTokenFromEditors(
        headerText.value,
        payloadObject.value,
        algorithm.value,
        keyMaterial.value,
        keyFormat.value,
        keyRole.value,
      )
      isInternalTokenUpdate.value = true
      token.value = asJwtString(next)
      tokenError.value = ''
      await assessJwt(token.value)
    } catch (e) {
      actionError.value = e instanceof Error ? e.message : 'Failed to update JWT'
    } finally {
      isSyncing.value = false
      isInternalTokenUpdate.value = false
      suppressTokenDecode.value = false
    }
  }

  const syncJwtDebounced = useDebounceFn(syncJwtFromEditors, 400)
  const reassessDebounced = useDebounceFn(() => assessJwt(), 250)

  watch([payloadSnapshot, headerText], () => {
    syncJwtDebounced()
  })

  watch(credentialsSnapshot, () => {
    reassessDebounced()
  })

  watch(activeTab, (tab) => {
    if (tab === 'format') return

    if (isAsymmetricAlgorithm(algorithm.value)) {
      keyRole.value = tab === 'encode' ? 'private' : 'public'
    }
    if (tab === 'encode') {
      syncJwtDebounced()
    } else if (asJwtString(token.value).trim()) {
      reassessDebounced()
    }
  })

  watch(
    token,
    (val) => {
      if (typeof val !== 'string') {
        token.value = asJwtString(val)
      }
    },
    { flush: 'sync' },
  )

  async function generateJwt() {
    await syncJwtFromEditors()
  }

  function applySampleData() {
    token.value = SAMPLE_JWT
    keyMaterial.value = SAMPLE_SECRET
    algorithm.value = 'HS256'
    keyFormat.value = 'text'
    keyRole.value = 'secret'
  }

  function loadSample() {
    activeTab.value = 'decode'
    applySampleData()
    void decodeFromToken()
  }

  function clearAll() {
    suppressAutoEncode.value = true
    token.value = ''
    headerText.value = getDefaultHeader(algorithm.value)
    payloadObject.value = getDefaultPayloadObject()
    keyMaterial.value = ''
    headerError.value = ''
    payloadError.value = ''
    tokenError.value = ''
    actionError.value = ''
    jwtValid.value = false
    signatureVerified.value = false
    nextTick(() => {
      suppressAutoEncode.value = false
      syncJwtDebounced()
    })
  }

  function applyClaim(claim: 'iat' | 'exp', offsetSeconds: number) {
    const now = Math.floor(Date.now() / 1000) + offsetSeconds
    payloadObject.value = toPlainObject({ ...payloadObject.value, [claim]: now })
    payloadError.value = ''
  }

  function clearClaim(claim: string) {
    const next = toPlainObject({ ...payloadObject.value })
    delete next[claim]
    payloadObject.value = next
    payloadError.value = ''
  }

  suppressTokenDecode.value = true
  applySampleData()
  suppressTokenDecode.value = false
  void decodeFromToken()

  return {
    activeTab,
    algorithm,
    token,
    headerText,
    payloadObject,
    keyMaterial,
    keyFormat,
    keyRole,
    headerError,
    payloadError,
    tokenError,
    actionError,
    jwtValid,
    signatureVerified,
    isSyncing,
    showJwtStatus,
    formatHeader,
    generateJwt,
    loadSample,
    clearAll,
    applyClaim,
    clearClaim,
    decodeFromToken,
  }
}

let workbench: ReturnType<typeof createWorkbench> | null = null
let api: ReturnType<typeof buildWorkbenchApi> | null = null

function buildWorkbenchApi(w: ReturnType<typeof createWorkbench>) {
  return {
    ...toRefs(w),
    formatHeader: w.formatHeader,
    generateJwt: w.generateJwt,
    loadSample: w.loadSample,
    clearAll: w.clearAll,
    applyClaim: w.applyClaim,
    clearClaim: w.clearClaim,
    decodeFromToken: w.decodeFromToken,
  }
}

export function useJwtWorkbench() {
  if (!workbench) workbench = createWorkbench()
  if (!api) api = buildWorkbenchApi(workbench)
  return api
}
