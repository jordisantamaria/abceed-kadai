<template>
  <div class="carousel" ref="carouselElement">
    <button v-if="canScrollLeft" class="carousel-arrow left" @click="moveLeft">
      <IconChevronLeft />
    </button>
    <div class="carousel-slides" :style="{ transform: `translateX(${translateX}px)` }">
      <div v-for="(slide, index) in slides" :key="index">
        <slot :slide="slide" />
      </div>
    </div>
    <button v-if="canScrollRight" class="carousel-arrow right" @click="moveRight">
      <IconChevronLeft style="transform: rotate(180deg)" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'

interface ImageCarouselProps<T> {
  slides: T[]
  slideWidth: number
}

const props = defineProps<ImageCarouselProps<unknown>>()

const translateX = ref(0)
const carouselWidth = ref(0)
const slidesWidth = ref(0)
const carouselElement = ref<HTMLElement | null>(null)

const canScroll = computed(() => slidesWidth.value > carouselWidth.value)
const canScrollLeft = computed(() => canScroll.value && translateX.value < 0)
const canScrollRight = computed(
  () => canScroll.value && translateX.value > carouselWidth.value - slidesWidth.value,
)

const isDragging = ref(false)

let startX = 0
let currentTranslateX = 0
let lastUpdate = 0
const THROTTLE_DELAY = 16 // Approximately 60fps

function onTouchStart(event: TouchEvent | MouseEvent) {
  startX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
  currentTranslateX = translateX.value
  isDragging.value = true
  if (carouselElement.value) {
    carouselElement.value.style.transition = 'none' // Disable transition during drag to avoid lagging
  }
}

function onTouchMove(event: TouchEvent | MouseEvent) {
  if (!isDragging.value) return

  const now = Date.now()
  if (now - lastUpdate < THROTTLE_DELAY) return
  lastUpdate = now

  const currentX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
  const deltaX = currentX - startX
  translateX.value = currentTranslateX + deltaX

  // Clamp the translateX value to prevent overscrolling
  const maxNegativeTranslateX = Math.min(0, carouselWidth.value - slidesWidth.value)
  translateX.value = Math.max(Math.min(translateX.value, 0), maxNegativeTranslateX)
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (carouselElement.value) {
    carouselElement.value.style.transition = 'transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)' // Re-enable transition with bounce effect
  }
  const movedBy = translateX.value - currentTranslateX
  if (Math.abs(movedBy) > props.slideWidth * 0.35) {
    if (movedBy < 0 && canScrollRight.value) {
      moveRight()
    } else if (movedBy > 0 && canScrollLeft.value) {
      moveLeft()
    }
  }
}

function moveLeft() {
  if (canScrollLeft.value) {
    translateX.value = Math.min(translateX.value + props.slideWidth, 0)
  }
}

function moveRight() {
  if (canScrollRight.value) {
    const maxNegativeTranslateX = Math.min(0, carouselWidth.value - slidesWidth.value)
    translateX.value = Math.max(translateX.value - props.slideWidth, maxNegativeTranslateX)
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

<style>
.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.carousel-slides {
  display: flex;
  width: 100%;
  gap: 16px;
  user-select: none;
  transition: transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1); /* Default transition */
}

.carousel-slides img {
  pointer-events: none;
}

.no-pointer-events {
  pointer-events: none;
}

.carousel-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px; /* Adjust width as needed */
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent);
  color: white;
  border: none;
  cursor: pointer;
  z-index: 1;
  display: none; /* Hide by default */
  align-items: center;
  justify-content: center;
}

.carousel-arrow svg {
  height: 30px;
  width: 30px;
}

.carousel-arrow.left {
  left: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.6), transparent);
}

.carousel-arrow.right {
  right: 0;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.6), transparent);
}

.carousel:hover .carousel-arrow {
  display: flex; /* Show on hover */
}
</style>
