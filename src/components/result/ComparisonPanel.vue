<template>
  <div class="comparison">
    <h3 class="comparison__title">与真实谈判官对比</h3>
    <p class="comparison__subtitle">
      {{ realResult.year }}年，{{ realResult.negotiatorName }}在真实谈判中取得了以下成果：
    </p>

    <!-- 价格对比 -->
    <div class="comparison__prices">
      <div class="comparison__price comparison__price--player">
        <span class="comparison__price-label">你的结果</span>
        <span class="comparison__price-value font-number">{{ formatPrice(playerFinalPrice) }} 元</span>
      </div>
      <div class="comparison__vs">
        <span>VS</span>
      </div>
      <div class="comparison__price comparison__price--real">
        <span class="comparison__price-label">真实谈判</span>
        <span class="comparison__price-value font-number">{{ formatPrice(realResult.finalPrice) }} 元</span>
        <span class="comparison__price-tag">{{ realResult.discount }}</span>
      </div>
    </div>

    <!-- 核心对比文案 -->
    <div class="comparison__verdict" :class="difference >= 0 ? 'comparison__verdict--better' : 'comparison__verdict--worse'">
      <div class="comparison__verdict-icon">{{ difference >= 0 ? '💪' : '📖' }}</div>
      <p class="comparison__verdict-text">
        <template v-if="difference > 0">
          你比真实谈判官<strong>多砍了 {{ formatPrice(difference) }} 元</strong>！
          但请注意——真实谈判需要在基金安全与药品可及性之间找到精妙平衡，过度压价可能导致药企退出中国市场。
        </template>
        <template v-else-if="difference === 0">
          你和真实谈判官<strong>砍到了相同的价格</strong>！这种精准的判断力正是国谈代表最核心的素质。
        </template>
        <template v-else>
          你比真实谈判官<strong>少砍了 {{ formatPrice(Math.abs(difference)) }} 元</strong>。
          但不必气馁——真实的国谈代表背后有数十人的药物经济学团队支持，而你只凭自己的判断完成了这场谈判。
        </template>
      </p>
    </div>

    <!-- 真实谈判官名言 -->
    <div class="comparison__quote" v-if="realResult.negotiatorQuote">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 4h3v5H4.5c-.8 0-1.5.7-1.5 1.5V12H3V4zM9 4h3v5h-1.5c-.8 0-1.5.7-1.5 1.5V12H9V4z" fill="currentColor" opacity="0.3"/>
      </svg>
      <p>"{{ realResult.negotiatorQuote }}"</p>
      <span>—— {{ realResult.negotiatorName }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  playerFinalPrice: { type: Number, default: 0 },
  realResult: {
    type: Object,
    default: () => ({
      finalPrice: 0,
      discount: '',
      negotiatorName: '',
      negotiatorQuote: '',
      year: 2025
    })
  }
})

const difference = computed(() => props.realResult.finalPrice - props.playerFinalPrice)

function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  return price.toFixed(2)
}
</script>

<style scoped>
.comparison {
  padding: var(--spacing-lg) var(--spacing-base);
}

.comparison__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: 4px;
}

.comparison__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xl);
}

/* 价格对比 */
.comparison__prices {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.comparison__price {
  flex: 1;
  text-align: center;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.comparison__price--player {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
}

.comparison__price--real {
  background: linear-gradient(135deg, #f3e5f5, #e1bee7);
}

.comparison__price-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: 4px;
}

.comparison__price-value {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-text-primary);
}

.comparison__price-tag {
  display: inline-block;
  margin-top: 4px;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: #7b1fa2;
}

.comparison__vs {
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-text-tertiary);
}

/* 判决 */
.comparison__verdict {
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-xl);
}

.comparison__verdict--better {
  background: #e8f5e9;
}

.comparison__verdict--worse {
  background: #fff3e0;
}

.comparison__verdict-icon {
  font-size: 24px;
  margin-bottom: var(--spacing-sm);
}

.comparison__verdict-text {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
}

/* 引用 */
.comparison__quote {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--color-primary);
}

.comparison__quote p {
  font-size: var(--font-size-md);
  font-style: italic;
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-sm);
}

.comparison__quote span {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}
</style>
