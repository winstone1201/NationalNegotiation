<template>
  <div class="fund-bar">
    <div class="fund-bar__info">
      <span class="fund-bar__label">剩余谈判基金</span>
      <span class="fund-bar__value font-number">
        <span class="fund-bar__number" ref="numberRef">{{ displayRemaining }}</span> 亿元
      </span>
    </div>
    <div class="fund-bar__track">
      <div
        class="fund-bar__fill"
        :style="{ width: percent + '%' }"
        :class="{ 'fund-bar__fill--low': percent < 15, 'fund-bar__fill--warn': percent < 30 && percent >= 15 }"
        ref="fillRef"
      ></div>
    </div>
    <div class="fund-bar__limits">
      <span class="fund-bar__limit font-number">{{ formatBudget(min) }}</span>
      <span class="fund-bar__limit font-number">{{ formatBudget(max) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  current: { type: Number, default: 70 },
  max: { type: Number, default: 70 },
  min: { type: Number, default: 0 }
})

const numberRef = ref(null)
const fillRef = ref(null)

const percent = computed(() => {
  if (props.max <= props.min) return 0
  return Math.max(0, Math.min(100, ((props.current - props.min) / (props.max - props.min)) * 100))
})

const displayRemaining = computed(() => props.current.toFixed(1))

function formatBudget(value) {
  if (value == null) return '--亿'
  return value.toFixed(0) + '亿'
}

watch(() => props.current, (newVal, oldVal) => {
  if (fillRef.value) {
    gsap.fromTo(fillRef.value,
      { width: `${((oldVal - props.min) / (props.max - props.min)) * 100}%` },
      { width: `${percent.value}%`, duration: 0.5, ease: 'power2.out' }
    )
  }
  // 数字跳动
  if (numberRef.value) {
    gsap.fromTo(numberRef.value,
      { scale: 1.1, color: '#e74c3c' },
      { scale: 1, color: '#1a1a1a', duration: 0.3 }
    )
  }
})
</script>

<style scoped>
.fund-bar {
  padding: var(--spacing-sm) var(--spacing-base);
}

.fund-bar__info {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.fund-bar__label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.fund-bar__value {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.fund-bar__number {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.fund-bar__track {
  height: 6px;
  background: var(--color-border-light);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.fund-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  border-radius: 3px;
  transition: width 0.5s ease, background 0.3s ease;
}

.fund-bar__fill--warn {
  background: linear-gradient(90deg, #f39c12, #e67e22);
}

.fund-bar__fill--low {
  background: linear-gradient(90deg, #e74c3c, #c0392b);
}

.fund-bar__limits {
  display: flex;
  justify-content: space-between;
}

.fund-bar__limit {
  font-size: 10px;
  color: var(--color-text-tertiary);
}
</style>
