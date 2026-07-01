<template>
  <transition name="fade">
    <div class="phone-call" v-if="visible" ref="callRef">
      <!-- 震动效果容器 -->
      <div class="phone-call__phone" ref="phoneRef">
        <!-- 来电界面（接听前） -->
        <div class="phone-call__screen" v-if="!isConnected">
          <!-- 微信来电头像区域 -->
          <div class="phone-call__avatar">
            <div class="phone-call__avatar-circle">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="14" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>

          <div class="phone-call__caller-id">
            <p class="phone-call__name">{{ callerName }}</p>
            <p class="phone-call__relation">{{ callerRelation }}</p>
          </div>

          <!-- 来电提示文字 -->
          <p class="phone-call__ringing-text">
            <span class="phone-call__wechat-badge">微信来电</span>
          </p>

          <div class="phone-call__actions">
            <button class="phone-call__btn phone-call__btn--accept" @click="accept" aria-label="接听">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

          <p class="phone-call__action-label">点击接听</p>
        </div>

        <!-- 通话中界面（接听后） -->
        <div class="phone-call__screen phone-call__screen--connected" v-else>
          <div class="phone-call__connected-header">
            <div class="phone-call__connected-avatar">
              <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="14" r="8" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 36c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div>
              <p class="phone-call__connected-name">{{ callerName }}</p>
              <p class="phone-call__connected-status">
                {{ isPlayingVoice ? '对方正在说话...' : (isVoiceFinished ? '通话结束' : '通话中') }}
                <span class="phone-call__dot-anim" v-if="!isVoiceFinished && !isPlayingVoice">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </p>
            </div>
          </div>

          <!-- 通话时长 -->
          <p class="phone-call__timer">{{ callDuration }}</p>

          <!-- 挂断按钮 -->
          <div class="phone-call__actions">
            <button class="phone-call__btn phone-call__btn--hangup" @click="hangup" aria-label="挂断">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <p class="phone-call__action-label phone-call__action-label--hangup">点击挂断</p>
        </div>
      </div>

      <!-- 通话内容气泡（接听后显示在手机下方） -->
      <div class="phone-call__conversation" v-if="isConnected">
        <div class="phone-call__bubble phone-call__bubble--caller">
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onUnmounted, computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  visible: { type: Boolean, default: false },
  callerName: { type: String, default: '患儿家属' },
  callerRelation: { type: String, default: 'SMA患儿母亲' },
  message: { type: String, default: '医生……我们什么时候能用上药？孩子已经等不起了……' },
  audioSrc: { type: String, default: '/audio/mother-message.mp3' }
})

const emit = defineEmits(['accepted', 'dismissed'])

const callRef = ref(null)
const phoneRef = ref(null)
const isConnected = ref(false)
const isPlayingVoice = ref(false)
const isVoiceFinished = ref(false)
const callSeconds = ref(0)

let callTimer = null
let ringtoneAudio = null
let voiceAudio = null
let ringtoneLoopTimer = null
let autoHangupTimer = null
let vibrationTween = null

