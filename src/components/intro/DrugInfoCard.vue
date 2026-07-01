<template>
  <div class="drug-card">
    <!-- 头部 -->
    <div class="drug-card__header" @click="expanded = !expanded">
      <div class="drug-card__header-left">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="14" height="14" rx="3" stroke="var(--color-primary)" stroke-width="1.5"/>
          <path d="M7 7h6M7 10h6M7 13h4" stroke="var(--color-primary)" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <h3 class="drug-card__title">药品信息卡</h3>
      </div>
      <svg
        class="drug-card__chevron"
        :class="{ 'drug-card__chevron--expanded': expanded }"
        width="20" height="20" viewBox="0 0 20 20" fill="none"
      >
        <path d="M7 8l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>

    <!-- 展开内容 -->
    <transition name="fade">
      <div class="drug-card__body" v-if="expanded">
        <!-- 通用名/商品名 -->
        <div class="drug-card__row">
          <span class="drug-card__label">药品名称</span>
          <span class="drug-card__value">
            <strong>{{ drugInfo.genericName }}</strong>
            <span class="drug-card__brand">（商品名：{{ drugInfo.brandName }}）</span>
          </span>
        </div>

        <!-- 适应症 -->
        <div class="drug-card__row">
          <span class="drug-card__label">适应症</span>
          <span class="drug-card__value drug-card__value--highlight">
            {{ drugInfo.indicationPlain }}
          </span>
        </div>

        <div class="drug-card__divider"></div>

        <!-- 企业初始报价 -->
        <div class="drug-card__row drug-card__row--price">
          <span class="drug-card__label">企业报价</span>
          <span class="drug-card__price">{{ formatPrice(drugInfo.initialPrice) }} <small>元/支</small></span>
        </div>

        <!-- 药物经济学评分 -->
        <div class="drug-card__row">
          <span class="drug-card__label">
            药经评分
            <span class="drug-card__help" @click.stop="showQalyTip = !showQalyTip">?</span>
          </span>
          <span class="drug-card__value">
            <span class="drug-card__qaly-bar" :class="qalyLevel">
              <span class="drug-card__qaly-fill" :style="{ width: (drugInfo.qalyScore * 100) + '%' }"></span>
            </span>
            <span class="drug-card__qaly-num">{{ drugInfo.qalyScore }}</span>
          </span>
        </div>

        <!-- QALY 通俗解释 -->
        <div class="drug-card__qaly-tip" v-if="showQalyTip">
          <p><strong>药物经济学评分</strong>：综合衡量"花多少钱买多少健康"的指标。</p>
          <p>• <strong>0.8以上</strong>：物超所值，医保基金花得值。<br>
          • <strong>0.65-0.8</strong>：在争议区间，需要谈判降价。<br>
          • <strong>0.65以下</strong>：性价比偏低，必须大幅降价才能进目录。</p>
          <p class="drug-card__qaly-tip-note">{{ drugInfo.qalyExplain }}</p>
        </div>

        <div class="drug-card__divider"></div>

        <!-- 医保影响 -->
        <div class="drug-card__row">
          <span class="drug-card__label">基金影响</span>
          <span class="drug-card__value">{{ drugInfo.budgetImpact }}</span>
        </div>

        <!-- 受益人 -->
        <div class="drug-card__row">
          <span class="drug-card__label">预计受益人</span>
          <span class="drug-card__value">
            <strong class="drug-card__beneficiary">{{ drugInfo.beneficiaryCount.toLocaleString() }}</strong> 人/年
          </span>
        </div>
      </div>
    </transition>

    <!-- 折叠时的摘要信息 -->
    <div class="drug-card__summary" v-if="!expanded">
      <span class="drug-card__summary-item">
        报价 <strong class="font-number">{{ formatPrice(drugInfo.initialPrice) }}元</strong>
      </span>
      <span class="drug-card__summary-divider">|</span>
      <span class="drug-card__summary-item">
        患者 <strong>{{ drugInfo.beneficiaryCount.toLocaleString() }}人</strong>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  drugInfo: {
    type: Object,
    required: true,
    default: () => ({
      genericName: '',
      brandName: '',
      indication: '',
      indicationPlain: '',
      initialPrice: 0,
      qalyScore: 0,
      qalyExplain: '',
      referencePrice: 0,
      budgetImpact: '',
      beneficiaryCount: 0
    })
  }
})

