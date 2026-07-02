<template>
  <transition name="fade">
    <div class="envelope-overlay" v-if="visible">

      <!-- ==================== 模式一：谈判前拆封底价信封 ==================== -->
      <template v-if="mode === 'pre'">
        <div class="envelope" ref="envelopeRef">
          <!-- 说明文字 -->
          <div class="envelope__guide" v-if="!isOpened">
            <p class="envelope__guide-title">📩 医保局底价信封</p>
            <p class="envelope__guide-text">
              每次谈判开始前，医保局组织药物经济学专家组，综合考虑药品成本、临床效果、基金承受能力等因素，<span class="envelope__guide-highlight">测算出一个内部底价</span>（业内称"信封价"），密封在信封里。
            </p>
            <p class="envelope__guide-text">
              谈判正式开始后，组长<span class="envelope__guide-highlight">当众拆封</span>——此时你作为谈判官心中有了底线，但<span class="envelope__guide-highlight">绝不能向药企透露</span>这个数字。药企并不知道底价，只能通过你的暗示来判断自己的报价是否还有空间。
            </p>
            <p class="envelope__guide-text">
              <strong>谈判规则：</strong>药企有两次报价机会。如果报价高出底价<span class="envelope__guide-highlight">超过15%</span>，谈判官会提示"距离底价还有距离"并给予再次报价机会；<strong>只有当药企最终报价 ≤ 底价，谈判才算成功</strong>。若两次报价均超过底价15%，谈判直接终止。
            </p>
          </div>

          <!-- 信封卡片 -->
          <div class="envelope__card" @click.stop="handleReveal">
            <!-- 封蜡区（开封前） -->
            <div class="envelope__seal-area" v-if="!isOpened" ref="sealRef">
              <div class="envelope__seal-icon">🏷️</div>
              <div class="envelope__seal-stamp">机密 · 现场开封</div>
            </div>

            <!-- 底价内容（开封后） -->
            <div class="envelope__inner" v-if="isOpened" ref="innerRef">
              <div class="envelope__seal-label">医保局 · 机密</div>
              <div class="envelope__price font-number" :style="{ fontSize: priceFontSize(floorPrice, 52) }">{{ formatPrice(floorPrice) }}</div>
              <div class="envelope__unit">元</div>
              <div class="envelope__price-label">谈判底价</div>
              <div class="envelope__limit-label">心中有了底线，但绝不透露给药企</div>
            </div>

            <div class="envelope__footer">
              <span v-if="!isOpened">点击拆封</span>
              <span v-else>医保谈判底价信封</span>
            </div>
          </div>

          <!-- 开始谈判按钮（拆封后显示） -->
          <button class="envelope__start-btn" v-if="isOpened" ref="startBtnRef" @click.stop="$emit('revealed')">
            进入谈判
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </template>

      <!-- ==================== 模式二：第一轮结束 — 底价对比 ==================== -->
      <template v-if="mode === 'round1'">
        <div class="envelope">
          <div class="r1check">
            <p class="r1check__title">📋 第一轮谈判结束</p>
            <p class="r1check__sub">药企报价 vs 医保底价 — 检查是否进入15%范围</p>

            <!-- 价格条 -->
            <div class="r1check__bar">
              <div class="r1check__side" :class="round1Within15 ? 'r1check__side--ok' : 'r1check__side--over'">
                <span class="r1check__side-label">第一轮后报价</span>
                <span class="r1check__side-price font-number" :style="{ fontSize: priceFontSize(round1Price, 24) }">{{ formatPrice(round1Price) }}</span>
              </div>
              <div class="r1check__vs">{{ round1Within15 ? '≤' : '>' }}</div>
              <div class="r1check__side r1check__side--floor">
                <span class="r1check__side-label">15% 警戒线</span>
                <span class="r1check__side-price font-number" :style="{ fontSize: priceFontSize(floorPrice * 1.15, 24) }">{{ formatPrice(floorPrice * 1.15) }}</span>
              </div>
            </div>

            <!-- 判定 -->
            <div class="r1check__verdict" :class="round1Within15 ? 'r1check__verdict--ok' : 'r1check__verdict--over'">
              <template v-if="round1Within15">
                ✅ 报价已在底价15%范围内，进入第二轮最终谈判
              </template>
              <template v-else>
                ⚠️ 报价仍超出底价15%，药企将获得最后一次报价机会
              </template>
            </div>

            <p class="r1check__hint">底价：<strong>{{ formatPrice(floorPrice) }}</strong> 元 — 心中有了底线，但绝不透露</p>

            <button class="envelope__start-btn" @click.stop="$emit('continue')">
              进入第二轮
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M11 6l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </template>

      <!-- ==================== 模式三：谈判后价格对比 ==================== -->
      <template v-if="mode === 'post'">
        <div class="envelope" ref="envelopeRef">
          <!-- 对比标题 -->
          <div class="compare__header">
            <p class="compare__header-title">📊 谈判结果比对</p>
            <p class="compare__header-sub">药企最终报价 vs 医保底价</p>
          </div>

          <!-- 价格对比卡 -->
          <div class="compare__cards">
            <!-- 药企报价 -->
            <div class="compare__card" :class="{ 'compare__card--winner': isSuccess, 'compare__card--loser': !isSuccess }">
              <div class="compare__card-label">药企最终报价</div>
              <div class="compare__card-price font-number" :style="{ fontSize: priceFontSize(pharmaFinalPrice, 28) }">{{ formatPrice(pharmaFinalPrice) }}</div>
              <div class="compare__card-unit">元</div>
              <div class="compare__card-tag" v-if="isSuccess">✅ 进入医保</div>
              <div class="compare__card-tag compare__card-tag--fail" v-else>❌ 未能进入</div>
            </div>

            <!-- VS -->
            <div class="compare__vs">
              <div class="compare__vs-line"></div>
              <div class="compare__vs-text">{{ isSuccess ? '≤' : '>' }}</div>
              <div class="compare__vs-line"></div>
            </div>

            <!-- 医保底价 -->
            <div class="compare__card compare__card--floor">
              <div class="compare__card-label">医保底价</div>
              <div class="compare__card-price font-number" :style="{ fontSize: priceFontSize(floorPrice, 28) }">{{ formatPrice(floorPrice) }}</div>
              <div class="compare__card-unit">元</div>
              <div class="compare__card-tag compare__card-tag--floor">🔒 内部测算</div>
            </div>
          </div>

          <!-- 差额 -->
          <div class="compare__diff">
            {{ isSuccess
              ? `药企报价低于底价 ${formatPrice(Math.abs(pharmaFinalPrice - floorPrice))} 元，谈判成功`
              : `药企报价高出底价 ${formatPrice(Math.abs(pharmaFinalPrice - floorPrice))} 元，谈判破裂`
            }}
          </div>

          <!-- 两轮报价回顾 -->
          <div class="round-summary" v-if="round1Price">
            <div class="round-summary__title">两轮谈判回顾</div>

            <!-- 第一轮 -->
            <div class="round-summary__row">
              <div class="round-summary__label">第一轮</div>
              <div class="round-summary__prices">
                <span class="round-summary__start">开价 {{ formatPrice(round1Opening) }}</span>
                <span class="round-summary__arrow">→</span>
                <span class="round-summary__end" :class="round1Within15 ? 'round-summary__end--warn' : 'round-summary__end--bad'">
                  {{ formatPrice(round1Price) }}
                </span>
              </div>
              <div class="round-summary__status">
                <template v-if="round1Within15">
                  <span class="round-summary__badge round-summary__badge--warn">超出 ≤15%</span>
                  <span class="round-summary__note">进入第二轮</span>
                </template>
                <template v-else>
                  <span class="round-summary__badge round-summary__badge--bad">超出 &gt;15%</span>
                  <span class="round-summary__note">给予再次报价</span>
                </template>
              </div>
            </div>

            <!-- 第二轮 -->
            <div class="round-summary__row">
              <div class="round-summary__label">第二轮</div>
              <div class="round-summary__prices">
                <span class="round-summary__start">开价 {{ formatPrice(round2Opening) }}</span>
                <span class="round-summary__arrow">→</span>
                <span class="round-summary__end" :class="isSuccess ? 'round-summary__end--good' : 'round-summary__end--bad'">
                  {{ formatPrice(pharmaFinalPrice) }}
                </span>
              </div>
              <div class="round-summary__status">
                <template v-if="isSuccess">
                  <span class="round-summary__badge round-summary__badge--good">≤ 底价</span>
                  <span class="round-summary__note">谈判成功 ✅</span>
                </template>
                <template v-else>
                  <span class="round-summary__badge round-summary__badge--bad">&gt; 底价</span>
                  <span class="round-summary__note">谈判破裂 ❌</span>
                </template>
              </div>
            </div>

            <div class="round-summary__floor">
              医保底价：<strong>{{ formatPrice(floorPrice) }}</strong> 元
              <span class="round-summary__floor-note">（底价 × 1.15 = {{ formatPrice(floorPrice * 1.15) }} 元，超过此线即警告）</span>
            </div>
          </div>

          <!-- 判定徽章 -->
          <div class="envelope__verdict-badge" :class="isSuccess ? 'envelope__verdict-badge--success' : 'envelope__verdict-badge--fail'">
            {{ isSuccess ? '🎉 药品成功纳入国家医保目录' : '😔 本次谈判未能达成协议' }}
          </div>

          <button class="envelope__continue-btn" @click.stop="$emit('continue')">
            {{ isSuccess ? '查看复盘分析 →' : '了解后续影响 →' }}
          </button>
        </div>
      </template>

    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: { type: String, default: 'pre' },  // 'pre' | 'post'
  floorPrice: { type: Number, default: 0 },
  pharmaFinalPrice: { type: Number, default: 0 },
  isSuccess: { type: Boolean, default: false },
  round1Opening: { type: Number, default: 0 },
  round1Price: { type: Number, default: 0 },
  round2Opening: { type: Number, default: 0 }
})

