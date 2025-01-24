<template>
  <div class="carousel" ref="carouselElement">
    <button v-if="canScrollLeft" class="carousel-arrow left" @click="moveLeft">
      <IconChevronLeft />
    </button>
    <div
      class="carousel-slides"
      :style="{ transform: `translateX(${translateX}px)`, gap: `${props.spaceBetweenSlides}px` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="slide.id || index"
        @click="handleClick(slide.href)"
        class="carousel-item"
      >
        <img
          :src="slide.imgUrl"
          :alt="slide.name || 'Carousel Image'"
          :style="{ width: `${props.slideWidth}px` }"
        />
      </div>
    </div>
    <button v-if="canScrollRight" class="carousel-arrow right" @click="moveRight">
      <IconChevronLeft style="transform: rotate(180deg)" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'
import IconChevronLeft from '@/components/icons/IconChevronLeft.vue'
import router from '@/router'

interface ImageCarouselProps {
  slides: {
    imgUrl: string
    href: string
    id?: string
    name?: string
  }[]
  slideWidth: number
  spaceBetweenSlides: number
}

const props = defineProps<ImageCarouselProps>()

// Reactive variables
const translateX = ref(0) // Current horizontal translation of the carousel
const carouselWidth = ref(0) // Width of the carousel container, changes on resize
const slidesWidth = ref(0) // Total width of all slides combined, changes on slides length and slides width
const carouselElement = ref<HTMLElement | null>(null) // Reference to the carousel DOM element
const isDragging = ref(false)

// Computed properties
const canScroll = computed(() => slidesWidth.value > carouselWidth.value)
const canScrollLeft = computed(() => canScroll.value && translateX.value < 0)
const canScrollRight = computed(
  () => canScroll.value && translateX.value > carouselWidth.value - slidesWidth.value,
)

let dragDistance = 0 // Distance dragged by the user, required to allow for click on the carousel

// Variables for handling drag events
let startX = 0 // Starting screen X position of the drag
let currentTranslateX = 0 // CSS TranslateX pixels value at the start of the user drag movement
let lastUpdate = 0 // Timestamp of the last update for throttling
const THROTTLE_DELAY = 16 // Delay for throttling updates (approx. 60fps)

function onTouchStart(event: TouchEvent | MouseEvent) {
  startX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
  currentTranslateX = translateX.value
  isDragging.value = true
  dragDistance = 0
  if (carouselElement.value) {
    carouselElement.value.style.transition = 'none' // Disable transition during drag
  }
}

function onTouchMove(event: TouchEvent | MouseEvent) {
  if (!isDragging.value) return

  const now = Date.now()
  if (now - lastUpdate < THROTTLE_DELAY) return // Throttle updates
  lastUpdate = now

  const currentX = event instanceof TouchEvent ? event.touches[0].clientX : event.clientX
  const deltaX = currentX - startX // Change in X position
  dragDistance = deltaX // Update drag distance
  translateX.value = currentTranslateX + deltaX // Update translateX

  // Clamp translateX to prevent overscrolling over the limits
  const maxNegativeTranslateX = Math.min(0, carouselWidth.value - slidesWidth.value)
  translateX.value = Math.max(Math.min(translateX.value, 0), maxNegativeTranslateX)
}

function onTouchEnd() {
  if (!isDragging.value) return
  isDragging.value = false
  if (carouselElement.value) {
    carouselElement.value.style.transition = 'transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1)' // Re-enable transition
  }
  const movedBy = translateX.value - currentTranslateX // Total movement
  if (Math.abs(movedBy) > props.slideWidth * 0.35) {
    // If movement is enough, scroll to next item
    if (movedBy < 0 && canScrollRight.value) {
      moveRight()
    } else if (movedBy > 0 && canScrollLeft.value) {
      moveLeft()
    }
  }
}

function handleClick(href: string) {
  if (Math.abs(dragDistance) < 5) {
    // If not dragged significantly, treat as click
    router.push(href)
  }
}

function moveLeft() {
  if (canScrollLeft.value) {
    translateX.value = Math.min(translateX.value + (props.slideWidth + props.spaceBetweenSlides), 0)
  }
}

function moveRight() {
  if (canScrollRight.value) {
    const maxNegativeTranslateX = Math.min(0, carouselWidth.value - slidesWidth.value)
    translateX.value = Math.max(
      translateX.value - (props.slideWidth + props.spaceBetweenSlides),
      maxNegativeTranslateX,
    )
  }
}

function updateCarouselWidth() {
  if (carouselElement.value) {
    carouselWidth.value = carouselElement.value.clientWidth
    slidesWidth.value = carouselElement.value.scrollWidth
  }
}

// Update dimensions after images load
function updateDimensionsAfterImagesLoad() {
  const images = carouselElement.value?.querySelectorAll('img') || []
  let loadedImagesCount = 0

  images.forEach((img) => {
    if (img.complete) {
      loadedImagesCount++
    } else {
      img.addEventListener('load', () => {
        loadedImagesCount++
        if (loadedImagesCount === images.length) {
          nextTick(() => {
            updateCarouselWidth()
          })
        }
      })
    }
  })

  if (loadedImagesCount === images.length) {
    nextTick(() => {
      updateCarouselWidth()
    })
  }
}

onMounted(() => {
  updateDimensionsAfterImagesLoad()
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
  user-select: none;
}

.carousel-slides {
  display: flex;
  width: 100%;
  user-select: none;
  transition: transform 0.5s cubic-bezier(0.25, 1.5, 0.5, 1);
}

.carousel-item {
  cursor: pointer;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-item:hover {
  opacity: 0.65;
}

.carousel-slides img {
  pointer-events: none;
}

.carousel-arrow {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 50px;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent);
  color: white;
  border: none;
  cursor: pointer;
  z-index: 1;
  display: none; /* Hide arrows by default */
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
  display: flex; /* Show arrows on hover */
}
</style>
