<template>
  <div class="carousel">
    <button class="carousel-button prev" @click="prev" :disabled="currentIndex === 0">Prev</button>
    <div class="carousel-window">
      <div class="carousel-items" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <slot v-for="(slide, index) in slides" :key="index" :slide="slide" />
      </div>
    </div>
    <button
      class="carousel-button next"
      @click="next"
      :disabled="currentIndex === slides.length - 1"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ImageCarouselProps<T> {
  slides: T[]
}

const props = defineProps<ImageCarouselProps<unknown>>()

const currentIndex = ref(0)

const next = () => {
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}
</script>

<style scoped>
.carousel {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel-window {
  overflow: hidden;
  width: 100%;
  flex: 1;
}

.carousel-items {
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  cursor: pointer;
  z-index: 1;
}

.carousel-button.prev {
  left: 0;
}

.carousel-button.next {
  right: 0;
}
</style>
