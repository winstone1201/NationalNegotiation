<template>
  <div
    class="case-card"
    :class="{
      'case-card--completed': completed,
      'case-card--locked': locked
    }"
    :style="cardStyle"
    @click="handleClick"
  >
    <!-- 装饰图标 -->
    <div class="case-card__icon" v-if="visualTheme?.icon">{{ visualTheme.icon }}</div>

    <!-- 顶部标签区 -->
    <div class="case-card__tags">
      <span class="case-card__index">NO.{{ index }}</span>
      <span class="case-card__difficulty" :class="'case-card__difficulty--' + difficulty">
        {{ difficultyLabel }}
      </span>
      <span class="case-card__theme-label" v-if="visualTheme?.label" :style="{ color: visualTheme.accentColor }">
        {{ visualTheme.label }}
      </span>
      <span class="case-card__time">
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1"/>
          <path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
        </svg>
        {{ estimatedTime }}
      </span>
    </div>

    <!-- 主体信息 -->
    <div class="case-card__body">
      <h3 class="case-card__name">{{ name }}</h3>
      <p class="case-card__subtitle">{{ subtitle }}</p>
    </div>

    <!-- 底部操作区 -->
    <div class="case-card__footer">
      <template v-if="completed">
        <span class="case-card__completed-badge">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11.5 4L5.5 10 2.5 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          已砍成功
        </span>
        <span class="case-card__action-text">重新挑战 →</span>
      </template>
      <template v-else-if="locked">
        <span class="case-card__lock-icon">🔒</span>
        <span class="case-card__action-text">完成前置案例解锁</span>
      </template>
      <template v-else>
        <div class="case-card__price-info">
          <span class="case-card__price-label">目标底价</span>
          <span class="case-card__price-value">
            <span class="case-card__price-symbol">¥</span>？？？
          </span>
        </div>
        <button class="case-card__btn">
          去砍一刀
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l5 4-5 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  caseId: { type: String, required: true },
  index: { type: Number, default: 1 },
  name: { type: String, required: true },
  subtitle: { type: String, required: true },
  difficulty: { type: String, default: 'medium' },
  estimatedTime: { type: String, default: '5分钟' },
  completed: { type: Boolean, default: false },
  locked: { type: Boolean, default: false },
  visualTheme: { type: Object, default: null }
})

const emit = defineEmits(['select'])

const difficultyLabel = computed(() => {
  const labels = {
    easy: '入门',
    medium: '进阶',
    hard: '高难'
  }
  return labels[props.difficulty] || '进阶'
})

const cardStyle = computed(() => {
  if (!props.visualTheme) return {}
  return {
    background: props.visualTheme.gradient,
    '--card-accent': props.visualTheme.accentColor,
    '--card-bar': props.visualTheme.barColor
  }
})

function handleClick() {
  if (!props.locked) {
    emit('select', props.caseId)
  }
}
</script>

<style scoped>
.case-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.case-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b35, #e63946);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.case-card:active {
  transform: scale(0.985);
  box-shadow: 0 4px 20px rgba(255, 107, 53, 0.12), 0 0 0 1px rgba(255, 107, 53, 0.15);
}

.case-card:active::before {
  opacity: 1;
}

.case-card--completed {
  background: linear-gradient(135deg, #f8fff9, #f0faf3);
}

.case-card--completed::before {
  background: var(--color-accent-green);
  opacity: 0.5;
}

.case-card--locked {
  opacity: 0.55;
  cursor: not-allowed;
  filter: grayscale(0.3);
}

.case-card--locked:active {
  transform: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04);
}

/* ===== 顶部标签 ===== */
.case-card__tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.case-card__icon {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 36px;
  opacity: 0.25;
  pointer-events: none;
}

.case-card__index {
  font-size: 11px;
  font-weight: 800;
  color: #999;
  letter-spacing: 0.5px;
}

.case-card__theme-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-left: auto;
}

.case-card__difficulty {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.case-card__difficulty--easy {
  background: #fff3e0;
  color: #e65100;
}

.case-card__difficulty--medium {
  background: #ffebee;
  color: #c62828;
}

.case-card__difficulty--hard {
  background: #fce4ec;
  color: #880e4f;
}

.case-card__time {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: #aaa;
}

.case-card__discount {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px 8px;
  background: linear-gradient(135deg, #ff4444, #ff6b35);
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  border-radius: 10px;
  animation: discountGlow 2s ease-in-out infinite;
}

@keyframes discountGlow {
  0%, 100% { box-shadow: 0 0 6px rgba(255, 68, 0, 0.3); }
  50% { box-shadow: 0 0 12px rgba(255, 68, 0, 0.5); }
}

.case-card__discount-icon {
  font-size: 10px;
}

/* ===== 主体 ===== */
.case-card__body {
  margin-bottom: 16px;
}

.case-card__name {
  font-size: 17px;
  font-weight: 800;
  color: #222;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.case-card__subtitle {
  font-size: 12px;
  color: #888;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== 底部操作区 ===== */
.case-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px dashed #f0e8e0;
}

.case-card__completed-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-accent-green);
  font-weight: 700;
}

.case-card__action-text {
  font-size: 12px;
  color: #bbb;
  font-weight: 500;
}

.case-card__price-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.case-card__price-label {
  font-size: 10px;
  color: #bbb;
  font-weight: 500;
}

.case-card__price-value {
  font-size: 16px;
  font-weight: 900;
  color: #e63946;
  font-family: var(--font-family-number);
  letter-spacing: 1px;
}

.case-card__price-symbol {
  font-size: 12px;
  font-weight: 700;
}

.case-card__btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #ff6b35, #e63946);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border-radius: 20px;
  box-shadow: 0 3px 12px rgba(230, 57, 70, 0.25);
  transition: all 0.15s ease;
  letter-spacing: 0.5px;
}

.case-card__btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 6px rgba(230, 57, 70, 0.3);
}
</style>
