<template>
  <div class="carousel">
    <button class="carousel-button prev" @click="prev" :disabled="currentIndex === 0">Prev</button>
    <div class="carousel-window">
      <div
        class="carousel-items"
        :style="{ transform: `translateX(-${currentIndex * (100 / slidesPerView)}%)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="carousel-slide"
          :style="{ flex: `0 0 ${100 / slidesPerView}%` }"
        >
          <slot :slide="slide" />
        </div>
      </div>
    </div>
    <button
      class="carousel-button next"
      @click="next"
      :disabled="currentIndex >= slides.length - slidesPerView"
    >
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ImageCarouselProps<T> {
  slides: T[]
}

const props = defineProps<ImageCarouselProps<unknown>>()

const currentIndex = ref(0)
const slidesPerView = ref(1.5) // Default value

const updateSlidesPerView = () => {
  const width = window.innerWidth
  if (width >= 1150) {
    slidesPerView.value = 8
  } else if (width >= 768) {
    slidesPerView.value = 6
  } else if (width >= 600) {
    slidesPerView.value = 5
  } else {
    slidesPerView.value = 3
  }
}

const maxIndex = computed(() => {
  return Math.max(0, props.slides.length - slidesPerView.value)
})

const next = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

onMounted(() => {
  updateSlidesPerView()
  window.addEventListener('resize', updateSlidesPerView)
})
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

.carousel-slide {
  flex: 0 0 auto;
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
