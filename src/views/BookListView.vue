<template>
  <MainContainer is="main" class="book-list-container">
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div
        class="category-container"
        v-for="category in topCategories"
        :key="category.id_top_category"
      >
        <div v-for="subCategory in category.sub_category_list" :key="subCategory.id_category">
          <h3 class="category-title">{{ subCategory.name_category }}</h3>
          <AppCarousel :slides="subCategory.book_list" :slideWidth="106">
            <template v-slot:default="{ slide }: any">
              <div class="carousel-item" @click="handleClick(slide.id_book)">
                <img :src="slide.img_url" alt="Slide Image" style="width: 90px" />
              </div>
            </template>
          </AppCarousel>
        </div>
      </div>
    </div>
  </MainContainer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import type { TopCategory } from '@/types/BookTypes'
import AppCarousel from '@/components/AppCarousel.vue'
import MainContainer from '@/components/MainContainer.vue'

const booksStore = useBooksStore()
const router = useRouter()
const topCategories = ref<TopCategory[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    topCategories.value = await booksStore.fetchBooks()
  } catch (error) {
    console.error('Failed to fetch books:', error)
  } finally {
    loading.value = false
  }
})

const goToDetail = (id: string) => {
  console.log('goToDetail', id)
  if (id) {
    router.push(`/book/${id}`)
  } else {
    console.error('Invalid book ID:', id)
  }
}

const handleClick = (id: string) => {
  console.log('Carousel item clicked with ID:', id)
  goToDetail(id)
}
</script>
<style scoped>
.book-list-container {
  padding: 2rem;
}

.carousel-item {
  cursor: pointer;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  transition: opacity 0.3s ease;
}

.carousel-item:hover {
  opacity: 0.7;
}

.category-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.category-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 14px;
}
</style>
