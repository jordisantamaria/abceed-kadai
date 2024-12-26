import { defineStore } from 'pinia'

export const useMyBooksStore = defineStore('myBooks', {
  state: () => ({
    myBooks: [] as number[],
  }),
  actions: {
    addToMyBooks(bookId: number) {
      if (!this.myBooks.includes(bookId)) {
        this.myBooks.push(bookId)
      }
    },
    removeFromMyBooks(bookId: number) {
      this.myBooks = this.myBooks.filter((id) => id !== bookId)
    },
    isInMyBooks(bookId: number) {
      return this.myBooks.includes(bookId)
    },
  },
})
