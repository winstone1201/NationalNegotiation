import { ref, computed } from 'vue'

/**
 * 对话引擎 Composable
 * 负责对话树遍历、回合管理、底价揭晓逻辑
 */
export function useDialogueEngine() {
  // === 内部数据引用（通过 init 设置） ===
  const _caseData = ref(null)

  // === 状态 ===
  const currentRound = ref(1)
  const currentNode = ref(null)
  const isWaitingForChoice = ref(false)
  const isEnvelopeRevealed = ref(false)
  const isNegotiationEnded = ref(false)
  const history = ref([])
  const playerChoices = ref([])
  const currentPrice = ref(0)

  // === 初始化：传入案例数据 ===
  function init(caseData) {
    if (!caseData || !caseData.rounds || caseData.rounds.length === 0) {
      console.error('[Engine] init: 无效的案例数据', caseData)
      return false
    }

    _caseData.value = caseData
    const firstRound = caseData.rounds[0]

    currentRound.value = 1
    currentPrice.value = firstRound.pharmaOpeningQuote
    history.value = []
    playerChoices.value = []
    isWaitingForChoice.value = false
    isEnvelopeRevealed.value = false
    isNegotiationEnded.value = false

    // 第一个节点：旁白叙事
    currentNode.value = {
      nodeId: `round_1_intro`,
      speaker: 'narrator',
      speakerName: '旁白',
      text: firstRound.narrativeIntro,
      emotion: '',
      roundIntro: true
    }

    console.log('[Engine] init 完成, 首节点:', currentNode.value.nodeId)
    return true
  }

  // === 处理玩家选择 ===
  function makeChoice(option) {
    if (!_caseData.value) return

    // 记录选择
    playerChoices.value.push({
      round: currentRound.value,
      optionId: option.id,
      type: option.type,
      text: option.text
    })

    // 应用价格效果
    if (option.effects?.priceChange) {
      currentPrice.value += option.effects.priceChange
      currentPrice.value = Math.max(0, currentPrice.value)
    }

    // 查找对话树中的后续节点
    const roundData = _caseData.value.rounds[currentRound.value - 1]
    if (currentNode.value?.options && roundData?.dialogueTree) {
      const selectedOpt = currentNode.value.options.find(o => o.id === option.id)
      if (selectedOpt?.nextNode && roundData.dialogueTree[selectedOpt.nextNode]) {
        currentNode.value = roundData.dialogueTree[selectedOpt.nextNode]
        console.log('[Engine] 进入对话树节点:', currentNode.value.nodeId)
        return
      }
    }

    // 降级：生成默认回应
    currentNode.value = _generateResponse(option)
  }

  // === 生成药企回应 ===
  function _generateResponse(option) {
    const roundData = _caseData.value.rounds[currentRound.value - 1]
    const hasNextRound = currentRound.value < _caseData.value.rounds.length

    if (hasNextRound) {
      const texts = {
        pressure: '我方理解贵方的立场……经过内部紧急讨论，我们愿意做出一定让步。请听我方第二轮报价。',
        empathy: '我们对患者的情况深表同情……在第二轮谈判中，我们愿意重新审视定价方案。',
        technical: '贵方的测算模型确实专业。我需要与总部确认一些数据……第二轮谈判我们继续。'
      }
      return {
        nodeId: `round_${currentRound.value}_response`,
        speaker: 'pharma',
        speakerName: '药企代表',
        text: texts[option.type] || '我方已收到贵方意见，第二轮继续讨论。',
        emotion: option.type === 'pressure' ? 'defensive' : 'conciliatory',
        isEndOfRound: true
      }
    }

    // 最后一轮 → 触发信封
    return {
      nodeId: `round_${currentRound.value}_final`,
      speaker: 'pharma',
      speakerName: '药企代表',
      text: `这是我们的最终报价：${formatPrice(currentPrice.value)} 元。`,
      emotion: 'defensive',
      triggerEnvelope: true
    }
  }

  // === 推进对话 ===
  function advanceDialogue() {
    const node = currentNode.value
    if (!node) { console.warn('[Engine] advanceDialogue: 当前无节点'); return }

    // 加入历史
    history.value.push({ ...node })
    console.log('[Engine] advanceDialogue:', node.nodeId, 'roundIntro:', node.roundIntro, 'isEndOfRound:', node.isEndOfRound, 'triggerEnvelope:', node.triggerEnvelope, 'hasOptions:', !!node.options?.length)

    // 回合介绍 → 加载对话树第一个节点
    if (node.roundIntro) {
      const roundData = _caseData.value.rounds[currentRound.value - 1]
      if (roundData?.dialogueTree?.startNode) {
        currentNode.value = roundData.dialogueTree[roundData.dialogueTree.startNode]
      } else {
        currentNode.value = _buildDefaultNode(roundData)
      }
      return
    }

    // 回合结束 → 下一回合
    if (node.isEndOfRound) {
      _advanceToNextRound()
      return
    }

    // 触发信封
    if (node.triggerEnvelope) {
      isEnvelopeRevealed.value = true
      isNegotiationEnded.value = true
      return
    }

    // 有选项 → 等待选择
    if (node.options?.length > 0) {
      isWaitingForChoice.value = true
      return
    }
  }

  // === 构建默认节点 ===
  function _buildDefaultNode(roundData) {
    return {
      nodeId: `round_${roundData.roundNumber}_default`,
      speaker: 'pharma',
      speakerName: '药企代表',
      text: `我方本轮报价为 ${formatPrice(roundData.pharmaOpeningQuote)} 元。`,
      emotion: 'confident',
      options: [
        {
          id: 'A', type: 'pressure', label: '施压型',
          text: `贵方报价远高于参照药价格，请提供详细依据。`,
          effects: { priceChange: -Math.round(roundData.pharmaOpeningQuote * 0.15) }
        },
        {
          id: 'B', type: 'empathy', label: '情理型',
          text: '目前有大量患者等待用药，请贵方理解基金压力。',
          effects: { priceChange: -Math.round(roundData.pharmaOpeningQuote * 0.08) }
        },
        {
          id: 'C', type: 'technical', label: '技术型',
          text: `根据药物经济学模型测算，建议价格区间为 ${formatPrice(roundData.floorPrice)} 元左右。`,
          effects: { priceChange: -Math.round(roundData.pharmaOpeningQuote * 0.12) }
        }
      ]
    }
  }

  // === 推进到下一回合 ===
  function _advanceToNextRound() {
    const nextRoundIndex = currentRound.value // 数组索引 = 当前回合号
    const nextRound = _caseData.value.rounds[nextRoundIndex]

    if (nextRound) {
      currentRound.value = nextRound.roundNumber
      if (nextRound.pharmaOpeningQuote) {
        currentPrice.value = nextRound.pharmaOpeningQuote
      }

      currentNode.value = {
        nodeId: `round_${nextRound.roundNumber}_intro`,
        speaker: 'narrator',
        speakerName: '旁白',
        text: nextRound.narrativeIntro,
        emotion: '',
        roundIntro: true
      }
      isWaitingForChoice.value = false
    } else {
      // 没有更多回合 → 信封
      currentNode.value = {
        nodeId: 'final_envelope_trigger',
        speaker: 'narrator',
        speakerName: '旁白',
        text: '两轮谈判已结束。请揭晓医保局的底价信封。',
        emotion: '',
        triggerEnvelope: true
      }
      isWaitingForChoice.value = false
    }
  }

  // === 信封结果 ===
  function getEnvelopeResult() {
    if (!_caseData.value) return null
    const roundData = _caseData.value.rounds[currentRound.value - 1]
    const floorPrice = roundData?.floorPrice || 0
    const finalPrice = currentPrice.value
    const success = finalPrice <= floorPrice * 1.15
    const initialPrice = _caseData.value.drugInfo?.initialPrice || 1
    const discountPercent = Math.round((1 - finalPrice / initialPrice) * 100)

    return {
      success,
      floorPrice,
      finalPrice,
      threshold: Math.round(floorPrice * 1.15),
      discountPercent: `${discountPercent}%`,
      realResult: _caseData.value.realResult || null
    }
  }

  return {
    currentRound,
    currentNode,
    history,
    playerChoices,
    currentPrice,
    isWaitingForChoice,
    isEnvelopeRevealed,
    isNegotiationEnded,
    init,
    makeChoice,
    advanceDialogue,
    getEnvelopeResult
  }
}

function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  return price.toFixed(2)
}
