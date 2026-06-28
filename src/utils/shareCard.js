// ========================================
// Canvas API 分享卡片生成
// ========================================

/**
 * 生成谈判结果分享卡片
 */
export async function generateShareCard(options) {
  const {
    caseName = '',
    initialPrice = 0,
    finalPrice = 0,
    realPrice = 0,
    strategyLabel = '',
    discountPercent = '',
    isSuccess = true
  } = options

  const W = 750
  const H = 400
  const P = 48 // 统一内边距
  const scale = 2

  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = H * scale

  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)

  // ========== 背景 ==========
  const bg = ctx.createLinearGradient(0, 0, W, H)
  if (isSuccess) {
    bg.addColorStop(0, '#b5343a')
    bg.addColorStop(0.5, '#c0392b')
    bg.addColorStop(1, '#8b1a1a')
  } else {
    bg.addColorStop(0, '#636e72')
    bg.addColorStop(1, '#2d3436')
  }
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // ========== 装饰元素 ==========
  // 大光晕
  ctx.fillStyle = 'rgba(255,255,255,0.03)'
  ctx.beginPath()
  ctx.arc(W - 100, 100, 200, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(80, H - 80, 140, 0, Math.PI * 2)
  ctx.fill()

  // 分割细线
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(P, 68)
  ctx.lineTo(W - P, 68)
  ctx.stroke()

  // ========== 顶部：标题区 ==========
  ctx.fillStyle = 'rgba(255,255,255,0.6)'
  ctx.font = '16px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('🏛 国家医保谈判 · 沉浸式新闻互动游戏', P, 44)

  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 26px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(caseName, P, 116)

  // 右侧：策略标签
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText('我的谈判风格', W - P, 96)
  ctx.fillStyle = '#ffd700'
  ctx.font = 'bold 22px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.fillText(strategyLabel, W - P, 126)

  // ========== 中部：核心数据卡片 ==========
  const cardX = P
  const cardY = 152
  const cardW = W - P * 2
  const cardH = 118

  // 半透明白色卡片背景
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  roundRect(ctx, cardX, cardY, cardW, cardH, 14)
  ctx.fill()

  // 卡片内边框
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  roundRect(ctx, cardX, cardY, cardW, cardH, 14)
  ctx.stroke()

  // 三列数据
  const colW = cardW / 3
  const colCenterY = cardY + cardH / 2

  // 列1：药企初始报价
  drawDataColumn(ctx, cardX, colCenterY, colW, {
    label: '药企初始报价',
    value: formatPrice(initialPrice) + ' 元',
    valueColor: 'rgba(255,255,255,0.8)',
    valueSize: '20px'
  })

  // 列2：我砍到的价格（高亮）
  drawDataColumn(ctx, cardX + colW, colCenterY, colW, {
    label: '我砍到的价格',
    value: formatPrice(finalPrice) + ' 元',
    valueColor: '#ffd700',
    valueSize: 'bold 28px'
  })

  // 列3：降幅
  const discountNum = parseInt(discountPercent) || 0
  drawDataColumn(ctx, cardX + colW * 2, colCenterY, colW, {
    label: '砍价幅度',
    value: discountPercent,
    valueColor: discountNum >= 50 ? '#4effb4' : '#ffd700',
    valueSize: 'bold 28px'
  })

  // 列间分隔线
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cardX + colW, cardY + 24)
  ctx.lineTo(cardX + colW, cardY + cardH - 24)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cardX + colW * 2, cardY + 24)
  ctx.lineTo(cardX + colW * 2, cardY + cardH - 24)
  ctx.stroke()

  // ========== 底部：对比区域 ==========
  const bottomY = cardY + cardH + 30

  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '14px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('真实谈判官结果', P, bottomY)

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '18px "SF Mono", "Menlo", monospace'
  ctx.fillText(formatPrice(realPrice) + ' 元', P, bottomY + 26)

  // 对比结论
  const diff = realPrice - finalPrice
  ctx.textAlign = 'right'
  if (diff >= 0) {
    ctx.fillStyle = '#4effb4'
    ctx.font = 'bold 18px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.fillText(`我多砍了 ${formatPrice(Math.abs(diff))} 元 💪`, W - P, bottomY + 14)
  } else {
    ctx.fillStyle = '#ff6b6b'
    ctx.font = 'bold 18px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.fillText(`离谈判官还差 ${formatPrice(Math.abs(diff))} 元`, W - P, bottomY + 14)
  }

  // 对比进度条
  const barY = bottomY + 36
  const barW = W - P * 2
  const barH = 8
  const maxPrice = Math.max(initialPrice, realPrice, finalPrice) * 1.1

  // 背景条
  ctx.fillStyle = 'rgba(255,255,255,0.12)'
  roundRect(ctx, P, barY, barW, barH, 4)
  ctx.fill()

  // 玩家价格点在条上的位置
  if (maxPrice > 0) {
    const playerRatio = Math.min(1, finalPrice / maxPrice)
    const realRatio = Math.min(1, realPrice / maxPrice)

    // 玩家标记
    const playerX = P + barW * playerRatio
    ctx.fillStyle = '#ffd700'
    ctx.beginPath()
    ctx.arc(playerX, barY + barH / 2, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 11px "PingFang SC", "Microsoft YaHei", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('我', playerX, barY - 8)

    // 谈判官标记
    const realX = P + barW * realRatio
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(realX, barY + barH / 2, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(realX, barY + barH / 2, 7, 0, Math.PI * 2)
    ctx.stroke()
    ctx.fillStyle = '#ffffff'
    ctx.fillText('官', realX, barY - 8)
  }

  // ========== 底部水印 ==========
  const footerY = H - 28
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.font = '11px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('模拟数据 · 不代表真实谈判结果', P, footerY)

  ctx.textAlign = 'right'
  ctx.fillText('扫码体验国谈 →', W - P, footerY)

  return canvas.toDataURL('image/png', 0.95)
}

/**
 * 绘制单列数据（标签在上，数值在下，垂直居中在卡片中）
 */
function drawDataColumn(ctx, colX, centerY, colW, { label, value, valueColor, valueSize }) {
  const labelY = centerY - 10
  const valueY = centerY + 20

  // 标签
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.font = '12px "PingFang SC", "Microsoft YaHei", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(label, colX + colW / 2, labelY)

  // 数值
  ctx.fillStyle = valueColor
  ctx.font = `${valueSize} "SF Mono", "Menlo", "PingFang SC", monospace`
  ctx.textAlign = 'center'
  ctx.fillText(value, colX + colW / 2, valueY)
}

/**
 * Canvas roundRect polyfill（兼容旧浏览器）
 */
function roundRect(ctx, x, y, w, h, r) {
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r)
    return
  }
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/**
 * 格式化价格（万为单位）
 */
function formatPrice(price) {
  if (price >= 10000) {
    const wan = price / 10000
    return wan % 1 === 0 ? wan.toFixed(0) + '万' : wan.toFixed(1) + '万'
  }
  return price.toLocaleString('zh-CN')
}

/**
 * 触发图片下载
 */
export function downloadShareCard(dataUrl, filename = 'negotiation-result.png') {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
