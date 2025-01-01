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
          <h2 class="category-title">{{ subCategory.name_category }}</h2>
          <AppCarousel :slides="subCategory.book_list" :slideWidth="106">
            <template v-slot:default="{ slide }: any">
              <div class="carousel-item" @click="goToDetail(slide.id_book)">
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
    if (booksStore.books.length === 0) {
      topCategories.value = await booksStore.fetchBooks()
    } else {
      topCategories.value = booksStore.books
    }
  } catch (error) {
    console.error('Failed to fetch books:', error)
  } finally {
    loading.value = false
  }
})

const goToDetail = (id: string) => {
  if (id) {
    router.push(`/book/${id}`)
  } else {
    console.error('Invalid book ID:', id)
  }
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
