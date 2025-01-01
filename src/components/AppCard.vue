<template>
  <component :is="is || 'div'" :class="['card', className]">
    <slot />
  </component>
</template>

<script setup lang="ts">
defineProps<{
  className?: string
  is?: string
}>()
</script>

<style scoped>
.card {
  border: 1px solid var(--color-outline-input-border);
  padding: 12px;
  border-radius: 5px;
  background: var(--color-background);
}
</style>
