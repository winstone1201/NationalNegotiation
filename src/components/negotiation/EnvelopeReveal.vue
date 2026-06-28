<template>
  <transition name="fade">
    <div class="envelope-overlay" v-if="visible" @click.self="handleReveal">
      <div class="envelope" ref="envelopeRef" :class="{ 'envelope--opened': isOpened }">
        <!-- 信封本体 -->
        <div class="envelope__body">
          <!-- 封口（三角形） -->
          <div class="envelope__flap" ref="flapRef">
            <svg viewBox="0 0 200 120" class="envelope__flap-svg">
              <polygon points="100,10 10,110 190,110" fill="#d4c9a8" stroke="#b8a080" stroke-width="1"/>
            </svg>
          </div>

          <!-- 信封内容（底价纸） -->
          <div class="envelope__content" ref="contentRef">
            <div class="envelope__seal-label">医保局 · 机密</div>
            <div class="envelope__secret-number font-number">
              {{ formatPrice(floorPrice) }}
            </div>
            <div class="envelope__unit">元</div>
            <div class="envelope__note">底价信封</div>
          </div>

          <!-- 信封主体（下半部分） -->
          <div class="envelope__bottom">
            <p class="envelope__title">医 保 谈 判 底 价</p>
            <p class="envelope__subtitle">（请谈判代表现场开封）</p>
          </div>
        </div>

        <!-- 点击提示 -->
        <p class="envelope__hint" v-if="!isOpened">{{ hintText }}</p>

        <!-- 开封后结果 -->
        <div class="envelope__result" v-if="isOpened" ref="resultRef">
          <div class="envelope__result-icon">
            {{ isSuccess ? '✅' : '❌' }}
          </div>
          <p class="envelope__result-title">
            {{ isSuccess ? '谈判成功！' : '谈判破裂' }}
          </p>
          <p class="envelope__result-desc">
            {{ resultDescription }}
          </p>
          <button class="envelope__continue-btn" @click="$emit('continue')">
            {{ isSuccess ? '查看复盘分析' : '了解后续影响' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  visible: { type: Boolean, default: false },
  floorPrice: { type: Number, default: 0 },
  pharmaFinalPrice: { type: Number, default: 0 },
  isSuccess: { type: Boolean, default: false }
})

const emit = defineEmits(['reveal', 'continue'])

const envelopeRef = ref(null)
const flapRef = ref(null)
const contentRef = ref(null)
const resultRef = ref(null)
const isOpened = ref(false)

const hintText = computed(() => '点击信封揭晓底价')

const resultDescription = computed(() => {
  if (props.isSuccess) {
    const saved = props.floorPrice - props.pharmaFinalPrice
    return `药企最终报价 ${formatPrice(props.pharmaFinalPrice)} 元 ≤ 底价×1.15 (${formatPrice(Math.round(props.floorPrice * 1.15))} 元)，成功纳入医保目录！`
  }
  return `药企最终报价 ${formatPrice(props.pharmaFinalPrice)} 元 > 底价×1.15 (${formatPrice(Math.round(props.floorPrice * 1.15))} 元)，本次谈判未能达成协议。该药品暂不纳入本年度医保目录。`
})

function handleReveal() {
  if (isOpened.value) return
  isOpened.value = true
  playOpenAnimation()
  emit('reveal')
}

function playOpenAnimation() {
  const tl = gsap.timeline()

  // 封口打开
  if (flapRef.value) {
    tl.to(flapRef.value, {
      rotateX: 180,
      transformOrigin: 'top center',
      duration: 0.6,
      ease: 'power2.inOut'
    })
  }

  // 底价纸上移显示
  if (contentRef.value) {
    tl.fromTo(contentRef.value,
      { y: 20, opacity: 0 },
      { y: -10, opacity: 1, duration: 0.5 },
      '-=0.2'
    )
  }

  // 结果区域延迟显示
  if (resultRef.value) {
    tl.from(resultRef.value, {
      y: 30,
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })
  }
}

function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  return price.toLocaleString('zh-CN')
}
</script>

<style scoped>
.envelope-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-xl);
}

.envelope {
  width: 100%;
  max-width: 340px;
  text-align: center;
}

/* 信封本体 */
.envelope__body {
  position: relative;
  background: #f5f0e1;
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  overflow: hidden;
  cursor: pointer;
}

.envelope--opened .envelope__body {
  cursor: default;
}

/* 封口 */
.envelope__flap {
  position: relative;
  z-index: 2;
  transform-origin: top center;
}

.envelope__flap-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* 底价内容 */
.envelope__content {
  padding: var(--spacing-base) var(--spacing-xl);
  background: linear-gradient(135deg, #fffef5, #fef9e7);
  border-bottom: 2px dashed #d4c9a8;
}

.envelope__seal-label {
  font-size: 10px;
  color: #c0392b;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: var(--spacing-sm);
}

.envelope__secret-number {
  font-size: 48px;
  font-weight: 800;
  color: var(--color-accent-red);
  line-height: 1.1;
}

.envelope__unit {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.envelope__note {
  font-size: 10px;
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

/* 信封底部 */
.envelope__bottom {
  padding: var(--spacing-lg);
  background: #f5f0e1;
}

.envelope__title {
  font-size: var(--font-size-lg);
  font-weight: 800;
  color: var(--color-primary);
  letter-spacing: 4px;
}

.envelope__subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: 4px;
}

/* 提示文字 */
.envelope__hint {
  margin-top: var(--spacing-lg);
  color: rgba(255, 255, 255, 0.7);
  font-size: var(--font-size-sm);
}

/* 结果区 */
.envelope__result {
  margin-top: var(--spacing-xl);
  color: white;
  text-align: center;
}

.envelope__result-icon {
  font-size: 40px;
  margin-bottom: var(--spacing-sm);
}

.envelope__result-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
}

.envelope__result-desc {
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  opacity: 0.85;
  margin-bottom: var(--spacing-xl);
}

.envelope__continue-btn {
  padding: 12px 24px;
  background: white;
  color: var(--color-primary);
  font-size: var(--font-size-md);
  font-weight: 700;
  border-radius: var(--radius-base);
}
</style>
