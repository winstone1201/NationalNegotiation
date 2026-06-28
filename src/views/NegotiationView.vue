<template>
  <div class="negotiation-view">
    <!-- 顶部状态栏 -->
    <div class="negotiation-view__topbar">
      <button class="negotiation-view__back" @click="confirmExit" aria-label="退出谈判">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 16L7 10l6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <div class="negotiation-view__status">
        <span class="negotiation-view__round">第 {{ engine.currentRound.value }} 轮谈判</span>
      </div>

      <FundBar :current="fundCurrent" :max="fundMax" :min="0" />
    </div>

    <!-- 错误状态 -->
    <div class="negotiation-view__error" v-if="initError">
      <p>⚠️ 谈判数据加载失败</p>
      <button @click="retryInit">重试</button>
      <button @click="goHome">返回首页</button>
    </div>

    <!-- 加载/数据缺失 -->
    <div class="negotiation-view__loading" v-else-if="!engine.currentNode.value">
      <LoadingScreen message="正在准备谈判..." />
    </div>

    <!-- 谈判主区域 -->
    <template v-else>
      <div class="negotiation-view__dialogue-area" ref="dialogueAreaRef">
        <!-- 历史对话 -->
        <div v-for="(msg, idx) in engine.history.value" :key="idx" class="negotiation-view__message">
          <DialogueBox
            :speaker="msg.speaker"
            :speaker-name="msg.speakerName"
            :text="msg.text"
            :emotion="msg.emotion"
            :auto-play="false"
          />
        </div>

        <!-- 当前对话 -->
        <div class="negotiation-view__message" v-if="currentDisplayNode" ref="currentMsgRef">
          <DialogueBox
            ref="currentDialogueRef"
            :speaker="currentDisplayNode.speaker"
            :speaker-name="currentDisplayNode.speakerName"
            :text="currentDisplayNode.text"
            :emotion="currentDisplayNode.emotion"
            :auto-play="true"
            @complete="onDialogueComplete"
          />
        </div>
      </div>

      <!-- 选择面板 -->
      <div class="negotiation-view__bottom" v-if="engine.isWaitingForChoice.value && currentDisplayNode?.options">
        <ChoicePanel
          :options="currentDisplayNode.options"
          :disabled="choiceDisabled"
          @choose="handleChoice"
        />
      </div>

      <!-- 继续按钮（仅用于无选项、非自动推进的中间节点） -->
      <div class="negotiation-view__bottom" v-if="canAdvance">
        <div class="negotiation-view__continue">
          <button class="negotiation-view__continue-btn" @click="advanceDialogue">
            继续
            <svg width="16" height="16" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </div>
      </div>
    </template>

    <!-- 患者家属来电特效 -->
    <PhoneCallEffect
      :visible="showPhoneCall"
      :caller-name="phoneCallData?.callerName || ''"
      :caller-relation="phoneCallData?.callerRelation || ''"
      :message="phoneCallData?.message || ''"
      @accepted="onPhoneAccepted"
      @dismissed="showPhoneCall = false"
    />

    <!-- 信封揭晓 -->
    <EnvelopeReveal
      :visible="engine.isEnvelopeRevealed.value"
      :floor-price="envelopeResult?.floorPrice || 0"
      :pharma-final-price="envelopeResult?.finalPrice || 0"
      :is-success="envelopeResult?.success || false"
      @reveal="onEnvelopeRevealed"
      @continue="goToResult"
    />

    <!-- 退出确认弹窗 -->
    <ModalOverlay :visible="showExitConfirm" title="确定退出？" @close="showExitConfirm = false">
      <p style="font-size:14px;color:#666;line-height:1.8">退出后当前谈判进度将不会保存。确定要退出吗？</p>
      <template #footer>
        <div style="display:flex;gap:12px">
          <button style="flex:1;padding:10px;background:#f5f7fa;border-radius:8px;font-weight:600" @click="showExitConfirm = false">继续谈判</button>
          <button style="flex:1;padding:10px;background:#e74c3c;color:#fff;border-radius:8px;font-weight:600" @click="doExit">确定退出</button>
        </div>
      </template>
    </ModalOverlay>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { getNegotiationCase } from '@/data/negotiationCases'
import { useDialogueEngine } from '@/composables/useDialogueEngine'
import { trackPageView, trackDecision, trackComplete, trackEvent, EventType } from '@/utils/analytics'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import ModalOverlay from '@/components/common/ModalOverlay.vue'
import DialogueBox from '@/components/negotiation/DialogueBox.vue'
import ChoicePanel from '@/components/negotiation/ChoicePanel.vue'
import FundBar from '@/components/negotiation/FundBar.vue'
import PhoneCallEffect from '@/components/negotiation/PhoneCallEffect.vue'
import EnvelopeReveal from '@/components/negotiation/EnvelopeReveal.vue'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

// === 数据 ===
const caseId = computed(() => route.params.caseId)
const caseData = ref(null)
const engine = useDialogueEngine()

// === UI 状态 ===
const dialogueAreaRef = ref(null)
const currentDialogueRef = ref(null)
const choiceDisabled = ref(false)
const showPhoneCall = ref(false)
const showExitConfirm = ref(false)
const initError = ref(false)

const fundCurrent = ref(70)
const fundMax = ref(70)

// === 计算属性 ===
const currentDisplayNode = computed(() => engine.currentNode.value)
const phoneCallData = computed(() => caseData.value?.phoneCall || null)

const canAdvance = computed(() => {
  const node = currentDisplayNode.value
  if (!node || node.options?.length > 0 || node.triggerEnvelope || node.isEndOfRound || node.roundIntro) return false
  return !engine.isWaitingForChoice.value && !engine.isNegotiationEnded.value
})

