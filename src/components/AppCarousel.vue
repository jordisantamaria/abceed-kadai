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

const SLIDE_WIDTH = 90 + 16 // Slide width including padding

const canScroll = computed(() => slidesWidth.value > carouselWidth.value)
const canScrollLeft = computed(() => canScroll.value && translateX.value < 0)
const canScrollRight = computed(
  () => canScroll.value && translateX.value > carouselWidth.value - slidesWidth.value,
)

let startX = 0
let currentTranslateX = 0
let isDragging = false

function onTouchStart(event: TouchEvent | MouseEvent) {
  startX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
  currentTranslateX = translateX.value
  isDragging = true
  if (carouselElement.value) {
    carouselElement.value.style.transition = 'none' // Disable transition during drag
  }
}

function onTouchMove(event: TouchEvent | MouseEvent) {
  if (!isDragging) return
  const currentX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
  const deltaX = currentX - startX
  translateX.value = currentTranslateX + deltaX
}

function onTouchEnd() {
  if (!isDragging) return
  isDragging = false
  if (carouselElement.value) {
    carouselElement.value.style.transition = 'transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)' // Re-enable transition with bounce effect
  }
  const movedBy = translateX.value - currentTranslateX
  if (Math.abs(movedBy) > SLIDE_WIDTH * 0.35) {
    if (movedBy < 0) {
      moveRight()
    } else {
      moveLeft()
    }
  } else {
    translateX.value = currentTranslateX
  }
}

function moveLeft() {
  if (canScrollLeft.value) {
    translateX.value += SLIDE_WIDTH
  }
}

function moveRight() {
  if (canScrollRight.value) {
    const maxNegativeTranslateX = Math.min(0, carouselWidth.value - slidesWidth.value)
    translateX.value = Math.max(translateX.value - SLIDE_WIDTH, maxNegativeTranslateX)
  }
}

function updateCarouselWidth() {
  if (carouselElement.value) {
    carouselWidth.value = carouselElement.value.clientWidth
    slidesWidth.value = carouselElement.value.scrollWidth
  }
}

onMounted(() => {
  updateCarouselWidth()
  window.addEventListener('resize', updateCarouselWidth)
  if (carouselElement.value) {
    carouselElement.value.addEventListener('touchstart', onTouchStart)
    carouselElement.value.addEventListener('touchmove', onTouchMove)
    carouselElement.value.addEventListener('touchend', onTouchEnd)
    carouselElement.value.addEventListener('mousedown', onTouchStart)
    carouselElement.value.addEventListener('mousemove', onTouchMove)
    carouselElement.value.addEventListener('mouseup', onTouchEnd)
    carouselElement.value.addEventListener('mouseleave', onTouchEnd)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCarouselWidth)
  if (carouselElement.value) {
    carouselElement.value.removeEventListener('touchstart', onTouchStart)
    carouselElement.value.removeEventListener('touchmove', onTouchMove)
    carouselElement.value.removeEventListener('touchend', onTouchEnd)
    carouselElement.value.removeEventListener('mousedown', onTouchStart)
    carouselElement.value.removeEventListener('mousemove', onTouchMove)
    carouselElement.value.removeEventListener('mouseup', onTouchEnd)
    carouselElement.value.removeEventListener('mouseleave', onTouchEnd)
  }
})
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
  transition: transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1); /* Default transition */
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
