<template>
  <div>
    <TitleBarWithBackButton title="書籍詳細" @onGoBack="goBack" />
    <main v-if="book">
      <MainContainer class="book-detail-container">
        <!-- Left -->
        <div class="book-info-container">
          <img class="book-image" :src="book?.img_url" />
          <div>
            <h1 class="book-title">{{ book?.name_book }}</h1>
            <dl>
              <div class="book-author">
                <AppChip is="dt">著者</AppChip>
                <dd>{{ book?.author }}</dd>
              </div>
              <div class="book-publisher">
                <AppChip is="dt">出版社</AppChip>
                <dd>{{ book?.publisher }}</dd>
              </div>
            </dl>
            <div class="book-info-buttons">
              <AppButton variant="outline-primary" @click="toggleMyBooks">{{
                myBooksLabel
              }}</AppButton>
              <AppButton variant="primary">読み放題中</AppButton>
            </div>
          </div>
        </div>
        <!-- Right -->
        <div class="icons-container">
          <AppButton
            variant="outline-input"
            class="icon-button"
            v-for="icon in icons"
            :key="icon.id"
          >
            <component :is="icon.component" />
            <p>{{ icon.label }}</p>
          </AppButton>
        </div>
      </MainContainer>
    </main>
    <div v-else class="loading-message">Loading book details...</div>
  </div>
</template>

<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'
import AppChip from '@/components/AppChip.vue'
import MainContainer from '@/components/MainContainer.vue'
import TitleBarWithBackButton from '@/components/TitleBarWithBackButton.vue'
import { useMyBooksStore } from '@/stores/myBooks'
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IconStudyQuiz from '@/components/icons/IconStudyQuiz.vue'
import IconStudyTest from '@/components/icons/IconStudyTest.vue'
import IconStudySound from '@/components/icons/IconStudySound.vue'
import IconStudySw from '@/components/icons/IconStudySw.vue'
import IconStudyVocab from '@/components/icons/IconStudyVocab.vue'
import IconStudyMarksheet from '@/components/icons/IconStudyMarksheet.vue'
import IconStudyRecord from '@/components/icons/IconStudyRecord.vue'
import { useBooksStore } from '@/stores/books'
import type { Book } from '@/types/BookTypes'

const icons = [
  { id: 1, label: 'アプリ学習', component: IconStudyQuiz },
  { id: 2, label: 'テスト', component: IconStudyTest },
  { id: 3, label: '音声（無料）', component: IconStudySound },
  { id: 4, label: 'SWトレ', component: IconStudySw },
  { id: 5, label: '単語一覧', component: IconStudyVocab },
  { id: 6, label: 'マークシート', component: IconStudyMarksheet },
  { id: 7, label: '学習記録', component: IconStudyRecord },
]
const route = useRoute()
const router = useRouter()

const bookId = route.params.id as string

const booksStore = useBooksStore()
const book = ref<Book | null>(null)

onMounted(async () => {
  if (!booksStore.books.length) {
    await booksStore.fetchBooks()
  }
  const fetchedBook = booksStore.getBookById(bookId)
  if (fetchedBook) {
    book.value = fetchedBook
  } else {
    router.push('/')
  }
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

function goBack() {
  router.push('/')
}
</script>

<style scoped>
main {
  background: var(--color-background-muted);
}

.book-detail-container {
  display: flex;
  gap: 20px;
  padding: 0;
  flex-direction: column;

  justify-content: center;
  @media (min-width: 768px) {
    padding: 20px 32px;
    flex-direction: row;
  }
}

.book-info-container {
  display: flex;
  gap: 12px;

  padding-bottom: 24px;
  background: var(--color-background);
  padding: 20px 16px;

  @media (min-width: 768px) {
    max-width: 450px;
    padding: 20px;
    border-radius: 5px;
    border: 1px solid var(--color-outline-input-border);
  }
}

.book-image {
  width: 90px;
  object-fit: contain;
  object-position: top;
}

.book-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-text-muted);
  margin-bottom: 5px;
}

.book-publisher {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--color-text-muted);
  margin-bottom: 10px;
}

.book-info-buttons {
  display: flex;
  gap: 10px;
}

.icons-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 0 16px 20px 16px;
  height: fit-content;
  @media (min-width: 768px) {
    padding: 0;
  }
}

.icon-button {
  height: 70px;
  width: 70px;
  flex-direction: column;
  gap: 5px;
  padding: 0;
}

.icon-button svg {
  color: var(--color-primary);
}

.loading-message {
  text-align: center;
  font-size: 18px;
  color: var(--color-loading-text);
  margin-top: 20px;
}
</style>
