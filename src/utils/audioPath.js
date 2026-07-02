/**
 * 音频文件路径工具
 * 使用 Vite 的 BASE_URL 确保本地开发 (/) 和 GitHub Pages 部署 (./)
 * 都能正确加载音频资源
 */
const BASE = import.meta.env.BASE_URL

/**
 * 获取 public/audio/ 目录下音频文件的完整路径
 * @param {string} filename - 音频文件名（如 'wechat-ringtone.mp3'）
 * @returns {string} 完整路径（如 './audio/wechat-ringtone.mp3'）
 */
export function getAudioPath(filename) {
  return `${BASE}audio/${filename}`
}
