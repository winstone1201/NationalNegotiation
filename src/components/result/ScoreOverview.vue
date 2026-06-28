<template>
  <div class="score-overview">
    <!-- 成功/失败大横幅 -->
    <div
      class="score-overview__banner"
      :class="result.success ? 'score-overview__banner--success' : 'score-overview__banner--fail'"
      ref="bannerRef"
    >
      <div class="score-overview__banner-glow"></div>
      <div class="score-overview__banner-icon">{{ result.success ? '🎉' : '😔' }}</div>
      <h2 class="score-overview__banner-title">
        {{ result.success ? '谈判成功！' : '谈判未能达成' }}
      </h2>
      <p class="score-overview__banner-desc">
        {{ result.success
          ? `药品成功纳入国家医保目录，${beneficiaryCountLabel}患者将因此受益`
          : '本次谈判未能达成协议。但别灰心——真实的国谈也常常经历多次拉锯。'
        }}
      </p>
    </div>

    <!-- 核心数据 -->
    <div class="score-overview__stats">
      <div class="score-overview__stat">
        <span class="score-overview__stat-label">药企初始报价</span>
        <span class="score-overview__stat-value font-number">{{ formatPrice(initialPrice) }}元</span>
      </div>
      <div class="score-overview__stat">
        <span class="score-overview__stat-label">你砍到</span>
        <span class="score-overview__stat-value score-overview__stat-value--highlight font-number">
          {{ formatPrice(result.finalPrice) }}元
        </span>
      </div>
      <div class="score-overview__stat">
        <span class="score-overview__stat-label">砍价幅度</span>
        <span class="score-overview__stat-value score-overview__stat-value--discount font-number">
          {{ result.discountPercent }}
        </span>
      </div>
    </div>

    <!-- 社会影响 -->
    <div class="score-overview__impact" v-if="totalSavings > 0">
      <div class="score-overview__impact-row">
        <span class="score-overview__impact-label">💡 年度医保基金节省</span>
        <span class="score-overview__impact-value">{{ formatTotalSavings }}</span>
      </div>
      <p class="score-overview__impact-msg" v-if="result.success">
        你让<strong>{{ beneficiaryCountLabel }}名患者</strong>用上了负担得起的救命药。每一个数字背后，都是一个鲜活的生命。
      </p>
      <p class="score-overview__impact-msg" v-else>
        你为<strong>{{ beneficiaryCountLabel }}名患者</strong>发出了声音。谈判官的字典里没有"放弃"——再试一次。
      </p>
    </div>

    <!-- 策略画像 -->
    <div class="score-overview__strategy">
      <h4 class="score-overview__strategy-title">你的谈判风格</h4>
      <div class="score-overview__strategy-chart" v-if="strategyProfile">
        <div class="score-overview__strategy-bar" v-for="item in strategyBars" :key="item.key">
          <span class="score-overview__strategy-label">{{ item.label }}</span>
          <div class="score-overview__strategy-track">
            <div
              class="score-overview__strategy-fill"
              :class="'score-overview__strategy-fill--' + item.key"
              :style="{ width: item.value + '%' }"
            ></div>
          </div>
          <span class="score-overview__strategy-pct">{{ item.value }}%</span>
        </div>
      </div>
      <p class="score-overview__strategy-dominant">
        主导风格：<strong>{{ dominantStrategy }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  result: { type: Object, required: true },
  initialPrice: { type: Number, default: 0 },
  beneficiaryCount: { type: Number, default: 0 },
  strategyProfile: {
    type: Object,
    default: () => ({ pressure: 0, empathy: 0, technical: 0 })
  },
  dominantStrategy: { type: String, default: '' }
})

const bannerRef = ref(null)

const beneficiaryCountLabel = computed(() => {
  const n = props.beneficiaryCount
  if (n >= 100000000) return (n / 100000000).toFixed(1) + '亿'
  if (n >= 10000) return (n / 10000).toFixed(0) + '万'
  return n.toLocaleString('zh-CN')
})

const strategyBars = computed(() => [
  { key: 'pressure', label: '施压型', value: props.strategyProfile?.pressure || 0 },
  { key: 'empathy', label: '情理型', value: props.strategyProfile?.empathy || 0 },
  { key: 'technical', label: '技术型', value: props.strategyProfile?.technical || 0 }
])

const totalSavings = computed(() => {
  const saved = Math.max(0, props.initialPrice - props.result.finalPrice)
  return saved * props.beneficiaryCount
})

const formatTotalSavings = computed(() => {
  const val = totalSavings.value
  if (val >= 100000000) return (val / 100000000).toFixed(1) + '亿元'
  if (val >= 10000) return (val / 10000).toFixed(0) + '万元'
  return formatPrice(val)
})

function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  if (Number.isInteger(price)) return price.toFixed(0)
  return price.toFixed(1)
}

