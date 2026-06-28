<template>
  <div class="result-view">
    <TopBar title="谈判复盘" />

    <!-- 加载状态 -->
    <div class="result-view__loading" v-if="!caseResult">
      <LoadingScreen message="正在生成复盘报告..." />
    </div>

    <!-- 复盘内容 -->
    <div class="result-view__content" v-else>
      <!-- 成绩总览 -->
      <ScoreOverview
        :result="negotiationResult"
        :initial-price="caseData.drugInfo.initialPrice"
        :beneficiary-count="caseData.drugInfo.beneficiaryCount"
        :strategy-profile="caseResult.strategyProfile"
        :dominant-strategy="caseResult.dominantStrategy"
      />

      <!-- 与真实谈判官对比 -->
      <div class="result-view__section-divider">
        <span>与历史对照</span>
      </div>
      <ComparisonPanel
        :player-final-price="caseResult.finalPrice"
        :real-result="caseData.realResult"
      />

      <!-- 分享卡片 -->
      <div class="result-view__section-divider">
        <span>分享成绩</span>
      </div>
      <ShareCard
        :case-name="caseData.name"
        :initial-price="caseData.drugInfo.initialPrice"
        :final-price="caseResult.finalPrice"
        :real-price="caseData.realResult.finalPrice"
        :strategy-label="caseResult.dominantStrategy"
        :discount-percent="caseResult.discountPercent"
        :is-success="caseResult.success"
      />

      <!-- 深度阅读 -->
      <div class="result-view__section-divider">
        <span>延伸阅读</span>
      </div>
      <DeepReadLinks
        :links="caseData.deepReads"
        :policy-tags="caseData.policyTags"
        @go-quiz="goToQuiz"
      />
    </div>

    <!-- 底部按钮 -->
    <div class="result-view__bottom" v-if="caseResult">
      <button class="result-view__btn result-view__btn--retry" @click="retryCase">
        再试一次
      </button>
      <button class="result-view__btn result-view__btn--home" @click="goHome">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { getNegotiationCase } from '@/data/negotiationCases'
import { trackPageView } from '@/utils/analytics'
import TopBar from '@/components/common/TopBar.vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import ScoreOverview from '@/components/result/ScoreOverview.vue'
import ComparisonPanel from '@/components/result/ComparisonPanel.vue'
import ShareCard from '@/components/result/ShareCard.vue'
import DeepReadLinks from '@/components/result/DeepReadLinks.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const caseId = computed(() => route.params.caseId)
const caseData = computed(() => getNegotiationCase(caseId.value))
const caseResult = computed(() => gameStore.caseResults[caseId.value] || null)

const negotiationResult = computed(() => ({
  finalPrice: caseResult.value?.finalPrice || 0,
  discountPercent: caseResult.value?.discountPercent || '0%',
  success: caseResult.value?.success || false
}))

function retryCase() {
  gameStore.startCase(caseId.value)
  router.push({ name: 'Negotiation', params: { caseId: caseId.value } })
}

function goHome() {
  router.push({ name: 'Home' })
}

function goToQuiz() {
  router.push({ name: 'Quiz' })
}

onMounted(() => {
  trackPageView('Result', { caseId: caseId.value })

  // 如果没有结果数据，重定向到首页
  if (!caseResult.value) {
    // 可以从 negotiation 状态重建，但简单处理就是允许查看
  }
})
</script>

<style scoped>
.result-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg);
}

.result-view__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-view__content {
  flex: 1;
  padding-bottom: 80px;
}

/* 分割线 */
.result-view__section-divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-2xl) var(--spacing-base);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 1px;
}

.result-view__section-divider::before,
.result-view__section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

/* 底部按钮 */
.result-view__bottom {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-content-width);
  background: var(--color-bg-white);
  padding: var(--spacing-base);
  padding-bottom: calc(var(--spacing-base) + var(--safe-area-bottom));
  display: flex;
  gap: var(--spacing-md);
  box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
}

.result-view__btn {
  flex: 1;
  padding: 12px;
  font-size: var(--font-size-md);
  font-weight: 600;
  border-radius: var(--radius-base);
  text-align: center;
}

.result-view__btn--retry {
  background: var(--color-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.result-view__btn--home {
  background: var(--color-primary);
  color: white;
}
</style>
