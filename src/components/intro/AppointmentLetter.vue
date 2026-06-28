<template>
  <div class="appointment" ref="letterRef">
    <!-- 信封/任命书 -->
    <div class="appointment__paper">
      <!-- 国徽/Logo区域 -->
      <div class="appointment__emblem">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#c9a84c" stroke-width="1.5"/>
          <rect x="8" y="14" width="24" height="16" rx="2" stroke="#b5343a" stroke-width="1.2"/>
          <path d="M20 6v12M13 6h14" stroke="#b5343a" stroke-width="1.2" stroke-linecap="round"/>
          <path d="M12 20h8M12 24h10" stroke="#c9a84c" stroke-width="1" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 标题 -->
      <h2 class="appointment__title">谈判代表任命书</h2>

      <!-- 正文 -->
      <div class="appointment__body" ref="bodyRef">
        <p class="appointment__line">
          兹任命<span class="appointment__highlight">你</span>为国家医疗保障局
        </p>
        <p class="appointment__line">
          2026年度药品目录调整<span class="appointment__highlight">谈判代表</span>
        </p>
      </div>

      <!-- 核心信息 -->
      <div class="appointment__info" ref="infoRef">
        <div class="appointment__info-row">
          <span class="appointment__info-label">谈判场次</span>
          <span class="appointment__info-value">{{ caseName }}</span>
        </div>
        <div class="appointment__info-row">
          <span class="appointment__info-label">待谈药品</span>
          <span class="appointment__info-value">{{ drugName }}</span>
        </div>
        <div class="appointment__info-row">
          <span class="appointment__info-label">对方代表</span>
          <span class="appointment__info-value">跨国制药企业代表</span>
        </div>
      </div>

      <!-- 底部签章 -->
      <div class="appointment__seal">
        <div class="appointment__seal-circle">
          <span>国家医疗保障局</span>
        </div>
      </div>
    </div>

    <!-- 光效装饰 -->
    <div class="appointment__glow"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

defineProps({
  caseName: { type: String, default: '' },
  drugName: { type: String, default: '' }
})

const letterRef = ref(null)
const bodyRef = ref(null)
const infoRef = ref(null)

onMounted(() => {
  if (!letterRef.value) return

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  // 纸张从屏幕外飞入
  tl.from(letterRef.value.querySelector('.appointment__paper'), {
    y: -60,
    opacity: 0,
    scale: 0.9,
    duration: 0.8
  })

  // 徽章旋转弹出
  tl.from(letterRef.value.querySelector('.appointment__emblem'), {
    scale: 0,
    rotation: -180,
    duration: 0.6
  }, '-=0.3')

  // 标题淡入
  tl.from(letterRef.value.querySelector('.appointment__title'), {
    y: 10,
    opacity: 0,
    duration: 0.4
  }, '-=0.2')

  // 正文逐行显示
  if (bodyRef.value) {
    tl.from(bodyRef.value.children, {
      y: 8,
      opacity: 0,
      stagger: 0.15,
      duration: 0.4
    }, '-=0.1')
  }

  // 信息行显示
  if (infoRef.value) {
    tl.from(infoRef.value.children, {
      x: -10,
      opacity: 0,
      stagger: 0.12,
      duration: 0.35
    }, '-=0.15')
  }

  // 签章弹入
  tl.from(letterRef.value.querySelector('.appointment__seal'), {
    scale: 2,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)'
  }, '-=0.2')
})
</script>

<style scoped>
.appointment {
  position: relative;
  padding: var(--spacing-xl) var(--spacing-base);
  display: flex;
  justify-content: center;
}

.appointment__paper {
  width: 100%;
  max-width: 360px;
  background: #fefef3;
  border: 2px solid #d4c9a8;
  border-radius: var(--radius-sm);
  padding: var(--spacing-2xl) var(--spacing-xl);
  position: relative;
  box-shadow:
    0 2px 4px rgba(0,0,0,0.06),
    0 8px 24px rgba(0,0,0,0.1);
}

/* 纸张纹理 */
.appointment__paper::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 28px,
      rgba(180, 160, 120, 0.1) 28px,
      rgba(180, 160, 120, 0.1) 29px
    );
  pointer-events: none;
  border-radius: var(--radius-sm);
}

/* 徽章 */
.appointment__emblem {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

/* 标题 */
.appointment__title {
  text-align: center;
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xl);
  letter-spacing: 2px;
}

/* 正文 */
.appointment__body {
  margin-bottom: var(--spacing-xl);
  padding: 0 var(--spacing-sm);
}

.appointment__line {
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  line-height: var(--line-height-relaxed);
  text-align: center;
}

.appointment__highlight {
  color: var(--color-accent-red);
  font-weight: 700;
}

/* 信息表 */
.appointment__info {
  border-top: 1px dashed #d4c9a8;
  border-bottom: 1px dashed #d4c9a8;
  padding: var(--spacing-base) 0;
  margin-bottom: var(--spacing-xl);
}

.appointment__info-row {
  display: flex;
  padding: 6px 0;
  font-size: var(--font-size-sm);
}

.appointment__info-label {
  color: var(--color-text-tertiary);
  min-width: 64px;
  flex-shrink: 0;
}

.appointment__info-value {
  color: var(--color-text-primary);
  font-weight: 600;
}

/* 签章 */
.appointment__seal {
  display: flex;
  justify-content: flex-end;
}

.appointment__seal-circle {
  width: 64px;
  height: 64px;
  border: 2px solid #c0392b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #c0392b;
  font-weight: 700;
  text-align: center;
  transform: rotate(-15deg);
  opacity: 0.7;
  line-height: 1.2;
}

/* 光效 */
.appointment__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(201, 168, 76, 0.1) 0%, transparent 70%);
  pointer-events: none;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