const emit = defineEmits(['revealed', 'continue'])

const round1Within15 = computed(() => {
  if (!props.round1Price || !props.floorPrice) return false
  return props.round1Price <= props.floorPrice * 1.15
})

const envelopeRef = ref(null)
const sealRef = ref(null)
const innerRef = ref(null)
const startBtnRef = ref(null)
const isOpened = ref(false)

function handleReveal() {
  if (isOpened.value) return
  isOpened.value = true
  playOpenAnimation()
}

function playOpenAnimation() {
  const tl = gsap.timeline()

  if (sealRef.value) {
    tl.to(sealRef.value, {
      scale: 0, opacity: 0, duration: 0.4, ease: 'back.in(2)'
    })
  }

  if (innerRef.value) {
    tl.fromTo(innerRef.value,
      { scale: 0.5, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.15'
    )
  }

  if (startBtnRef.value) {
    tl.from(startBtnRef.value, {
      y: 12, opacity: 0, duration: 0.4
    }, '-=0.1')
  }
}

function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  if (price % 1 === 0) return price.toLocaleString('zh-CN')
  return price.toFixed(2)
}

/**
 * 根据价格字符串长度动态调整字号，避免长数字换行导致方块大小不一致
 * @param {number} price - 原始价格数值
 * @param {number} baseSize - 基准字号（px）
 * @returns {string} CSS font-size 值
 */
