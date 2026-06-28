import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadProgress, saveProgress, clearProgress } from '@/utils/storage'

export const useGameStore = defineStore('game', () => {
  // === 状态 ===

  // 当前进行的案例
  const currentCaseId = ref(null)

  // 所有案例的完成状态: { 'rare-disease-1': { completed: true, score: 85, ... } }
  const caseResults = ref({})

  // 当前谈判进度
  const negotiationState = ref({
    caseId: null,
    currentRound: 1,
    currentNodeId: null,
    playerChoices: [],       // 存储玩家的所有选择
    currentPrice: 0,         // 当前药企报价
    fundRemaining: 0,        // 剩余基金
    isEnvelopeRevealed: false,
    isNegotiationEnded: false,
    negotiationSuccess: false
  })

  // 知识测验
  const quizState = ref({
    completed: false,
    score: 0,
    answers: {}              // { questionId: selectedOptionId }
  })

  // 全局UI状态
  const uiState = ref({
    isSoundEnabled: true,
    fontSize: 'base',        // 'base' | 'large' | 'xlarge'
    hasSeenIntro: false
  })

  // === 计算属性 ===
  const completedCases = computed(() =>
    Object.values(caseResults.value).filter(r => r.completed).length
  )

  const totalCases = 3

  const knowledgeGain = computed(() => null)

  // === 方法 ===

  // 开始一个案例
  function startCase(caseId) {
    currentCaseId.value = caseId
    negotiationState.value = {
      caseId,
      currentRound: 1,
      currentNodeId: null,
      playerChoices: [],
      currentPrice: 0,
      fundRemaining: 0,
      isEnvelopeRevealed: false,
      isNegotiationEnded: false,
      negotiationSuccess: false
    }
  }

  // 记录玩家的一个选择
  function recordChoice(choice) {
    negotiationState.value.playerChoices.push({
      ...choice,
      timestamp: Date.now()
    })
  }

  // 更新谈判状态
  function updateNegotiationState(updates) {
    Object.assign(negotiationState.value, updates)
  }

  // 完成谈判
  function completeCase(caseId, result) {
    // 计算策略倾向
    const choices = negotiationState.value.playerChoices
    const pressureCount = choices.filter(c => c.type === 'pressure').length
    const empathyCount = choices.filter(c => c.type === 'empathy').length
    const technicalCount = choices.filter(c => c.type === 'technical').length

    const strategyProfile = {
      pressure: Math.round((pressureCount / choices.length) * 100) || 0,
      empathy: Math.round((empathyCount / choices.length) * 100) || 0,
      technical: Math.round((technicalCount / choices.length) * 100) || 0
    }

    // 确定主导策略（处理平局）
    const sorted = Object.entries(strategyProfile).sort((a, b) => b[1] - a[1])
    const top = sorted[0]
    const second = sorted[1]

    const shortLabels = {
      pressure: '强势施压',
      empathy: '共情沟通',
      technical: '技术分析'
    }

    let dominantStrategy
    if (top[1] === 0) {
      dominantStrategy = '未形成明显风格'
    } else if (top[1] === second[1]) {
      dominantStrategy = shortLabels[top[0]] + ' + ' + shortLabels[second[0]]
    } else {
      dominantStrategy = shortLabels[top[0]] + '型'
    }

    caseResults.value[caseId] = {
      completed: true,
      completedAt: Date.now(),
      finalPrice: result.finalPrice,
      discountPercent: result.discountPercent,
      success: result.success,
      strategyProfile,
      dominantStrategy,
      score: result.score || 0
    }

    saveProgress({
      caseResults: caseResults.value,
      quizState: quizState.value
    })
  }

  // 保存测验答案
  function saveQuizAnswer(questionId, optionId) {
    quizState.value.answers[questionId] = optionId
  }

  // 完成测验
  function completeQuiz(score) {
    quizState.value.completed = true
    quizState.value.score = score
    saveProgress({
      caseResults: caseResults.value,
      quizState: quizState.value
    })
  }

  // 恢复进度
  function restoreProgress() {
    const saved = loadProgress()
    if (saved) {
      if (saved.caseResults) caseResults.value = saved.caseResults
      if (saved.quizState) quizState.value = saved.quizState
    }
  }

  // 重置所有进度
  function resetAllProgress() {
    caseResults.value = {}
    quizState.value = {
      completed: false,
      score: 0,
      answers: {}
    }
    negotiationState.value = {
      caseId: null,
      currentRound: 1,
      currentNodeId: null,
      playerChoices: [],
      currentPrice: 0,
      fundRemaining: 0,
      isEnvelopeRevealed: false,
      isNegotiationEnded: false,
      negotiationSuccess: false
    }
    clearProgress()
  }

  // 设置字体大小
  function setFontSize(size) {
    uiState.value.fontSize = size
    document.documentElement.style.fontSize = {
      base: '16px',
      large: '20px',
      xlarge: '24px'
    }[size] || '16px'
  }

  return {
    // 状态
    currentCaseId,
    caseResults,
    negotiationState,
    quizState,
    uiState,
    // 计算属性
    completedCases,
    totalCases,
    knowledgeGain,
    // 方法
    startCase,
    recordChoice,
    updateNegotiationState,
    completeCase,
    saveQuizAnswer,
    completeQuiz,
    restoreProgress,
    resetAllProgress,
    setFontSize
  }
})
