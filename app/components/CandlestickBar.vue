<template>
  <canvas 
    ref="canvasRef"
    :width="width * 2"
    :height="height * 2"
    :style="{ width: width + 'px', height: height + 'px' }"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: false,
    default: () => ({
      o: 0, // 开盘价
      h: 0, // 最高价
      l: 0, // 最低价
      c: 0, // 收盘价
    })
  },
  width: {
    type: Number,
    default: 40
  },
  height: {
    type: Number,
    default: 36
  }
})

const canvasRef = ref(null)

const drawCandlestick = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const { o, h, l, c } = props.data

  // 如果没有数据，不绘制
  if (typeof o !== 'number' || typeof h !== 'number' || typeof l !== 'number' || typeof c !== 'number') {
    return
  }

  if (o === 0 && h === 0 && l === 0 && c === 0) {
    return
  }

  // 高DPI支持 - 使用2倍分辨率
  const dpr = 2
  const actualWidth = props.width * dpr
  const actualHeight = props.height * dpr
  
  // 清空画布
  ctx.clearRect(0, 0, actualWidth, actualHeight)
  
  // 设置抗锯齿
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // 计算价格范围
  const priceRange = h - l
  if (priceRange === 0) {
    // 绘制十字星
    const centerX = actualWidth / 2
    const centerY = actualHeight / 2
    
    // 检测是否为暗色模式
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // 十字星使用更明显的颜色
    ctx.strokeStyle = isDarkMode ? '#64748b' : '#475569'
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(6, centerY)
    ctx.lineTo(actualWidth - 6, centerY)
    ctx.stroke()
    return
  }

  // 设置绘制参数 (调整为更窄的K线)
  const padding = 6  // 减少内边距，让K线更大
  const bodyWidth = Math.max(12, actualWidth * 0.35)  // 调整宽度为35%
  const availableHeight = actualHeight - padding * 2

  // 计算位置
  const centerX = actualWidth / 2
  const bodyLeft = centerX - bodyWidth / 2
  const bodyRight = centerX + bodyWidth / 2

  // 价格到像素的转换函数
  const priceToY = (price) => {
    return padding + (h - price) / priceRange * availableHeight
  }

  // 确定颜色 (涨绿跌红)
  const isRising = c >= o
  
  // 检测是否为暗色模式
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  
  const bodyColor = isRising 
    ? (isDarkMode ? '#22c55e' : '#16a34a')  // 暗色模式用亮绿色，浅色模式用深绿色
    : (isDarkMode ? '#ef4444' : '#dc2626')  // 暗色模式用亮红色，浅色模式用深红色
  
  // 影线使用涨跌颜色，稍微深一些让它更明显
  const wickColor = isRising 
    ? (isDarkMode ? '#22c55e' : '#15803d')  // 深绿色影线
    : (isDarkMode ? '#ef4444' : '#b91c1c')  // 深红色影线


  
  // 第一层：边框效果
  const wickBorderColor = isRising 
    ? (isDarkMode ? '#16a34a' : '#14532d')  // 更深的绿色边框
    : (isDarkMode ? '#dc2626' : '#991b1b')  // 更深的红色边框
  
  ctx.strokeStyle = wickBorderColor
  ctx.lineWidth = 6  // 外层边框
  ctx.beginPath()
  // 上影线
  ctx.moveTo(centerX, priceToY(h))
  ctx.lineTo(centerX, priceToY(Math.max(o, c)) - 1)
  // 下影线
  ctx.moveTo(centerX, priceToY(Math.min(o, c)) + 1)
  ctx.lineTo(centerX, priceToY(l))
  ctx.stroke()
  
  // 第二层：主体颜色
  ctx.strokeStyle = wickColor
  ctx.lineWidth = 5  // 内层主体
  ctx.lineCap = 'round'
  ctx.beginPath()
  // 上影线
  ctx.moveTo(centerX, priceToY(h))
  ctx.lineTo(centerX, priceToY(Math.max(o, c)) - 1)
  // 下影线
  ctx.moveTo(centerX, priceToY(Math.min(o, c)) + 1)
  ctx.lineTo(centerX, priceToY(l))
  ctx.stroke()
  
  // 重置阴影
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // 绘制实体
  const bodyTop = priceToY(Math.max(o, c))
  const bodyBottom = priceToY(Math.min(o, c))
  const bodyHeight = Math.max(2, bodyBottom - bodyTop)  // 确保最小高度

  // 添加轻微阴影效果
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1

  // 创建渐变效果
  const gradient = ctx.createLinearGradient(bodyLeft, bodyTop, bodyLeft + bodyWidth, bodyTop + bodyHeight)
  gradient.addColorStop(0, bodyColor)
  gradient.addColorStop(1, bodyColor + '88')  // 添加透明度
  
  ctx.fillStyle = gradient
  
  // 绘制圆角矩形 (兼容性处理)
  const radius = 2
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(bodyLeft, bodyTop, bodyWidth, bodyHeight, radius)
  } else {
    // 如果不支持roundRect，退回到普通矩形
    ctx.rect(bodyLeft, bodyTop, bodyWidth, bodyHeight)
  }
  ctx.fill()
  
  // 重置阴影
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  // 添加实体边框以提高清晰度
  ctx.strokeStyle = bodyColor
  ctx.lineWidth = 2
  ctx.beginPath()
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(bodyLeft, bodyTop, bodyWidth, bodyHeight, radius)
  } else {
    ctx.rect(bodyLeft, bodyTop, bodyWidth, bodyHeight)
  }
  ctx.stroke()

  // 如果是十字星（开盘价等于收盘价），绘制横线
  if (o === c) {
    ctx.strokeStyle = bodyColor
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(bodyLeft - 3, priceToY(o))
    ctx.lineTo(bodyRight + 3, priceToY(o))
    ctx.stroke()
  }
}

// 监听数据变化
watch(() => props.data, drawCandlestick, { deep: true })

onMounted(() => {
  drawCandlestick()
})
</script> 