<template>
  <div class="dialogue" :class="'dialogue--' + speaker">
    <!-- 说话人头像/标识 -->
    <div class="dialogue__avatar">
      <div class="dialogue__avatar-inner">
        <template v-if="speaker === 'narrator'">
          <!-- 旁白 → 喇叭图标：播报故事 -->
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="6" width="7" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M9 7l5-3v12l-5-3" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
            <path d="M15.5 7.5a4 4 0 010 5" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
          </svg>
        </template>
        <template v-else-if="speaker === 'pharma'">
          <!-- 药企代表 → 药丸图标：制药企业 -->
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="5.5" width="7.5" height="9" rx="4.5" stroke="currentColor" stroke-width="1.3"/>
            <rect x="10.5" y="5.5" width="7.5" height="9" rx="4.5" stroke="currentColor" stroke-width="1.3"/>
          </svg>
        </template>
        <template v-else-if="speaker === 'player'">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
            <path d="M7 8.5h6M7 11.5h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </template>
        <template v-else-if="speaker === 'patient_family'">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="3.5" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
          </svg>
        </template>
        <template v-else>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.2"/>
            <path d="M7 8a3 3 0 016 0c0 2-3 4-3 4s-3-2-3-4z" stroke="currentColor" stroke-width="1.2"/>
            <circle cx="10" cy="6" r="0.5" fill="currentColor"/>
          </svg>
        </template>
      </div>
      <span class="dialogue__speaker-name">{{ speakerName }}</span>
    </div>

    <!-- 对话气泡 -->
    <div class="dialogue__bubble" ref="bubbleRef">
      <p class="dialogue__text" ref="textRef">
        <span>{{ displayedText }}</span>
        <span class="dialogue__cursor" v-if="isTyping">|</span>
      </p>

      <!-- 情绪指示器 -->
      <span class="dialogue__emotion" v-if="emotion && !isTyping">
        {{ emotionLabel }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  speaker: {
    type: String,
    default: 'narrator',
    validator: v => ['narrator', 'pharma', 'player_reflection', 'patient_family', 'player'].includes(v)
  },
  speakerName: { type: String, default: '旁白' },
  text: { type: String, default: '' },
  emotion: { type: String, default: '' },
  autoPlay: { type: Boolean, default: true },
  speed: { type: Number, default: 35 } // 毫秒/字
})

const emit = defineEmits(['complete'])

const displayedText = ref('')
const isTyping = ref(false)
const textRef = ref(null)
const bubbleRef = ref(null)
let typingTimer = null

const emotionLabel = computed(() => {
  const labels = {
    defensive: '🤔 谨慎回应',
    aggressive: '😤 强硬立场',
    conciliatory: '🤝 释放善意',
    anxious: '😰 压力增加',
    confident: '😎 势在必得',
    sympathetic: '🥺 博取同情'
  }
  return labels[props.emotion] || ''
})

// 打字机效果
function startTyping() {
  stopTyping()
  displayedText.value = ''
  isTyping.value = true

  let index = 0
  const fullText = props.text

  typingTimer = setInterval(() => {
    if (index < fullText.length) {
      displayedText.value += fullText[index]
      index++
    } else {
      stopTyping()
      emit('complete')
    }
  }, props.speed)
}

function stopTyping() {
  if (typingTimer) {
    clearInterval(typingTimer)
    typingTimer = null
  }
  isTyping.value = false
}

// 立即显示全部文字
function skipTyping() {
  stopTyping()
  displayedText.value = props.text
  emit('complete')
}

watch(() => props.text, () => {
  if (props.text) {
    if (props.autoPlay) {
      setTimeout(startTyping, 200)
    } else {
      displayedText.value = props.text
    }
  }
}, { immediate: true })

onUnmounted(() => {
  stopTyping()
})

defineExpose({ skipTyping })
</script>

<style scoped>
.dialogue {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-base) var(--spacing-base);
  animation: slideInRight 0.3s var(--ease-out-expo);
}

/* 不同说话人样式 */
.dialogue--narrator {
  opacity: 0.85;
}

.dialogue--patient_family {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.05), rgba(231, 76, 60, 0.02));
  border-left: 3px solid var(--color-accent-red);
}

/* 头像 */
.dialogue__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.dialogue__avatar-inner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: var(--color-primary-ghost);
}

/* 旁白：石板灰蓝色 —— 客观冷静的中性色调 */
.dialogue--narrator .dialogue__avatar-inner {
  color: #475569;
  background: rgba(71, 85, 105, 0.12);
}

/* 药企：琥珀橙色 —— 鲜明醒目的商业代表色 */
.dialogue--pharma .dialogue__avatar-inner {
  color: #d97706;
  background: rgba(217, 119, 6, 0.12);
}

.dialogue--patient_family .dialogue__avatar-inner {
  color: var(--color-accent-red);
  background: rgba(231, 76, 60, 0.1);
}

/* 名字：加粗加深，确保可读性 */
.dialogue__speaker-name {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

/* 气泡 */
.dialogue__bubble {
  flex: 1;
  background: var(--color-bg-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  position: relative;
  min-height: 48px;
}

.dialogue--pharma .dialogue__bubble {
  background: #fff8f0;
  border: 1px solid rgba(230, 126, 34, 0.15);
}

.dialogue--patient_family .dialogue__bubble {
  background: #fff5f5;
  border: 1px solid rgba(231, 76, 60, 0.1);
}

/* 玩家消息——暖红左对齐 */
.dialogue--player .dialogue__bubble {
  background: #fef5f5;
  border: 1px solid rgba(181, 52, 58, 0.12);
}

.dialogue--player .dialogue__text {
  color: #b5343a;
}

.dialogue--player .dialogue__avatar-inner {
  color: #b5343a;
  background: rgba(181, 52, 58, 0.1);
}

.dialogue__text {
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-primary);
}

.dialogue__cursor {
  color: var(--color-primary);
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.dialogue__emotion {
  display: inline-block;
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  padding: 2px 8px;
  background: var(--color-bg);
  border-radius: 10px;
}
</style>
