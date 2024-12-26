import BookDetailView from '@/views/BookDetailView.vue'
import BookListView from '@/views/BookListView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: BookListView },
    { path: '/book/:id', component: BookDetailView },
    // {
    //   path: '/:pathMatch(.*)*', // Capture all not defined routes
    //   name: 'NotFound',
    //   component: NotFoundView,
    // },
  ],
})

export default router
