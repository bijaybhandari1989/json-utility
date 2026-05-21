<script setup lang="ts">
import {
  JWT_ALGORITHMS,
  getJwtAlgorithmLabel,
} from '~/constants/jwtAlgorithms'
import type { JwtAlgorithm } from '~/types/jwt'

const model = defineModel<JwtAlgorithm>({ required: true })
</script>

<template>
  <select v-model="model" class="field-select algorithm-select">
    <option v-for="alg in JWT_ALGORITHMS" :key="alg" :value="alg">
      {{ getJwtAlgorithmLabel(alg) }}
    </option>
  </select>
</template>
