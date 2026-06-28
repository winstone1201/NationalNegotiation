// ========================================
// 数据埋点封装
// ========================================

/**
 * 埋点事件枚举
 */
export const EventType = {
  PAGE_VIEW: 'page_view',
  CASE_SELECT: 'case_select',
  NEGOTIATION_START: 'negotiation_start',
  DECISION_MAKE: 'decision_make',
  ROUND_COMPLETE: 'round_complete',
  ENVELOPE_REVEAL: 'envelope_reveal',
  NEGOTIATION_COMPLETE: 'negotiation_complete',
  SHARE_CLICK: 'share_click',
  SHARE_SUCCESS: 'share_success',
  QUIZ_START: 'quiz_start',
  QUIZ_COMPLETE: 'quiz_complete',
  DEEP_READ_CLICK: 'deep_read_click',
  DRUG_INFO_CLICK: 'drug_info_click'
}

/**
 * 发送埋点事件
 * 当前版本使用 console 输出，生产环境可替换为医保局数据平台接口
 */
export function trackEvent(eventType, params = {}) {
  const event = {
    event: eventType,
    params,
    timestamp: Date.now(),
    sessionId: getSessionId()
  }

  // 开发环境打印到控制台
  if (import.meta.env.DEV) {
    console.log('[Track]', event)
  }

  // TODO: 替换为实际数据平台接口
  // 医保局数据平台对接示例：
  // sendToAnalytics(event)

  return event
}

/**
 * 发送页面浏览事件
 */
export function trackPageView(pageName, extra = {}) {
  return trackEvent(EventType.PAGE_VIEW, { page: pageName, ...extra })
}

/**
 * 发送决策事件
 */
export function trackDecision(caseId, round, choiceType, nodeId) {
  return trackEvent(EventType.DECISION_MAKE, {
    caseId,
    round,
    choiceType,
    nodeId
  })
}

/**
 * 发送完成事件
 */
export function trackComplete(caseId, result) {
  return trackEvent(EventType.NEGOTIATION_COMPLETE, {
    caseId,
    success: result.success,
    finalPrice: result.finalPrice,
    discountPercent: result.discountPercent
  })
}

/**
 * 获取或生成 session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('nn_session_id')
  if (!sessionId) {
    sessionId = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8)
    sessionStorage.setItem('nn_session_id', sessionId)
  }
  return sessionId
}
