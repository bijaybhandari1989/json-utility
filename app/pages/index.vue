<script setup lang="ts">
import { SITE } from '~/constants/site'

const { activeTab } = useJwtWorkbench()
</script>

<template>
  <div class="shell">
    <div class="shell-inner">
      <header class="shell-header">
        <div class="shell-brand">
          <h1>{{ SITE.name }}</h1>
          <p>{{ SITE.tagline }}</p>
        </div>
        <div class="shell-header-actions">
          <GitHubLink />
          <ThemeToggle />
        </div>
      </header>

      <AppTabBar v-model="activeTab" />

      <DecodeWorkspace v-show="activeTab === 'decode'" />
      <EncodeWorkspace v-show="activeTab === 'encode'" />
      <FormatWorkspace v-show="activeTab === 'format'" />
    </div>
  </div>
</template>
