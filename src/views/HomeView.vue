<template>
  <div class="home-view">
    <!-- 主视觉 -->
    <HeroSection @scroll-to-cases="scrollToCases" />

    <!-- 分隔线 -->
    <div class="home-view__divider"></div>

    <!-- 高能回顾视频 -->
    <section class="home-view__video-section">
      <div class="home-view__section-header">
        <span class="home-view__section-icon">🎬</span>
        <span class="home-view__section-label">高能回顾</span>
      </div>
      <h3 class="home-view__video-title">医保药品灵魂砍价名场面</h3>
      <div class="home-view__video-wrapper">
        <video
          class="home-view__video"
          controls
          preload="metadata"
          playsinline
        >
          <source src="/videos/negotiation-highlights.mp4" type="video/mp4" />
          您的浏览器不支持视频播放，请升级浏览器。
        </video>
      </div>
      <p class="home-view__video-caption">
        回顾真实医保谈判高能片段，感受国家谈判代表如何为百姓"灵魂砍价"
      </p>
    </section>

    <!-- 分隔线 -->
    <div class="home-view__divider"></div>

    <!-- 案例选择区 -->
    <section class="cases-section" ref="casesSectionRef">
      <div class="cases-section__header">
        <div class="home-view__section-header">
          <span class="home-view__section-icon">📋</span>
          <span class="home-view__section-label">精选案例</span>
        </div>
        <h2 class="cases-section__title">选择你的谈判案例</h2>
        <p class="cases-section__desc">
          每个案例对应一种真实的国谈场景。从不同维度感受政策制定的复杂性。
        </p>
      </div>

      <div class="cases-section__list">
        <CaseCard
          v-for="(c, idx) in casesWithStatus"
          :key="c.id"
          :case-id="c.id"
          :index="idx + 1"
          :name="c.name"
          :subtitle="c.subtitle"
          :difficulty="c.difficulty"
          :estimated-time="c.estimatedTime"
          :completed="c.completed"
          :locked="c.locked"
          @select="selectCase"
        />
      </div>
    </section>

    <!-- 底部 -->
    <footer class="home-view__footer">
      <div class="home-view__footer-seal">
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <rect x="2" y="6" width="24" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/>
          <path d="M14 2v8M10 2h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M8 13h4M8 17h8M8 21h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <span>国家医保局 · 政策科普</span>
      </div>
      <p>本产品为新闻互动游戏，所有谈判数据均为模拟情景</p>
      <p>不代表真实医保谈判结果 · 不具有医疗建议属性</p>
    </footer>

    <!-- 知识测验入口（浮窗） -->
    <div class="quiz-entry" @click="goToQuiz" v-if="hasCompletedAnyCase">
      <span class="quiz-entry__emoji">🧠</span>
      <span class="quiz-entry__text">知识测验</span>
      <span class="quiz-entry__badge" v-if="quizState.completed">
        {{ quizState.score }}分
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { caseSummaries } from '@/data/caseSummaries'
import { trackEvent, EventType } from '@/utils/analytics'
import HeroSection from '@/components/home/HeroSection.vue'
import CaseCard from '@/components/home/CaseCard.vue'

const router = useRouter()
const gameStore = useGameStore()
const casesSectionRef = ref(null)

function scrollToCases() {
  if (casesSectionRef.value) {
    casesSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const casesWithStatus = computed(() => {
  return caseSummaries.map((c, idx) => {
    const result = gameStore.caseResults[c.id]
    let locked = false
    if (idx >= 1) {
      const prevCase = caseSummaries[idx - 1]
      locked = !gameStore.caseResults[prevCase.id]?.completed
    }
    return {
      ...c,
      completed: result?.completed || false,
      locked
    }
  })
})

const hasCompletedAnyCase = computed(() => gameStore.completedCases > 0)
const quizState = computed(() => gameStore.quizState)

function selectCase(caseId) {
  trackEvent(EventType.CASE_SELECT, { caseId })
  router.push({ name: 'Intro', params: { caseId } })
}

function goToQuiz() {
  router.push({ name: 'Quiz' })
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fef9f5;
}

/* ===== 分隔线 ===== */
.home-view__divider {
  height: 1px;
  margin: 20px 20px 12px;
  background: linear-gradient(90deg, transparent, #e0d5cc 20%, #e0d5cc 80%, transparent);
}

/* ===== 通用区块标题 ===== */
.home-view__section-header {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
}

.home-view__section-icon {
  font-size: 15px;
}

.home-view__section-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #c9443e;
}

/* ===== 视频区域 ===== */
.home-view__video-section {
  padding: 20px 20px 0;
  margin-bottom: 28px;
}

.home-view__video-title {
  font-size: 16px;
  font-weight: 800;
  color: #333;
  margin-bottom: 12px;
}

.home-view__video-wrapper {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #000;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}

.home-view__video {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
}

.home-view__video-caption {
  margin-top: 8px;
  font-size: 10px;
  color: #ccc;
  text-align: center;
}

/* ===== 案例选择区 ===== */
.cases-section {
  flex: 1;
  padding: 10px 20px 20px;
}

.cases-section__header {
  margin-bottom: 18px;
}

.cases-section__title {
  font-size: 19px;
  font-weight: 800;
  color: #222;
  margin-bottom: 4px;
}

.cases-section__desc {
  font-size: 12px;
  color: #bbb;
  line-height: 1.6;
}

.cases-section__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== 底部 ===== */
.home-view__footer {
  padding: 32px 20px 48px;
  text-align: center;
}

.home-view__footer-seal {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 20px;
  font-size: 10px;
  color: #ccc;
  font-weight: 500;
  margin-bottom: 14px;
}

.home-view__footer p {
  font-size: 10px;
  color: #ddd;
  line-height: 1.7;
}

/* ===== 知识测验入口 ===== */
.quiz-entry {
  position: fixed;
  bottom: calc(24px + var(--safe-area-bottom));
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  cursor: pointer;
  z-index: var(--z-dropdown);
  transition: transform 0.15s ease;
}

.quiz-entry:active {
  transform: scale(0.95);
}

.quiz-entry__emoji { font-size: 15px; }
.quiz-entry__text { font-size: 12px; font-weight: 700; color: #555; }
.quiz-entry__badge {
  font-size: 10px;
  color: #27ae60;
  font-weight: 700;
  background: #e8f5e9;
  padding: 2px 8px;
  border-radius: 10px;
}
</style>
