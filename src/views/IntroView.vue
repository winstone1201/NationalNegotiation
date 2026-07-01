<template>
  <div class="intro-view">
    <TopBar title="谈判背景" />

    <!-- 加载状态 -->
    <div class="intro-view__loading" v-if="!drugInfo">
      <LoadingScreen message="加载案例数据..." />
    </div>

    <!-- 内容区 -->
    <template v-else>
      <div class="intro-view__content">
        <!-- 第一屏：任命书 -->
        <AppointmentLetter
          :case-name="caseName"
          :drug-name="drugInfo.genericName"
          :mission="missionText"
        />

        <!-- 患者故事 -->
        <div class="intro-view__story" v-if="drugInfo.patientStory">
          <div class="intro-view__story-card">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="intro-view__story-quote">
              <path d="M6 17l-3-5V5h8v7l-3 5H6zm10 0l-3-5V5h8v7l-3 5h-2z" fill="currentColor" opacity="0.3"/>
            </svg>
            <p>{{ drugInfo.patientStory }}</p>
          </div>
        </div>

        <!-- 分割线 -->
        <div class="intro-view__section-divider">
          <span>知己知彼</span>
        </div>

        <!-- 第二屏：药品信息 -->
        <section class="intro-view__section">
          <DrugInfoCard :drug-info="drugInfo" />
        </section>

        <!-- 第三屏：基金状况 -->
        <section class="intro-view__section">
          <BudgetDisplay
            :total-budget="budgetData.totalBudget"
            :used-budget="budgetData.usedBudget"
            :remaining-budget="budgetData.remainingBudget"
          />
        </section>
      </div>

      <!-- 底部操作栏 -->
      <div class="intro-view__action-bar">
        <button class="intro-view__start-btn" @click="startNegotiation">
          <span>开始谈判</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10h12M11 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <p class="intro-view__action-hint">你将代表国家医保局进行两轮谈判</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { caseDrugInfoMap, budgetDataMap } from '@/data/caseDrugInfo'
import { caseSummaries } from '@/data/caseSummaries'
import { trackPageView, trackEvent, EventType } from '@/utils/analytics'
import TopBar from '@/components/common/TopBar.vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import AppointmentLetter from '@/components/intro/AppointmentLetter.vue'
import DrugInfoCard from '@/components/intro/DrugInfoCard.vue'
import BudgetDisplay from '@/components/intro/BudgetDisplay.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const caseId = computed(() => route.params.caseId)

const caseSummary = computed(() =>
  caseSummaries.find(c => c.id === caseId.value)
)

const drugInfo = computed(() =>
  caseDrugInfoMap[caseId.value] || null
)

const budgetData = computed(() =>
  budgetDataMap[caseId.value] || { totalBudget: 450, usedBudget: 380, remainingBudget: 70 }
)

const caseName = computed(() =>
  caseSummary.value?.name || '未知案例'
)

const missionText = computed(() => {
  const missions = {
    'chronic-renewal-3': '你今天的任务：为2亿慢病患者的日常用药争取一个公平的续约价格。他们中的很多人，每天的"小蓝片"就是生活的底线。',
    'rare-disease-1': '你今天的任务：为1200个罕见病患儿家庭争取最后一个希望。每一个百分点价格的让步，都意味着多一个孩子能站起来。',
    'tumor-drug-2': '你今天的任务：代表国家医保，与全球肿瘤药巨头进行定价博弈。用14亿人的市场规模，为8.5万肿瘤患者争取一个全球最公平的价格。'
  }
  return missions[caseId.value] || ''
})

function startNegotiation() {
  gameStore.startCase(caseId.value)
  trackEvent(EventType.NEGOTIATION_START, { caseId: caseId.value })
  router.push({ name: 'Negotiation', params: { caseId: caseId.value } })
}

onMounted(() => {
  trackPageView('Intro', { caseId: caseId.value })
})
</script>

<style scoped>
.intro-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.intro-view__loading {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-view__content {
  flex: 1;
  padding-bottom: 100px; /* 为底部操作栏留空间 */
}

/* 患者故事 */
.intro-view__story {
  padding: 0 var(--spacing-base);
  margin-top: -var(--spacing-md);
}

.intro-view__story-card {
  position: relative;
  background: linear-gradient(135deg, #fef9f0, #fff5f5);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.intro-view__story-quote {
  color: var(--color-primary);
  opacity: 0.2;
  margin-bottom: var(--spacing-xs);
}

/* 分割线 */
.intro-view__section-divider {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl) var(--spacing-2xl);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.intro-view__section-divider::before,
.intro-view__section-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

/* 分区 */
.intro-view__section {
  padding: 0 var(--spacing-base);
  margin-bottom: var(--spacing-lg);
}

/* 底部操作栏 */
.intro-view__action-bar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--max-content-width);
  background: var(--color-bg-white);
  padding: var(--spacing-base) var(--spacing-base);
  padding-bottom: calc(var(--spacing-base) + var(--safe-area-bottom));
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.intro-view__start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #b5343a, #c9443e);
  color: white;
  font-size: var(--font-size-lg);
  font-weight: 700;
  border-radius: var(--radius-lg);
  letter-spacing: 1px;
  transition: all var(--transition-base);
}

.intro-view__start-btn:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #7a1f23, #b5343a);
}

.intro-view__action-hint {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}
</style>
