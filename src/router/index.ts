import BookDetailView from '@/views/BookDetailView.vue'
import BookListView from '@/views/BookListView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: BookListView },
    { path: '/book/:id', component: BookDetailView },
  ],
})

export default router
