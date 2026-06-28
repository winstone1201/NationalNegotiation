<template>
  <transition name="fade">
    <div class="phone-call" v-if="visible" ref="callRef">
      <!-- 震动效果容器 -->
      <div class="phone-call__phone">
        <!-- 来电界面 -->
        <div class="phone-call__screen">
          <div class="phone-call__caller-id">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="11" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <p class="phone-call__name">{{ callerName }}</p>
            <p class="phone-call__relation">{{ callerRelation }}</p>
          </div>

          <div class="phone-call__actions">
            <button class="phone-call__btn phone-call__btn--accept" @click="accept">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6.5 4.5c1.5-1 3.5-1.5 5.5-1.5s4 .5 5.5 1.5L18 7l-4 2.5L10 7l-3.5-2.5z" fill="currentColor"/>
                <path d="M18 7v10l-4-2.5V12l4-5zM6 7v10l4-2.5V12l-4-5z" fill="currentColor" opacity="0.5"/>
              </svg>
              <span>接听</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 通话内容（接听后显示） -->
      <div class="phone-call__conversation" v-if="isConnected">
        <div class="phone-call__bubble phone-call__bubble--caller">
          <p>{{ message }}</p>
        </div>
        <p class="phone-call__duration">通话中...</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  visible: { type: Boolean, default: false },
  callerName: { type: String, default: '患儿家属' },
  callerRelation: { type: String, default: 'SMA患儿母亲' },
  message: { type: String, default: '医生……我们什么时候能用上药？孩子已经等不起了……' }
})

const emit = defineEmits(['accepted', 'dismissed'])

const callRef = ref(null)
const isConnected = ref(false)

function accept() {
  isConnected.value = true
  emit('accepted')
}

watch(() => props.visible, (val) => {
  if (val && callRef.value) {
    // 手机震动效果
    gsap.to(callRef.value.querySelector('.phone-call__phone'), {
      x: '+=4',
      duration: 0.05,
      repeat: 10,
      yoyo: true,
      ease: 'none'
    })
  }
})
</script>

<style scoped>
.phone-call {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-2xl);
}

/* 手机UI */
.phone-call__phone {
  width: 100%;
  max-width: 280px;
}

.phone-call__screen {
  background: #1a1a1a;
  border-radius: 24px;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  border: 2px solid #333;
}

.phone-call__caller-id {
  color: white;
  margin-bottom: var(--spacing-2xl);
}

.phone-call__name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-top: var(--spacing-md);
}

.phone-call__relation {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.6);
  margin-top: 4px;
}

.phone-call__actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
}

.phone-call__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: white;
  font-size: var(--font-size-xs);
}

.phone-call__btn--accept {
  width: 56px;
  height: 56px;
  background: var(--color-success);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 通话中 */
.phone-call__conversation {
  margin-top: var(--spacing-xl);
  text-align: center;
}

.phone-call__bubble--caller {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: white;
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
  max-width: 300px;
}

.phone-call__duration {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.4);
  margin-top: var(--spacing-sm);
}
</style>
