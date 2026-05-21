<script setup lang="ts">
const { activeTab } = useJwtWorkbench()
</script>

<template>
  <div class="shell">
    <div class="shell-inner">
      <header class="shell-header">
        <div class="shell-brand">
          <h1>JSON Utilities</h1>
          <p>Format JSON and encode or decode JWTs in your browser — nothing leaves your device</p>
        </div>
        <ThemeToggle />
      </header>

      <AppTabBar v-model="activeTab" />

      <DecodeWorkspace v-show="activeTab === 'decode'" />
      <EncodeWorkspace v-show="activeTab === 'encode'" />
      <FormatWorkspace v-show="activeTab === 'format'" />
    </div>
  </div>
</template>