function priceFontSize(price, baseSize) {
  const str = formatPrice(price)
  const len = str.length
  if (len <= 3) return `${baseSize}px`
  if (len <= 4) return `${Math.round(baseSize * 0.82)}px`
  return `${Math.round(baseSize * 0.66)}px`
}
</script>

<style scoped>
.envelope-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: 20px;
  overflow-y: auto;
}

.envelope {
  width: 100%;
  max-width: 340px;
  text-align: center;
  animation: envelopeIn 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes envelopeIn {
  0% { opacity: 0; transform: scale(0.88) translateY(16px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

/* ===== 谈判前：引导说明 ===== */
.envelope__guide {
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 16px;
  text-align: left;
  border: 1px solid rgba(255,255,255,0.08);
}

.envelope__guide-title {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
}

.envelope__guide-text {
  font-size: 12px;
  color: rgba(255,255,255,0.65);
  line-height: 1.8;
  margin-bottom: 6px;
}

.envelope__guide-highlight {
  color: #ffc107;
  font-weight: 600;
}

/* ===== 信封卡片 ===== */
.envelope__card {
  background: #f8f3e8;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.12), 0 16px 48px rgba(0,0,0,0.3);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease;
  border: 2px solid #d4c9a8;
}

.envelope__card:active {
  transform: scale(0.98);
}

/* ===== 封蜡区 ===== */
.envelope__seal-area {
  padding: 28px 20px;
  background: linear-gradient(180deg, #faf5e8, #f5edd8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.envelope__seal-icon {
  font-size: 28px;
}

.envelope__seal-stamp {
  font-size: 13px;
  font-weight: 700;
  color: #c0392b;
  letter-spacing: 3px;
  padding: 6px 16px;
  border: 2px dashed #c0392b;
  border-radius: 20px;
  background: rgba(192,57,43,0.04);
}

.envelope__seal-price-hint {
  font-size: 16px;
  font-weight: 800;
  color: #999;
  margin-top: 8px;
}

/* ===== 底价区 ===== */
.envelope__inner {
  padding: 24px 20px 16px;
}

.envelope__seal-label {
  font-size: 10px;
  color: #c0392b;
  font-weight: 700;
  letter-spacing: 3px;
  margin-bottom: 8px;
}

.envelope__price {
  font-size: 52px;
  font-weight: 900;
  color: #b5343a;
  line-height: 1;
  white-space: nowrap;
}

.envelope__unit {
  font-size: 14px;
  color: #888;
  font-weight: 600;
  margin-top: 2px;
}

.envelope__price-label {
  font-size: 11px;
  color: #bbb;
  font-weight: 600;
  letter-spacing: 2px;
  margin-top: 2px;
}

.envelope__limit-label {
  font-size: 11px;
  color: #999;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #d4c9a8;
}

.envelope__footer {
  padding: 12px;
  background: #f2ecda;
  border-top: 1px dashed #d4c9a8;
  font-size: 12px;
  font-weight: 700;
  color: #999;
  letter-spacing: 3px;
}

/* 进入谈判按钮 */
.envelope__start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 16px;
  margin-top: 16px;
  background: linear-gradient(135deg, #c0392b, #d44637);
  color: #fff;
  font-size: 17px;
  font-weight: 800;
  border-radius: 14px;
  letter-spacing: 2px;
  box-shadow: 0 6px 24px rgba(192,57,43,0.35);
  transition: transform 0.15s;
}

.envelope__start-btn:active {
  transform: scale(0.96);
}

/* ==================== 谈判后对比模式 ==================== */

.compare__header {
  margin-bottom: 20px;
}

.compare__header-title {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
}

.compare__header-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

/* 对比卡 */
.compare__cards {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 16px;
}

.compare__card {
  flex: 1;
  min-width: 0;
  background: rgba(255,255,255,0.05);
  border-radius: 14px;
  padding: 18px 10px;
  border: 2px solid rgba(255,255,255,0.08);
}

.compare__card--winner {
  border-color: rgba(39,174,96,0.5);
  background: rgba(39,174,96,0.08);
}

.compare__card--loser {
  border-color: rgba(231,76,60,0.5);
  background: rgba(231,76,60,0.08);
}

.compare__card--floor {
  border-color: rgba(192,57,43,0.4);
  background: rgba(192,57,43,0.05);
}

.compare__card-label {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 8px;
}

.compare__card-price {
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  white-space: nowrap;
}

.compare__card-unit {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  margin-top: 2px;
  margin-bottom: 10px;
}

.compare__card-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  background: rgba(39,174,96,0.2);
  color: #4effb4;
}

.compare__card-tag--fail {
  background: rgba(231,76,60,0.2);
  color: #ff6b6b;
}

.compare__card-tag--floor {
  background: rgba(192,57,43,0.15);
  color: #e57373;
}

/* VS 分隔 */
.compare__vs {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 6px;
  flex-shrink: 0;
}

.compare__vs-line {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.15);
}

.compare__vs-text {
  font-size: 20px;
  font-weight: 900;
  color: rgba(255,255,255,0.25);
  padding: 8px 0;
}

/* 差额 */
.compare__diff {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 16px;
}

/* 判定徽章 */
.envelope__verdict-badge {
  display: block;
  padding: 14px 20px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.envelope__verdict-badge--success {
  background: linear-gradient(135deg, #1b5e20, #2e7d32);
  color: #a5d6a7;
  border: 2px solid rgba(39,174,96,0.4);
}

.envelope__verdict-badge--fail {
  background: linear-gradient(135deg, #b71c1c, #c62828);
  color: #ef9a9a;
  border: 2px solid rgba(231,76,60,0.4);
}

/* ===== 第一轮对比（mode=round1） ===== */
.r1check {
  text-align: center;
}

.r1check__title {
  font-size: 17px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
}

.r1check__sub {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  margin-bottom: 20px;
}

.r1check__bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.r1check__side {
  flex: 1;
  min-width: 0;
  padding: 16px 10px;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.1);
}

.r1check__side--ok {
  border-color: rgba(255,152,0,0.4);
  background: rgba(255,152,0,0.06);
}

.r1check__side--over {
  border-color: rgba(244,67,54,0.4);
  background: rgba(244,67,54,0.06);
}

.r1check__side--floor {
  border-color: rgba(192,57,43,0.3);
  background: rgba(192,57,43,0.04);
}

.r1check__side-label {
  font-size: 10px;
  color: rgba(255,255,255,0.45);
  margin-bottom: 6px;
}

.r1check__side-price {
  font-size: 24px;
  font-weight: 900;
  color: #fff;
  white-space: nowrap;
}

.r1check__vs {
  font-size: 22px;
  font-weight: 900;
  color: rgba(255,255,255,0.2);
  flex-shrink: 0;
}

.r1check__verdict {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}

.r1check__verdict--ok {
  background: rgba(255,152,0,0.12);
  color: #ffb74d;
  border: 1px solid rgba(255,152,0,0.25);
}

.r1check__verdict--over {
  background: rgba(244,67,54,0.12);
  color: #ef9a9a;
  border: 1px solid rgba(244,67,54,0.25);
}

.r1check__hint {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  margin-bottom: 16px;
}

.r1check__hint strong {
  color: rgba(255,255,255,0.6);
}

/* ===== 两轮谈判回顾 ===== */
.round-summary {
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
  text-align: left;
}

.round-summary__title {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-align: center;
}

.round-summary__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.round-summary__row:last-of-type {
  border-bottom: none;
}

.round-summary__label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.4);
  min-width: 40px;
}

.round-summary__prices {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
}

.round-summary__start {
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  white-space: nowrap;
}

.round-summary__arrow {
  font-size: 11px;
  color: rgba(255,255,255,0.2);
}

.round-summary__end {
  font-size: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.round-summary__end--warn {
  color: #ff9800;
}

.round-summary__end--good {
  color: #4caf50;
}

.round-summary__end--bad {
  color: #f44336;
}

.round-summary__status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.round-summary__badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}

.round-summary__badge--warn {
  background: rgba(255,152,0,0.15);
  color: #ff9800;
}

.round-summary__badge--good {
  background: rgba(76,175,80,0.15);
  color: #4caf50;
}

.round-summary__badge--bad {
  background: rgba(244,67,54,0.15);
  color: #f44336;
}

.round-summary__note {
  font-size: 9px;
  color: rgba(255,255,255,0.3);
}

.round-summary__floor {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.08);
  text-align: center;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
}

.round-summary__floor strong {
  color: #fff;
}

.round-summary__floor-note {
  display: block;
  font-size: 10px;
  color: rgba(255,255,255,0.3);
  margin-top: 3px;
}

/* 继续按钮 */
.envelope__continue-btn {
  padding: 14px 28px;
  background: #fff;
  color: #333;
  font-size: 15px;
  font-weight: 700;
  border-radius: 24px;
  letter-spacing: 1px;
  transition: transform 0.15s;
}

.envelope__continue-btn:active {
  transform: scale(0.96);
}
</style>
