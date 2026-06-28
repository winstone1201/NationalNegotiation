<template>
  <div class="budget">
    <h3 class="budget__title">医保基金结余状况</h3>
    <p class="budget__subtitle">你手中的谈判筹码——每一分钱都关乎千万人的医疗保障</p>

    <!-- 环形图 -->
    <div class="budget__chart" ref="chartRef">
      <svg viewBox="0 0 200 200" class="budget__ring">
        <!-- 背景圆环 -->
        <circle
          cx="100" cy="100" r="82"
          fill="none"
          stroke="var(--color-border-light)"
          stroke-width="12"
        />
        <!-- 已用部分 -->
        <circle
          cx="100" cy="100" r="82"
          fill="none"
          stroke="var(--color-accent-red)"
          stroke-width="12"
          stroke-linecap="round"
          :stroke-dasharray="`${usedPercent * 5.15} 515`"
          transform="rotate(-90 100 100)"
          class="budget__ring-used"
        />
        <!-- 剩余部分 -->
        <circle
          cx="100" cy="100" r="82"
          fill="none"
          stroke="var(--color-success)"
          stroke-width="12"
          stroke-linecap="round"
          :stroke-dasharray="`${remainingPercent * 5.15} 515`"
          :stroke-dashoffset="`${-usedPercent * 5.15}`"
          transform="rotate(-90 100 100)"
          class="budget__ring-remaining"
        />

        <!-- 中心文字 -->
        <text x="100" y="90" text-anchor="middle" class="budget__ring-label">
          剩余基金
        </text>
        <text x="100" y="120" text-anchor="middle" class="budget__ring-value font-number">
          {{ formatBudget(remainingBudget) }}
        </text>
      </svg>
    </div>

    <!-- 数据条 -->
    <div class="budget__bars">
      <div class="budget__bar-item">
        <div class="budget__bar-header">
          <span class="budget__bar-label">年度总预算</span>
          <span class="budget__bar-value font-number">{{ formatBudget(totalBudget) }}</span>
        </div>
        <div class="budget__bar-track">
          <div class="budget__bar-fill" style="width: 100%; background: var(--color-border);"></div>
        </div>
      </div>

      <div class="budget__bar-item">
        <div class="budget__bar-header">
          <span class="budget__bar-label">已分配支出</span>
          <span class="budget__bar-value font-number">{{ formatBudget(usedBudget) }}</span>
        </div>
        <div class="budget__bar-track">
          <div
            class="budget__bar-fill budget__bar-fill--used"
            :style="{ width: usedPercent + '%' }"
          ></div>
        </div>
      </div>

      <div class="budget__bar-item">
        <div class="budget__bar-header">
          <span class="budget__bar-label budget__bar-label--remaining">
            <span class="budget__dot budget__dot--green"></span>
            可用于本轮谈判
          </span>
          <span class="budget__bar-value budget__bar-value--remaining font-number">
            {{ formatBudget(remainingBudget) }}
          </span>
        </div>
        <div class="budget__bar-track">
          <div
            class="budget__bar-fill budget__bar-fill--remaining"
            :style="{ width: remainingPercent + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 提示 -->
    <p class="budget__tip">
      ⚠️ 基金池有限，你需要在"保基本"与"促创新"之间找到平衡点
    </p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  totalBudget: { type: Number, default: 450 },     // 亿元
  usedBudget: { type: Number, default: 380 },
  remainingBudget: { type: Number, default: 70 }
})

const chartRef = ref(null)

const usedPercent = computed(() => {
  return Math.round((props.usedBudget / props.totalBudget) * 100)
})

const remainingPercent = computed(() => {
  return 100 - usedPercent.value
})

function formatBudget(value) {
  return value.toFixed(0) + '亿'
}

onMounted(() => {
  if (chartRef.value) {
    gsap.from(chartRef.value.querySelector('.budget__ring-remaining'), {
      strokeDashoffset: 515,
      duration: 1.5,
      ease: 'power2.out'
    })
  }
})
</script>

<style scoped>
.budget {
  padding: var(--spacing-lg) 0;
}

.budget__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.budget__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-lg);
}

/* 环形图 */
.budget__chart {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.budget__ring {
  width: 160px;
  height: 160px;
}

.budget__ring-label {
  font-size: 12px;
  fill: var(--color-text-tertiary);
}

.budget__ring-value {
  font-size: 24px;
  font-weight: 700;
  fill: var(--color-text-primary);
}

/* 数据条 */
.budget__bars {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.budget__bar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.budget__bar-header {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
}

.budget__bar-label {
  color: var(--color-text-secondary);
}

.budget__bar-label--remaining {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

.budget__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.budget__dot--green {
  background: var(--color-success);
}

.budget__bar-value {
  color: var(--color-text-secondary);
}

.budget__bar-value--remaining {
  color: var(--color-success);
  font-weight: 700;
}

.budget__bar-track {
  height: 8px;
  background: var(--color-bg);
  border-radius: 4px;
  overflow: hidden;
}

.budget__bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1.5s ease;
}

.budget__bar-fill--used {
  background: linear-gradient(90deg, #e67e22, #e74c3c);
}

.budget__bar-fill--remaining {
  background: linear-gradient(90deg, #27ae60, #2ecc71);
}

/* 提示 */
.budget__tip {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-align: center;
  padding: var(--spacing-sm);
  background: var(--color-bg);
  border-radius: var(--radius-sm);
}
</style>
