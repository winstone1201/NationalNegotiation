// ========================================
// localStorage 进度持久化
// ========================================

const STORAGE_KEY = 'national_negotiation_progress'
const SETTINGS_KEY = 'national_negotiation_settings'

/**
 * 保存游戏进度
 */
export function saveProgress(data) {
  try {
    const payload = {
      ...data,
      savedAt: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch (e) {
    console.warn('Failed to save progress:', e)
    return false
  }
}

/**
 * 加载游戏进度
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return data
  } catch (e) {
    console.warn('Failed to load progress:', e)
    return null
  }
}

/**
 * 清除游戏进度
 */
export function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (e) {
    console.warn('Failed to clear progress:', e)
    return false
  }
}

/**
 * 保存设置
 */
export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    return true
  } catch (e) {
    return false
  }
}

/**
 * 加载设置
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { isSoundEnabled: true, fontSize: 'base' }
    return JSON.parse(raw)
  } catch (e) {
    return { isSoundEnabled: true, fontSize: 'base' }
  }
}
