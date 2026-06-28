<template>
  <section class="hero">
    <!-- 医保局标识 -->
    <div class="hero__badge">
      <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="6" width="24" height="16" rx="3" stroke="currentColor" stroke-width="1.5"/>
        <path d="M14 2v8M10 2h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <span>国家医保局 · 政策解读</span>
    </div>

    <!-- 主卡片（弹窗风格） -->
    <div class="hero__card" ref="cardRef">
      <!-- 标签行 -->
      <div class="hero__card-tags">
        <span class="hero__tag hero__tag--live">
          <span class="hero__tag-dot"></span>砍价进行中
        </span>
        <span class="hero__tag hero__tag--count">
          🔥 <strong>128,639</strong> 人已参与
        </span>
      </div>

      <!-- 标题 -->
      <div class="hero__card-body">
        <h1 class="hero__title">
          <span class="hero__title-top">我正在砍</span>
          <span class="hero__title-main">救命药</span>
          <span class="hero__title-bottom">你也来砍一刀吧</span>
        </h1>
      </div>

      <!-- 进度 -->
      <div class="hero__card-progress">
        <div class="hero__progress-bar">
          <div class="hero__progress-fill"></div>
        </div>
        <div class="hero__progress-text">
          <span>砍至底价</span>
          <span class="hero__progress-pct">70%</span>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="hero__card-action">
        <button class="hero__btn" @click="$emit('scrollToCases')">
          <span class="hero__btn-hammer">🔨</span>
          <span>帮 TA 砍一刀</span>
        </button>
        <p class="hero__btn-hint">↓ 选择下方案例，化身谈判代表</p>
      </div>
    </div>

    <!-- 底部数据条（红色强调） -->
    <div class="hero__stats">
      <div class="hero__stat">
        <span class="hero__stat-num">114</span>
        <span class="hero__stat-label">2025新增药品</span>
      </div>
      <div class="hero__stat-div"></div>
      <div class="hero__stat">
        <span class="hero__stat-num">88<span class="hero__stat-unit">%</span></span>
        <span class="hero__stat-label">谈判成功率</span>
      </div>
      <div class="hero__stat-div"></div>
      <div class="hero__stat">
        <span class="hero__stat-num">50<span class="hero__stat-unit">+</span></span>
        <span class="hero__stat-label">创新药纳入</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineEmits(['scrollToCases'])

const cardRef = ref(null)

onMounted(() => {
  if (cardRef.value) {
    cardRef.value.style.animation = 'none'
    cardRef.value.offsetHeight
    cardRef.value.style.animation = ''
  }
})
</script>

<style scoped>
.hero {
  background: #fef9f5;
  padding: 20px 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===== 标识 ===== */
.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: #bbb;
  margin-bottom: 20px;
}

/* ===== 主卡片（弹窗风格） ===== */
.hero__card {
  width: 100%;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 4px 8px rgba(0,0,0,0.04),
    0 12px 40px rgba(0,0,0,0.08),
    0 24px 80px rgba(200,50,50,0.1);
  margin-bottom: 20px;
  animation: cardPopIn 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  position: relative;
}

/* 卡片外围微光 */
.hero__card::after {
  content: '';
  position: absolute;
  inset: -6px;
  border-radius: 26px;
  background: radial-gradient(ellipse at 50% 0%, rgba(255,107,53,0.12) 0%, transparent 70%);
  z-index: -1;
  pointer-events: none;
}

@keyframes cardPopIn {
  0% { opacity: 0; transform: translateY(60px) scale(0.8); }
  50% { transform: translateY(-10px) scale(1.03); }
  75% { transform: translateY(4px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* 标签行 */
.hero__card-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px 0;
}

.hero__tag {
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.hero__tag--live {
  color: #e63946;
  background: #fff0ed;
  padding: 5px 12px;
  border-radius: 12px;
}

.hero__tag-dot {
  width: 6px;
  height: 6px;
  background: #e63946;
  border-radius: 50%;
  animation: livePulse 1.2s ease-in-out infinite;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.5); }
}

.hero__tag--count {
  color: #ccc;
  font-weight: 500;
}

.hero__tag--count strong {
  color: #999;
  font-weight: 700;
  font-size: 14px;
}

/* 标题区 */
.hero__card-body {
  padding: 16px 28px 0;
  text-align: center;
}

.hero__title {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero__title-top {
  font-size: 18px;
  font-weight: 700;
  color: #777;
  letter-spacing: 2px;
}

.hero__title-main {
  font-size: 52px;
  font-weight: 900;
  color: #c0392b;
  line-height: 1.15;
  letter-spacing: 6px;
}

.hero__title-bottom {
  font-size: 20px;
  font-weight: 700;
  color: #e63946;
  margin-top: 6px;
  letter-spacing: 2px;
}

/* 进度条 */
.hero__card-progress {
  padding: 20px 28px 4px;
}

.hero__progress-bar {
  height: 8px;
  background: #f5f0ed;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.hero__progress-fill {
  height: 100%;
  width: 70%;
  background: linear-gradient(90deg, #e63946, #ff6b35);
  border-radius: 4px;
}

.hero__progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #ccc;
}

.hero__progress-pct {
  font-weight: 800;
  color: #e63946;
  font-family: var(--font-family-number);
  font-size: 13px;
}

/* CTA按钮 */
.hero__card-action {
  padding: 18px 28px 24px;
  text-align: center;
}

.hero__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 17px 0;
  background: linear-gradient(135deg, #e63946, #ff6b35);
  color: #fff;
  font-size: 19px;
  font-weight: 800;
  border-radius: 28px;
  letter-spacing: 3px;
  box-shadow: 0 6px 28px rgba(230, 57, 70, 0.3);
  transition: transform 0.15s ease;
}

.hero__btn:active {
  transform: scale(0.96);
}

.hero__btn-hammer {
  font-size: 20px;
  animation: hammerSwing 0.9s ease-in-out infinite;
}

@keyframes hammerSwing {
  0%, 100% { transform: rotate(0); }
  30% { transform: rotate(-15deg); }
  70% { transform: rotate(10deg); }
}

.hero__btn-hint {
  margin-top: 14px;
  font-size: 12px;
  color: #ddd;
}

/* ===== 底部数据条 ===== */
.hero__stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 14px 0 0;
  width: 100%;
  margin-bottom: 4px;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.hero__stat-num {
  font-size: 22px;
  font-weight: 800;
  color: #c0392b;
  font-family: var(--font-family-number);
}

.hero__stat-unit {
  font-size: 13px;
  font-weight: 700;
  color: #c0392b;
}

.hero__stat-label {
  font-size: 10px;
  color: #bbb;
  font-weight: 500;
}

.hero__stat-div {
  width: 1px;
  height: 24px;
  background: rgba(0,0,0,0.08);
}
</style>
