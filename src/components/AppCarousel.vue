<template>
  <div class="carousel">
    <button class="carousel-arrow left" @click="moveLeft">‹</button>
    <div class="carousel-slides" :style="{ transform: `translateX(${translateX}px)` }">
      <div v-for="(slide, index) in slides" :key="index">
        <slot :slide="slide" />
      </div>
    </div>
    <button class="carousel-arrow right" @click="moveRight">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ImageCarouselProps<T> {
  slides: T[]
}

defineProps<ImageCarouselProps<unknown>>()

const translateX = ref(0)

function moveLeft() {
  translateX.value += 90 + 16
}

function moveRight() {
  translateX.value -= 90 + 16
}
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

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 1;
}

.carousel-arrow.left {
  left: 10px;
}

.carousel-arrow.right {
  right: 10px;
}
</style>
