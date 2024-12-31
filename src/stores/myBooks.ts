import { defineStore } from 'pinia'

export const useMyBooksStore = defineStore('myBooks', {
  state: () => ({
    myBooks: [] as string[],
  }),
  actions: {
    addToMyBooks(bookId: string) {
      if (!this.myBooks.includes(bookId)) {
        this.myBooks.push(bookId)
      }
    },
    removeFromMyBooks(bookId: string) {
      this.myBooks = this.myBooks.filter((id) => id !== bookId)
    },
    isInMyBooks(bookId: string) {
      return this.myBooks.includes(bookId)
    },
  },
})
