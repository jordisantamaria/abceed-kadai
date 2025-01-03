<template>
  <button :class="buttonClass">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant?: 'primary' | 'outline-primary' | 'outline-input'
  className?: string
}>()

const buttonClass = computed(() => ({
  'app-button': true,
  'app-button--primary': props.variant === 'primary',
  'app-button--outline-primary': props.variant === 'outline-primary',
  'app-button--outline-input': props.variant === 'outline-input',
  [props.className || '']: !!props.className,
}))
</script>

<style scoped>
.app-button {
  /* Base styles for all buttons */
  padding: 0 20px;
  height: 28px;
  border-radius: 5px;
  width: fit-content;
  white-space: nowrap;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s,
    border 0.2s,
    color 0.2s;
}

.app-button--primary {
  background: var(--color-primary);
  color: var(--color-background);
  border: none;
}

.app-button--outline-primary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.app-button--outline-input {
  border: 1px solid var(--color-outline-input-border);
  padding: 12px;
  border-radius: 5px;
  background: var(--color-background);
  color: var(--color-text);
}

.app-button--primary:hover {
  background: var(--color-primary-hover);
}

.app-button--outline-primary:hover,
.app-button--outline-input:hover {
  background: var(--color-outline-hover);
}

.app-button--outline-input:hover {
  border: 1px solid var(--color-primary);
}
</style>