const callDuration = computed(() => {
  const m = Math.floor(callSeconds.value / 60)
  const s = callSeconds.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

// ==================== 铃声播放 ====================

function startRingtone() {
  try {
    ringtoneAudio = new Audio('/audio/wechat-ringtone.mp3')
    ringtoneAudio.volume = 0.7
    ringtoneAudio.loop = true

    ringtoneAudio.play().catch((e) => {
      console.warn('[PhoneCall] 铃声播放失败:', e.message)
    })
  } catch (e) {
    console.warn('[PhoneCall] 音频创建失败:', e)
  }
}

function stopRingtone() {
  if (ringtoneLoopTimer) {
    clearTimeout(ringtoneLoopTimer)
    ringtoneLoopTimer = null
  }
  if (ringtoneAudio) {
    ringtoneAudio.pause()
    ringtoneAudio.currentTime = 0
    ringtoneAudio.onended = null
    ringtoneAudio = null
  }
}

// ==================== 语音播放 ====================

function startVoice() {
  try {
    voiceAudio = new Audio(props.audioSrc)
    voiceAudio.volume = 0.85

    voiceAudio.onplay = () => {
      isPlayingVoice.value = true
    }

    voiceAudio.onended = () => {
      isPlayingVoice.value = false
      isVoiceFinished.value = true
      // 语音播完后 2 秒自动挂断
      autoHangupTimer = setTimeout(() => {
        hangup()
      }, 2000)
    }

    voiceAudio.onerror = (e) => {
      console.warn('[PhoneCall] 语音播放失败:', e)
      // 降级：2.5秒后自动挂断
      isPlayingVoice.value = false
      isVoiceFinished.value = true
      autoHangupTimer = setTimeout(() => {
        hangup()
      }, 2500)
    }

    // 延迟 0.6s 后开始说话（模拟接听后自然停顿）
    setTimeout(() => {
      if (voiceAudio) {
        voiceAudio.play().catch((e) => {
          console.warn('[PhoneCall] 语音播放失败:', e.message)
          // 降级处理
          isPlayingVoice.value = false
          isVoiceFinished.value = true
          autoHangupTimer = setTimeout(() => hangup(), 2500)
        })
      }
    }, 600)
  } catch (e) {
    console.warn('[PhoneCall] 语音音频创建失败:', e)
    autoHangupTimer = setTimeout(() => hangup(), 3000)
  }
}

function stopVoice() {
  if (voiceAudio) {
    voiceAudio.pause()
    voiceAudio.currentTime = 0
    voiceAudio.onended = null
    voiceAudio.onerror = null
    voiceAudio = null
  }
  isPlayingVoice.value = false
  isVoiceFinished.value = false
}

// ==================== 交互 ====================

function accept() {
  isConnected.value = true

  // 停止铃声
  stopRingtone()

  // 停止振动
  if (vibrationTween) {
    vibrationTween.kill()
    vibrationTween = null
  }

  // 开始计时
  callSeconds.value = 0
  callTimer = setInterval(() => {
    callSeconds.value++
  }, 1000)

  // 播放母亲语音
  startVoice()

  emit('accepted')
}

function hangup() {
  // 清除定时器
  if (autoHangupTimer) {
    clearTimeout(autoHangupTimer)
    autoHangupTimer = null
  }
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }

  // 停止音频
  stopVoice()
  stopRingtone()

  emit('dismissed')
}

// ==================== 生命周期 ====================

watch(() => props.visible, (val) => {
  if (val) {
    // 组件出现：开始振动 + 铃声
    startVibration()
    startRingtone()

    // 重置状态
    isConnected.value = false
    isPlayingVoice.value = false
    isVoiceFinished.value = false
    callSeconds.value = 0
  } else {
    // 组件隐藏：清理
    cleanupAll()
  }
})

function startVibration() {
  if (!phoneRef.value) return

  vibrationTween = gsap.to(phoneRef.value, {
    x: '+=3',
    duration: 0.04,
    repeat: -1,
    yoyo: true,
    ease: 'power1.inOut'
  })

  gsap.to(phoneRef.value, {
    rotation: 0.5,
    duration: 0.06,
    repeat: -1,
    yoyo: true,
    ease: 'none'
  })
}

function cleanupAll() {
  if (autoHangupTimer) {
    clearTimeout(autoHangupTimer)
    autoHangupTimer = null
  }
  if (callTimer) {
    clearInterval(callTimer)
    callTimer = null
  }
  stopRingtone()
  stopVoice()
  if (vibrationTween) {
    vibrationTween.kill()
    vibrationTween = null
  }
}

onUnmounted(() => {
  cleanupAll()
})
</script>

<style scoped>
.phone-call {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-2xl);
  user-select: none;
  -webkit-user-select: none;
}