const expanded = ref(false)
const showQalyTip = ref(false)

const qalyLevel = computed(() => {
  if (!props.drugInfo?.qalyScore) return ''
  if (props.drugInfo.qalyScore >= 0.8) return 'qaly--good'
  if (props.drugInfo.qalyScore >= 0.65) return 'qaly--warn'
  return 'qaly--bad'
})

function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  return price.toLocaleString('zh-CN')
}
</script>

<style scoped>
.drug-card {
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1.5px solid var(--color-border-light);
  overflow: hidden;
}

/* 头部 */
.drug-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-base) var(--spacing-lg);
  cursor: pointer;
}

.drug-card__header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.drug-card__title {
  font-size: var(--font-size-md);
  font-weight: 700;
  color: var(--color-text-primary);
}

.drug-card__chevron {
  color: var(--color-text-tertiary);
  transition: transform var(--transition-base);
}

.drug-card__chevron--expanded {
  transform: rotate(180deg);
}

/* 摘要 */
.drug-card__summary {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-lg) var(--spacing-base);
}

.drug-card__summary-item {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.drug-card__summary-divider {
  color: var(--color-border);
}

/* 主体 */
.drug-card__body {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.drug-card__row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: 6px 0;
  font-size: var(--font-size-sm);
}

.drug-card__row--price {
  align-items: center;
}

.drug-card__label {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  min-width: 60px;
  font-size: var(--font-size-xs);
}

.drug-card__value {
  color: var(--color-text-primary);
  flex: 1;
}

.drug-card__value--highlight {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.drug-card__brand {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-xs);
}

.drug-card__price {
  font-family: var(--font-family-number);
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-accent-red);
}

.drug-card__price small {
  font-size: var(--font-size-sm);
  font-weight: 400;
  color: var(--color-text-tertiary);
}

.drug-card__help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-border);
  color: var(--color-text-tertiary);
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  margin-left: 2px;
  transition: all 0.15s;
}

.drug-card__help:hover {
  background: var(--color-primary);
  color: white;
}

/* QALY 色条 */
.drug-card__qaly-bar {
  display: inline-flex;
  width: 60px;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
  vertical-align: middle;
  margin-right: 6px;
}

.drug-card__qaly-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.qaly--good .drug-card__qaly-fill { background: #43a047; }
.qaly--warn .drug-card__qaly-fill { background: #ff9800; }
.qaly--bad .drug-card__qaly-fill { background: #e53935; }

.drug-card__qaly-num {
  font-family: var(--font-family-number);
  font-weight: 700;
  font-size: var(--font-size-md);
}

.qaly--good .drug-card__qaly-num { color: #43a047; }
.qaly--warn .drug-card__qaly-num { color: #e65100; }
.qaly--bad .drug-card__qaly-num { color: #e53935; }

/* QALY 提示 */
.drug-card__qaly-tip {
  background: #f5f7fa;
  border-radius: var(--radius-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  margin: 4px 0 8px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.drug-card__qaly-tip p {
  margin-bottom: 4px;
}

.drug-card__qaly-tip-note {
  color: var(--color-text-tertiary);
  font-style: italic;
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px dashed var(--color-border);
}

.drug-card__qaly {
  font-family: var(--font-family-number);
  font-weight: 700;
  color: var(--color-accent-orange);
}

.drug-card__explain {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.drug-card__beneficiary {
  font-family: var(--font-family-number);
  font-size: var(--font-size-md);
  color: var(--color-primary);
}

.drug-card__divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 6px 0;
}
</style>
