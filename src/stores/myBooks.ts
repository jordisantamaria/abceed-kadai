import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMyBooksStore = defineStore('myBooks', () => {
  const myBooks = ref([] as string[])

  const addToMyBooks = (bookId: string) => {
    if (!myBooks.value.includes(bookId)) {
      myBooks.value.push(bookId)
    }
  }

  const removeFromMyBooks = (bookId: string) => {
    myBooks.value = myBooks.value.filter((id) => id !== bookId)
  }

  const isInMyBooks = (bookId: string) => {
    return myBooks.value.includes(bookId)
  }

  return { myBooks, addToMyBooks, removeFromMyBooks, isInMyBooks }
})
