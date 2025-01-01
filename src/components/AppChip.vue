<template>
  <component :is="is || 'div'" :class="['chip', className]">
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
.chip {
  min-width: 40px;
  padding: 0 2px;
  font-size: 12px;
  text-align: center;
  color: var(--color-text-muted);
  background-color: var(--color-chip);
  border-radius: 2px; /* Border radius */
}
</style>
