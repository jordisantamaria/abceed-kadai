<template>
  <div class="carousel">
    <div class="carousel-slides">
      <div v-for="(slide, index) in slides" :key="index">
        <slot :slide="slide" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ImageCarouselProps<T> {
  slides: T[]
}

defineProps<ImageCarouselProps<unknown>>()
</script>

<style scoped>
.carousel {
  position: relative;
  /* width: 100%; */
  width: 600px;
  overflow: hidden;
}

.carousel-slides {
  display: flex;
  width: 100%;
  user-select: none;
  pointer-events: none;
  transition: transform 0.3s ease-out;
}
</style>
