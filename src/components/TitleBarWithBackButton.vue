<template>
  <MainContainer class="title-bar">
    <button @click="goBack" class="back-button">
      <IconChevronLeft width="32" height="32" />
    </button>
    <h1>{{ title }}</h1>
  </MainContainer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import MainContainer from '@/components/MainContainer.vue'
import IconChevronLeft from './icons/IconChevronLeft.vue'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  (e: 'onGoBack'): void
}>()

function goBack() {
  emit('onGoBack')
}
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.back-button {
  margin-right: 16px;
  padding: 0.5rem;
  cursor: pointer;
}
</style>
