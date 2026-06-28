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
          <span class="drug-card__label">药经评分</span>
          <span class="drug-card__value">
            <span class="drug-card__qaly">{{ drugInfo.qalyScore }}</span>
            <span class="drug-card__explain">（{{ drugInfo.qalyExplain }}）</span>
          </span>
        </div>

        <!-- 参照药标准 -->
        <div class="drug-card__row">
          <span class="drug-card__label">参照药价格</span>
          <span class="drug-card__value font-number">{{ formatPrice(drugInfo.referencePrice) }} 元</span>
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
import { ref } from 'vue'

defineProps({
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
