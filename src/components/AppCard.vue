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
  border: 1px solid #f3f3f3;
  padding: 12px;
  border-radius: 5px;
  background: #fff;
}
</style>
