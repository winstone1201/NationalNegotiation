<template>
  <div class="deep-read">
    <h3 class="deep-read__title">深入了解国谈机制</h3>
    <p class="deep-read__subtitle">以下内容帮助你从游戏走向真实政策理解</p>

    <div class="deep-read__links">
      <button
        v-for="link in links"
        :key="link.contentId"
        class="deep-read__link"
        @click="openArticle(link)"
      >
        <div class="deep-read__link-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h6l4 4v8a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z" stroke="currentColor" stroke-width="1.2"/>
            <path d="M9 2v4h4" stroke="currentColor" stroke-width="1.2"/>
          </svg>
        </div>
        <span class="deep-read__link-text">{{ link.title }}</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <!-- 测验入口 -->
    <div class="deep-read__quiz-cta">
      <p>检验一下你对国谈政策的理解？</p>
      <button class="deep-read__quiz-btn" @click="$emit('goQuiz')">参加知识测验 →</button>
    </div>

    <!-- 文章弹窗 -->
    <ModalOverlay :visible="showArticle" :title="articleTitle" @close="showArticle = false">
      <div class="deep-read__article">
        <p
          v-for="(p, i) in articleParagraphs"
          :key="i"
          :class="['deep-read__article-p', p.startsWith('【') ? 'deep-read__article-heading' : '']"
        >{{ p }}</p>
      </div>
    </ModalOverlay>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getDeepReadArticle } from '@/data/deepReadContent'
import { trackEvent, EventType } from '@/utils/analytics'
import ModalOverlay from '@/components/common/ModalOverlay.vue'

const props = defineProps({
  links: { type: Array, default: () => [] }
})

defineEmits(['goQuiz'])

const showArticle = ref(false)
const articleTitle = ref('')
const articleParagraphs = ref([])

function openArticle(link) {
  trackEvent(EventType.DEEP_READ_CLICK, { contentId: link.contentId })

  const article = getDeepReadArticle(link.contentId)
  if (article) {
    articleTitle.value = article.title
    articleParagraphs.value = article.content.split('\n').filter(p => p.trim())
    showArticle.value = true
  }
}
</script>

<style scoped>
.deep-read {
  padding: var(--spacing-lg) var(--spacing-base);
}

.deep-read__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: 4px;
}

.deep-read__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-lg);
}

.deep-read__links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.deep-read__link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--color-bg-white);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-base);
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all var(--transition-fast);
}

.deep-read__link:active {
  background: var(--color-bg);
  border-color: var(--color-primary);
}

.deep-read__link-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.deep-read__link-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  font-weight: 500;
}

/* 测验CTA */
.deep-read__quiz-cta {
  background: linear-gradient(135deg, #b5343a, #c9443e);
  color: white;
  text-align: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
}

.deep-read__quiz-cta p {
  font-size: var(--font-size-sm);
  opacity: 0.9;
  margin-bottom: var(--spacing-md);
}

.deep-read__quiz-btn {
  padding: 10px 24px;
  background: white;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: 700;
  border-radius: var(--radius-base);
}

/* 文章内容 */
.deep-read__article {
  padding: var(--spacing-sm) 0;
}

.deep-read__article-p {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-md);
}

.deep-read__article-heading {
  font-weight: 700;
  color: var(--color-primary);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-md);
}
</style>
