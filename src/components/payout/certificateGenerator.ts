import * as THREE from 'three'
import { DemoAchievement } from './payoutData'

const textureCache = new Map<string, THREE.CanvasTexture>()

/**
 * Generates an ultra-crisp, luxury financial certificate texture
 * directly in memory using HTML5 Canvas (1024x640).
 */
export function getOrCreateCertificateTexture(achievement: DemoAchievement): THREE.CanvasTexture {
  if (textureCache.has(achievement.id)) {
    return textureCache.get(achievement.id)!
  }

  const width = 1024
  const height = 640
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas)
    return fallback
  }

  // 1. Background Gradient (Midnight Luxury Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#030816')
  bgGrad.addColorStop(0.4, '#061129')
  bgGrad.addColorStop(0.8, '#081738')
  bgGrad.addColorStop(1, '#040B1E')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Subtle Radial Glow behind Payout Amount
  const radialGlow = ctx.createRadialGradient(width / 2, height * 0.52, 20, width / 2, height * 0.52, 380)
  radialGlow.addColorStop(0, `${achievement.accentColor}28`) // 16% opacity
  radialGlow.addColorStop(0.5, `${achievement.secondaryColor}14`)
  radialGlow.addColorStop(1, 'transparent')
  ctx.fillStyle = radialGlow
  ctx.fillRect(0, 0, width, height)

  // 3. Faint Security Guilloche / Geometric Lines (Subtle Trading Matrix)
  ctx.save()
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.07)'
  ctx.lineWidth = 1
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    const r = 180 + i * 28
    ctx.arc(width * 0.82, height * 0.48, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  // Subtle diagonal watermark grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'
  for (let x = -height; x < width + height; x += 48) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + height, height)
    ctx.stroke()
  }
  ctx.restore()

  // 4. Outer Border & Metallic Stroke
  ctx.save()
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.28)'
  ctx.lineWidth = 2
  ctx.strokeRect(28, 28, width - 56, height - 56)

  // Inner hairline border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 1
  ctx.strokeRect(38, 38, width - 76, height - 76)

  // Decorative Corner Tick Marks (Matching Pravyn ICT pc-corner style)
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    ctx.strokeStyle = achievement.accentColor
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y + dy * 24)
    ctx.lineTo(x, y)
    ctx.lineTo(x + dx * 24, y)
    ctx.stroke()
  }
  drawCorner(28, 28, 1, 1)
  drawCorner(width - 28, 28, -1, 1)
  drawCorner(28, height - 28, 1, -1)
  drawCorner(width - 28, height - 28, -1, -1)
  ctx.restore()

  // 5. Header: Academy Logo / Monogram & Academy Branding
  ctx.save()
  // Monogram badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.35)'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(64, 58, 48, 48, 8)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#60A5FA'
  ctx.font = 'bold 20px "DM Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('PI', 88, 90)

  // Academy title
  ctx.textAlign = 'left'
  ctx.font = 'bold 15px "Inter", sans-serif'
  ctx.fillStyle = '#EFF6FF'
  ctx.letterSpacing = '0.08em'
  ctx.fillText('PRAVYN ICT ACADEMY', 126, 78)

  ctx.font = '10px "DM Mono", monospace'
  ctx.fillStyle = '#64748B'
  ctx.fillText('PRECISION EXECUTION & MENTORSHIP FRAMEWORK', 126, 96)

  // Right Header: Achievement Category Pill Badge
  ctx.font = 'bold 11px "DM Mono", monospace'
  const badgeText = achievement.badgeLabel
  const badgeMetrics = ctx.measureText(badgeText)
  const badgeW = badgeMetrics.width + 28
  const badgeH = 28
  const badgeX = width - 64 - badgeW
  const badgeY = 68

  ctx.fillStyle = `${achievement.accentColor}20`
  ctx.strokeStyle = achievement.accentColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = achievement.accentColor
  ctx.textAlign = 'center'
  ctx.fillText(badgeText, badgeX + badgeW / 2, badgeY + 18)
  ctx.restore()

  // 6. Certificate Title Eyebrow
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '600 13px "DM Mono", monospace'
  ctx.fillStyle = '#94A3B8'
  ctx.letterSpacing = '0.1em'
  ctx.fillText('CERTIFICATE OF SIMULATED MILESTONE', width / 2, 166)

  // 7. Student Name (Large & Bold for crystal-clear mobile readability)
  ctx.font = '800 48px "Inter", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(56, 189, 248, 0.45)'
  ctx.shadowBlur = 18
  ctx.fillText(achievement.student, width / 2, 222)
  ctx.shadowBlur = 0

  // 8. Account Tier Pill
  const tierText = achievement.accountTier.toUpperCase()
  ctx.font = '700 14px "DM Mono", monospace'
  const tierWidth = ctx.measureText(tierText).width + 32
  const tierX = (width - tierWidth) / 2
  const tierY = 246
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'
  ctx.strokeStyle = achievement.accentColor
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.roundRect(tierX, tierY, tierWidth, 28, 6)
  ctx.fill()
  ctx.stroke()

  ctx.fillStyle = '#BAE6FD'
  ctx.fillText(tierText, width / 2, tierY + 19)
  ctx.restore()

  // 9. Giant Glowing Payout Dollar Amount (Bold, Hero size)
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = '600 12px "DM Mono", monospace'
  ctx.fillStyle = '#64748B'
  ctx.letterSpacing = '0.12em'
  ctx.fillText('RECORDED SIMULATION PAYOUT', width / 2, 320)

  ctx.font = '900 78px "Inter", sans-serif'
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = achievement.accentColor
  ctx.shadowBlur = 36
  ctx.fillText(achievement.payoutAmount, width / 2, 400)
  ctx.shadowBlur = 0

  // Execution model subtitle
  ctx.font = '600 15px "Inter", sans-serif'
  ctx.fillStyle = '#94A3B8'
  ctx.fillText(`Strategy: ${achievement.evaluationModel}`, width / 2, 436)
  ctx.restore()

  // 10. Mini Performance Badges (Win Rate / RR / Trades)
  ctx.save()
  const stats = [
    { label: 'WIN RATE', val: achievement.metrics.winRate },
    { label: 'RISK : REWARD', val: achievement.metrics.riskReward },
    { label: 'TRADES LOGGED', val: achievement.metrics.tradesLogged }
  ]
  const cardW = 124
  const cardGap = 16
  const totalStatsW = stats.length * cardW + (stats.length - 1) * cardGap
  const startStatsX = (width - totalStatsW) / 2
  const statsY = 464

  stats.forEach((st, i) => {
    const x = startStatsX + i * (cardW + cardGap)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.roundRect(x, statsY, cardW, 48, 6)
    ctx.fill()
    ctx.stroke()

    ctx.textAlign = 'center'
    ctx.font = 'bold 16px "Inter", sans-serif'
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(st.val, x + cardW / 2, statsY + 23)

    ctx.font = '9px "DM Mono", monospace'
    ctx.fillStyle = '#64748B'
    ctx.fillText(st.label, x + cardW / 2, statsY + 38)
  })
  ctx.restore()

  // 11. Mini Chart Sparkline (Lower Right Accent)
  ctx.save()
  const chartX = width - 200
  const chartY = 478
  ctx.strokeStyle = achievement.accentColor
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(chartX, chartY + 28)
  ctx.lineTo(chartX + 26, chartY + 20)
  ctx.lineTo(chartX + 54, chartY + 26)
  ctx.lineTo(chartX + 82, chartY + 10)
  ctx.lineTo(chartX + 110, chartY + 16)
  ctx.lineTo(chartX + 138, chartY + 2)
  ctx.stroke()

  ctx.fillStyle = achievement.accentColor
  ctx.beginPath()
  ctx.arc(chartX + 138, chartY + 2, 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // 12. Bottom Strip: Verification ID & Mandatory Demo Disclaimer
  ctx.save()
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.16)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(64, height - 76)
  ctx.lineTo(width - 64, height - 76)
  ctx.stroke()

  // Serial Number
  ctx.font = '10px "DM Mono", monospace'
  ctx.fillStyle = '#64748B'
  ctx.textAlign = 'left'
  ctx.fillText(`VERIFY: ${achievement.certificateNo}`, 64, height - 50)

  // Prominent, Readable Demo Disclaimer
  ctx.textAlign = 'right'
  ctx.font = 'bold 12px "DM Mono", monospace'
  ctx.fillStyle = '#F59E0B' // Amber warning/disclaimer color
  ctx.fillText(`★ ${achievement.disclaimer} ★`, width - 64, height - 50)
  ctx.restore()

  // 13. Create Three.js CanvasTexture with Mipmaps
  const texture = new THREE.CanvasTexture(canvas)
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true

  textureCache.set(achievement.id, texture)
  return texture
}
