<template>
  <component :is="is || 'section'" :class="['main-container', className]">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
defineProps<{
  className?: string
  is?: string
}>()
</script>

<style scoped>
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
  font-weight: normal;
}
</style>