const envelopeResult = computed(() => {
  if (!engine.isEnvelopeRevealed.value) return null
  return engine.getEnvelopeResult()
})

// === 初始化 ===
function doInit() {
  const data = getNegotiationCase(caseId.value)
  if (!data) {
    console.error('[NegotiationView] 找不到案例:', caseId.value)
    initError.value = true
    return
  }

  caseData.value = data
  const ok = engine.init(data)
  if (!ok) {
    initError.value = true
    return
  }

  initError.value = false
  fundCurrent.value = 70
  fundMax.value = 70

  console.log('[NegotiationView] 初始化完成, caseId:', caseId.value)
}

function retryInit() {
  doInit()
}

onMounted(() => {
  trackPageView('Negotiation', { caseId: caseId.value })
  doInit()
})

// === 对话流程 ===
function onDialogueComplete() {
  const node = currentDisplayNode.value
  if (!node) return

  console.log('[View] onDialogueComplete:', node.nodeId, 'roundIntro:', node.roundIntro, 'hasOptions:', !!node.options?.length, 'isEndOfRound:', node.isEndOfRound, 'triggerEnvelope:', node.triggerEnvelope)

  // 旁白 → 自动继续
  if (node.roundIntro) {
    setTimeout(() => advanceDialogue(), 800)
    return
  }

  // 有选项 → 显示选择面板
  if (node.options?.length > 0) {
    engine.isWaitingForChoice.value = true
    scrollToBottom()
    return
  }

  // 回合结束 或 触发信封 → 自动推进
  if (node.isEndOfRound || node.triggerEnvelope) {
    setTimeout(() => advanceDialogue(), 1200)
    return
  }
}

function advanceDialogue() {
  const node = currentDisplayNode.value
  if (!node) return

  // 检查是否需要触发患者来电
  if (node.isEndOfRound) {
    const nextRoundIdx = engine.currentRound.value // 下一回合的数组索引
    const nextRound = caseData.value?.rounds?.[nextRoundIdx]
    if (nextRound?.triggerPhoneCall) {
      showPhoneCall.value = true
      return
    }
  }

  engine.advanceDialogue()
  nextTick(() => scrollToBottom())
}

function handleChoice(option) {
  choiceDisabled.value = true

  // 将玩家的选择作为对话气泡推入历史
  engine.history.value.push({
    nodeId: 'player_choice',
    speaker: 'player',
    speakerName: '我（谈判代表）',
    text: option.text,
    emotion: ''
  })

  trackDecision(caseId.value, engine.currentRound.value, option.type, currentDisplayNode.value?.nodeId)
  gameStore.recordChoice({ round: engine.currentRound.value, type: option.type, text: option.text })

  engine.makeChoice(option)
  engine.isWaitingForChoice.value = false
  choiceDisabled.value = false

  nextTick(() => scrollToBottom())
}

function onPhoneAccepted() {
  setTimeout(() => {
    showPhoneCall.value = false
    engine.advanceDialogue()
    nextTick(() => scrollToBottom())
  }, 2500)
}

function onEnvelopeRevealed() {
  const result = envelopeResult.value
  if (result) {
    trackComplete(caseId.value, result)
    const discountVal = parseInt(result.discountPercent) || 0
    const score = Math.min(100, 60 + (result.success ? 20 : 0) + (discountVal > 70 ? 20 : discountVal > 50 ? 10 : 0))
    gameStore.completeCase(caseId.value, {
      finalPrice: result.finalPrice,
      discountPercent: result.discountPercent,
      success: result.success,
      score
    })
  }
}

// === 导航 ===
function goToResult() {
  router.push({ name: 'Result', params: { caseId: caseId.value } })
}

function confirmExit() { showExitConfirm.value = true }

function doExit() {
  showExitConfirm.value = false
  router.push({ name: 'Home' })
}

function goHome() {
  router.push({ name: 'Home' })
}

function scrollToBottom() {
  nextTick(() => {
    if (dialogueAreaRef.value) {
      dialogueAreaRef.value.scrollTop = dialogueAreaRef.value.scrollHeight
    }
  })
}
</script>

<style scoped>
.negotiation-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--color-bg);
}

/* 顶部 */
.negotiation-view__topbar {
  background: var(--color-bg-white);
  padding: var(--spacing-sm) var(--spacing-base);
  box-shadow: var(--shadow-sm);
  border-bottom: 1px solid var(--color-border-light);
  flex-shrink: 0;
}

.negotiation-view__back {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  margin-bottom: var(--spacing-xs);
}

.negotiation-view__status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
}

.negotiation-view__round {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--color-primary);
  padding: 4px 12px;
  background: var(--color-primary-ghost);
  border-radius: 12px;
}

/* 错误/加载 */
.negotiation-view__error,
.negotiation-view__loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-base);
}

.negotiation-view__error button {
  padding: 10px 24px;
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-base);
  font-weight: 600;
}

/* 对话区 */
.negotiation-view__dialogue-area {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-sm) 0 var(--spacing-lg);
  -webkit-overflow-scrolling: touch;
}

.negotiation-view__message {
  animation: msgIn 0.3s ease;
}

@keyframes msgIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 底部栏 */
.negotiation-view__bottom {
  flex-shrink: 0;
}

.negotiation-view__continue {
  padding: var(--spacing-base);
  background: var(--color-bg-white);
  border-top: 1px solid var(--color-border-light);
  text-align: center;
}

.negotiation-view__continue-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 10px 32px;
  background: var(--color-primary);
  color: #fff;
  font-size: var(--font-size-md);
  font-weight: 600;
  border-radius: var(--radius-base);
}
</style>
