<template>
  <div>
    <h1>Lista de Libros</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="category in topCategories" :key="category.id_top_category">
        <h2>{{ category.name_category }}</h2>
        <div v-for="subCategory in category.sub_category_list" :key="subCategory.id_category">
          <h3>{{ subCategory.name_category }}</h3>
          <ul>
            <li v-for="book in subCategory.book_list" :key="book.id_book">
              <router-link :to="`/book/${book.id_book}`">
                <img :src="book.img_url" />
              </router-link>
              <p>{{ book.name_book }}</p>
              <p>{{ book.author }}</p>
              <p>{{ book.publisher }}</p>
            </li>
          </ul>
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
</script>
