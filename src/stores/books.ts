import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { TopCategory } from '@/types/BookTypes'

export const useBooksStore = defineStore('books', () => {
  const books = ref([] as TopCategory[])

  async function fetchBooks() {
    const response = await axios.get('https://dev-app-api.abceed.com/mock/book/all')
    books.value = (response.data.top_category_list as TopCategory[]).filter(
      (category) => category.name_category === 'すべて',
    )
    return books.value
  }

  const getBookById = computed(() => (id: string) => {
    for (const category of books.value) {
      for (const subCategory of category.sub_category_list) {
        const book = subCategory.book_list.find((book) => book.id_book === id)
        if (book) return book
      }
    }
    return null
  })

  return { books, fetchBooks, getBookById }
})
