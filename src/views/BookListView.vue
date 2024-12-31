<template>
  <div>
    <h1>Lista de Libros</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="category in topCategories" :key="category.id_top_category">
        <div v-for="subCategory in category.sub_category_list" :key="subCategory.id_category">
          <h3>{{ subCategory.name_category }}</h3>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import type { TopCategory } from '@/types/BookTypes'
import AppCarousel from '@/components/AppCarousel.vue'

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
.carousel-item {
  padding: 8px;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}
</style>
