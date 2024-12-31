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
  padding: 0 2px;
  font-size: 12px;
  color: #929292;
  background-color: #f0f0f0; /* Default gray color */
  border-radius: 2px; /* Border radius */
}
</style>