onMounted(() => {
  if (bannerRef.value && props.result.success) {
    bannerRef.value.style.animation = 'none'
    bannerRef.value.offsetHeight // trigger reflow
    bannerRef.value.style.animation = ''
  }
})
</script>

<style scoped>
.score-overview {
  padding: var(--spacing-base);
}

/* ===== 横幅 ===== */
.score-overview__banner {
  position: relative;
  text-align: center;
  padding: 28px 20px;
  border-radius: 16px;
  margin-bottom: var(--spacing-lg);
  overflow: hidden;
}

.score-overview__banner--success {
  background: linear-gradient(135deg, #b5343a 0%, #c9443e 30%, #d44637 100%);
  color: #fff;
  box-shadow:
    0 8px 32px rgba(181, 52, 58, 0.25),
    0 2px 8px rgba(181, 52, 58, 0.15);
  animation: bannerPop 0.55s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes bannerPop {
  0% { opacity: 0; transform: scale(0.9) translateY(12px); }
  60% { transform: scale(1.02) translateY(-2px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.score-overview__banner--fail {
  background: linear-gradient(135deg, #f5f5f5, #eeeeee);
  color: #666;
}

.score-overview__banner-glow {
  position: absolute;
  top: -50%;
  left: 20%;
  width: 60%;
  height: 200%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%);
  pointer-events: none;
}

.score-overview__banner-icon {
  font-size: 40px;
  margin-bottom: 6px;
  animation: iconBounce 0.6s 0.2s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

@keyframes iconBounce {
  0% { opacity: 0; transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

.score-overview__banner-title {
  font-size: 22px;
  font-weight: 900;
  margin-bottom: 8px;
  letter-spacing: 1px;
  animation: bannerPop 0.55s 0.1s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.score-overview__banner--success .score-overview__banner-title {
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.15);
}

.score-overview__banner--fail .score-overview__banner-title {
  color: #999;
}

.score-overview__banner-desc {
  font-size: 13px;
  line-height: 1.7;
  animation: bannerPop 0.55s 0.2s cubic-bezier(0.22, 0.61, 0.36, 1) both;
}

.score-overview__banner--success .score-overview__banner-desc {
  color: rgba(255,255,255,0.85);
}

.score-overview__banner--fail .score-overview__banner-desc {
  color: #aaa;
}

/* ===== 数据卡片 ===== */
.score-overview__stats {
  display: flex;
  gap: 8px;
  margin-bottom: var(--spacing-lg);
}

.score-overview__stat {
  flex: 1;
  background: var(--color-bg-white);
  border-radius: 12px;
  padding: 14px 10px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.score-overview__stat-label {
  display: block;
  font-size: 10px;
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
  font-weight: 500;
}

.score-overview__stat-value {
  font-size: 18px;
  font-weight: 800;
  color: var(--color-text-primary);
}

.score-overview__stat-value--highlight {
  color: #c9443e;
}

.score-overview__stat-value--discount {
  color: #27ae60;
}

/* ===== 社会影响 ===== */
.score-overview__impact {
  background: linear-gradient(135deg, #fff5f5, #fff0ed);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: var(--spacing-lg);
  border: 1px solid rgba(181, 52, 58, 0.08);
}

.score-overview__impact-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.score-overview__impact-label {
  font-size: 13px;
  font-weight: 700;
  color: #555;
}

.score-overview__impact-value {
  font-size: 20px;
  font-weight: 900;
  color: #b5343a;
  font-family: var(--font-family-number);
}

.score-overview__impact-msg {
  font-size: 12px;
  color: #888;
  line-height: 1.7;
  padding-top: 10px;
  border-top: 1px dashed rgba(181, 52, 58, 0.12);
}

.score-overview__impact-msg strong {
  color: #b5343a;
  font-weight: 800;
}

/* ===== 策略画像 ===== */
.score-overview__strategy {
  background: var(--color-bg-white);
  border-radius: 14px;
  padding: var(--spacing-lg);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.04);
}

.score-overview__strategy-title {
  font-size: var(--font-size-md);
  font-weight: 700;
  margin-bottom: var(--spacing-md);
}

.score-overview__strategy-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.score-overview__strategy-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  min-width: 48px;
}

.score-overview__strategy-track {
  flex: 1;
  height: 10px;
  background: var(--color-bg);
  border-radius: 5px;
  overflow: hidden;
}

.score-overview__strategy-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 1s var(--ease-out-expo);
}

.score-overview__strategy-fill--pressure { background: #e74c3c; }
.score-overview__strategy-fill--empathy { background: #e67e22; }
.score-overview__strategy-fill--technical { background: #27ae60; }

.score-overview__strategy-pct {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 36px;
  text-align: right;
}

.score-overview__strategy-dominant {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}
</style>
