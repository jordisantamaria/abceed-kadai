<template>
  <div>
    <h1>Detalle del Libro</h1>
    <img :src="book.image" />
    <h2>{{ book.title }}</h2>
    <button @click="toggleMyBooks">{{ myBooksLabel }}</button>
  </div>
</template>

<script setup lang="ts">
import { useMyBooksStore } from '@/stores/myBooks'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const bookId = Number(route.params.id)

const book = ref({
  id: bookId,
  title: 'Libro ' + bookId,
  image: 'path/to/image' + bookId + '.jpg',
})

const myBooksStore = useMyBooksStore()
const isInMyBooks = computed(() => myBooksStore.isInMyBooks(bookId))
const myBooksLabel = computed(() => (isInMyBooks.value ? 'MyBooks削除' : 'MyBooks追加'))

const toggleMyBooks = () => {
  if (isInMyBooks.value) {
    myBooksStore.removeFromMyBooks(bookId)
  } else {
    myBooksStore.addToMyBooks(bookId)
  }
}
</script>
