/**
 * usePhoneAudio - 电话音频工具
 *
 * 已废弃 Web Audio API 合成和 Web Speech API 方案。
 * 现在使用预生成的音频文件（edge-tts 生成的自然语音 + FM合成的铃声）。
 *
 * 保留此文件供未来扩展使用。
 */

export function isAudioSupported() {
  return !!(window.AudioContext || window.webkitAudioContext)
}

export function cleanupAllAudio() {
  // 预生成的音频文件由 PhoneCallEffect.vue 直接管理
}
