<template>
  <div class="share-card">
    <h3 class="share-card__title">分享你的成绩</h3>

    <!-- 预览图 -->
    <div class="share-card__preview" ref="previewRef">
      <img
        v-if="imageDataUrl"
        :src="imageDataUrl"
        alt="分享卡片预览"
        class="share-card__image"
      />
      <div class="share-card__placeholder" v-else>
        <LoadingScreen message="生成卡片中..." />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="share-card__actions">
      <button class="share-card__btn share-card__btn--save" @click="downloadCard">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3 14v1.5a1 1 0 001 1h10a1 1 0 001-1V14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        保存图片
      </button>
      <button class="share-card__btn share-card__btn--share" @click="shareToWechat">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 8a2 2 0 100-4 2 2 0 000 4zM12 5a2 2 0 100-4 2 2 0 000 4zM6 14a2 2 0 100-4 2 2 0 000 4zM12 11a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" stroke-width="1.2"/>
          <path d="M7.5 6.5L11 3.5M7.5 11.5L11 14.5M6.5 8.5L11.5 9.5" stroke="currentColor" stroke-width="1"/>
        </svg>
        分享给好友
      </button>
    </div>

    <!-- 微信引导 -->
    <p class="share-card__wechat-tip">
      💡 在微信中打开可长按图片直接分享到朋友圈
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { generateShareCard, downloadShareCard } from '@/utils/shareCard'
import { trackEvent, EventType } from '@/utils/analytics'
import LoadingScreen from '@/components/common/LoadingScreen.vue'

const props = defineProps({
  caseName: { type: String, default: '' },
  initialPrice: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 0 },
  realPrice: { type: Number, default: 0 },
  strategyLabel: { type: String, default: '' },
  discountPercent: { type: String, default: '' },
  isSuccess: { type: Boolean, default: true }
})

const imageDataUrl = ref(null)
const previewRef = ref(null)

onMounted(async () => {
  try {
    imageDataUrl.value = await generateShareCard({
      caseName: props.caseName,
      initialPrice: props.initialPrice,
      finalPrice: props.finalPrice,
      realPrice: props.realPrice,
      strategyLabel: props.strategyLabel,
      discountPercent: props.discountPercent,
      isSuccess: props.isSuccess
    })
  } catch (e) {
    console.warn('Share card generation failed:', e)
  }
})

function downloadCard() {
  if (imageDataUrl.value) {
    trackEvent(EventType.SHARE_CLICK, { method: 'download' })
    downloadShareCard(imageDataUrl.value)
  }
}

function shareToWechat() {
  trackEvent(EventType.SHARE_CLICK, { method: 'wechat' })
  // 微信分享逻辑（需微信JS-SDK支持）
  if (navigator.share) {
    navigator.share({
      title: '我正在砍救命药，你也来砍一刀吧',
      text: `我砍到了${props.finalPrice}元，比真实谈判官如何？`,
    }).catch(() => {})
  } else {
    // 降级方案：提示用户长按保存
    alert('请长按图片保存后分享给好友')
  }
}
</script>

<style scoped>
.share-card {
  padding: var(--spacing-lg) var(--spacing-base);
}

.share-card__title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  margin-bottom: var(--spacing-lg);
}

/* 预览 */
.share-card__preview {
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--spacing-xl);
  background: var(--color-bg);
}

.share-card__image {
  width: 100%;
  display: block;
}

.share-card__placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按钮 */
.share-card__actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.share-card__btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: 12px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  border-radius: var(--radius-base);
}

.share-card__btn--save {
  background: var(--color-bg);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.share-card__btn--share {
  background: var(--color-success);
  color: white;
}

.share-card__wechat-tip {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  text-align: center;
}
</style>