/* 手机UI */
.phone-call__phone {
  width: 100%;
  max-width: 280px;
  will-change: transform;
}

.phone-call__screen {
  background: #1a1a1a;
  border-radius: 28px;
  padding: var(--spacing-3xl) var(--spacing-xl);
  text-align: center;
  border: 2px solid #333;
  position: relative;
  overflow: hidden;
}

.phone-call__screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0 0 4px 4px;
}

/* 头像 */
.phone-call__avatar {
  margin-bottom: var(--spacing-lg);
}

.phone-call__avatar-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a4a4a, #2a2a2a);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.7);
}

.phone-call__caller-id {
  color: white;
  margin-bottom: var(--spacing-lg);
}

.phone-call__name {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-top: var(--spacing-md);
}

.phone-call__relation {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

/* 微信来电标识 */
.phone-call__ringing-text {
  margin-bottom: var(--spacing-xl);
}

.phone-call__wechat-badge {
  display: inline-block;
  font-size: var(--font-size-xs);
  color: #1aad19;
  background: rgba(26, 173, 25, 0.12);
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  animation: badgePulse 1.5s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 按钮 */
.phone-call__actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
}

.phone-call__btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: white;
  font-size: var(--font-size-xs);
  transition: transform 0.15s ease;
  cursor: pointer;
  border: none;
  outline: none;
}

.phone-call__btn:active {
  transform: scale(0.9);
}

.phone-call__btn--accept {
  width: 64px;
  height: 64px;
  background: #34c759;
  border-radius: 50%;
  box-shadow: 0 0 24px rgba(52, 199, 89, 0.4);
  animation: acceptPulse 1.2s ease-in-out infinite;
}

@keyframes acceptPulse {
  0%, 100% {
    box-shadow: 0 0 24px rgba(52, 199, 89, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(52, 199, 89, 0.7);
  }
}

.phone-call__btn--hangup {
  width: 56px;
  height: 56px;
  background: #ff3b30;
  border-radius: 50%;
  box-shadow: 0 0 16px rgba(255, 59, 48, 0.3);
}

.phone-call__action-label {
  font-size: var(--font-size-xs);
  color: rgba(255, 255, 255, 0.35);
  margin-top: var(--spacing-sm);
}

.phone-call__action-label--hangup {
  color: rgba(255, 255, 255, 0.3);
}

/* ===== 通话中界面 ===== */
.phone-call__screen--connected {
  padding: var(--spacing-xl);
}

.phone-call__connected-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  text-align: left;
  margin-bottom: var(--spacing-lg);
}

.phone-call__connected-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a4a4a, #2a2a2a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  flex-shrink: 0;
}

.phone-call__connected-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: white;
}

.phone-call__connected-status {
  font-size: var(--font-size-xs);
  color: #34c759;
}

/* 三个点的动画 */
.phone-call__dot-anim span {
  animation: dotBlink 1.4s infinite;
}
.phone-call__dot-anim span:nth-child(2) { animation-delay: 0.2s; }
.phone-call__dot-anim span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotBlink {
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 1; }
}

.phone-call__timer {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.4);
  font-variant-numeric: tabular-nums;
  margin-bottom: var(--spacing-lg);
  letter-spacing: 2px;
}

/* 通话气泡 */
.phone-call__conversation {
  margin-top: var(--spacing-lg);
  text-align: center;
  max-width: 320px;
}

.phone-call__bubble--caller {
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--font-size-md);
  line-height: var(--line-height-relaxed);
  position: relative;
}

.phone-call__bubble--caller::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(255, 255, 255, 0.08);
}

.phone-call__audio-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-xs);
  color: #34c759;
  margin-top: var(--spacing-sm);
  animation: badgePulse 1.5s ease-in-out infinite;
}

.phone-call__audio-hint--done {
  color: rgba(255, 255, 255, 0.5);
  animation: none;
}
</style>
