import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { TopCategory } from '@/types/BookTypes'

export const useBooksStore = defineStore('books', () => {
  const books = ref([] as TopCategory[])

  async function fetchBooks() {
    const response = await axios.get('https://dev-app-api.abceed.com/mock/book/all')
    books.value = response.data.top_category_list
    return books.value
  }

  return { books, fetchBooks }
})
