<template>
  <div>
    <h1>書籍詳細</h1>
    <div class="book-detail-container">
      <div class="book-info-container">
        <img class="book-image" :src="book.image" />
        <div>
          <h2 class="book-title">{{ book.title }}</h2>
          <dl>
            <div class="book-author">
              <AppChip is="dt">著者</AppChip>
              <dd>Jordi Santamaria</dd>
            </div>
            <div class="book-publisher">
              <AppChip is="dt">出版社</AppChip>
              <dd>オライリー・ジャパン</dd>
            </div>
          </dl>
          <div class="book-info-buttons">
            <button @click="toggleMyBooks">{{ myBooksLabel }}</button>
            <button>読み放題中</button>
          </div>
        </div>
      </div>
      <div class="icons-container">
        <button v-for="icon in icons" :key="icon.id">
          <img :src="icon.image" />
          <p>{{ icon.label }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppChip from '@/components/AppChip.vue'
import { useMyBooksStore } from '@/stores/myBooks'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const icons = [
  { id: 1, label: 'ブックマーク', image: 'path/to/image1.jpg' },
  { id: 2, label: 'ブックマーク', image: 'path/to/image2.jpg' },
  { id: 3, label: 'ブックマーク', image: 'path/to/image3.jpg' },
]
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

<style>
.book-detail-container {
  padding-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  background: #fafafa;
}

.book-info-container {
  display: flex;
  gap: 10px;
}

.book-image {
  width: 90px;
}

.book-title {
  font-size: 20px;
  font-weight: bold;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #929292;
}

.book-publisher {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #929292;
}

.book-info-buttons {
  /* Add your styles here */
}

.icons-container {
  /* Add your styles here */
}
</style>
