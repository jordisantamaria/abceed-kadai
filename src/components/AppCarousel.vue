<template>
  <div class="carousel" ref="carouselElement">
    <button v-if="canScrollLeft" class="carousel-arrow left" @click="moveLeft">‹</button>
    <div class="carousel-slides" :style="{ transform: `translateX(${translateX}px)` }">
      <div v-for="(slide, index) in slides" :key="index">
        <slot :slide="slide" />
      </div>
    </div>
    <button v-if="canScrollRight" class="carousel-arrow right" @click="moveRight">›</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

interface ImageCarouselProps<T> {
  slides: T[]
}

defineProps<ImageCarouselProps<unknown>>()

const translateX = ref(0)
const carouselWidth = ref(0)
const slidesWidth = ref(0)
const carouselElement = ref<HTMLElement | null>(null)

function updateCarouselWidth() {
  if (carouselElement.value) {
    carouselWidth.value = carouselElement.value.clientWidth
    slidesWidth.value = carouselElement.value.scrollWidth
  }
}

const canScroll = computed(() => slidesWidth.value > carouselWidth.value)
const canScrollLeft = computed(() => canScroll.value && translateX.value < 0)
const canScrollRight = computed(
  () => canScroll.value && translateX.value > carouselWidth.value - slidesWidth.value,
)

onMounted(() => {
  updateCarouselWidth()
  window.addEventListener('resize', updateCarouselWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCarouselWidth)
})

function moveLeft() {
  if (canScroll.value && translateX.value < 0) {
    translateX.value += 90 + 16
  }
}

function moveRight() {
  if (canScroll.value) {
    const maxNegativeTranslateX = Math.min(0, carouselWidth.value - slidesWidth.value)
    translateX.value = Math.max(translateX.value - (90 + 16), maxNegativeTranslateX)
  }
}
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
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
