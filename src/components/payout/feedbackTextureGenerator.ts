import * as THREE from 'three'

const textureCache = new Map<string, THREE.CanvasTexture>()

/**
 * Creates an ultra-premium 3D card texture from a real student feedback screenshot.
 * Fits the screenshot cleanly with preserved aspect ratio inside a sleek dark luxury frame.
 */
export function getOrCreateFeedbackCardTexture(imageUrl: string, index: number): THREE.CanvasTexture {
  if (textureCache.has(imageUrl)) {
    return textureCache.get(imageUrl)!
  }

  const width = 800
  const height = 1120
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter

  textureCache.set(imageUrl, texture)

  if (!ctx) return texture

  // Helper to draw the authentic screenshot and crisp card edge framing
  const renderCard = (img?: HTMLImageElement) => {
    // 1. Dark Luxury Background (prevents any letterbox mismatch)
    ctx.fillStyle = '#040916'
    ctx.fillRect(0, 0, width, height)

    // 2. Draw the authentic student feedback screenshot
    if (img && img.complete && img.naturalWidth > 0) {
      // Fit screenshot cleanly within the card boundaries
      const padX = 14
      const padY = 14
      const maxW = width - padX * 2
      const maxH = height - padY * 2

      const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight)
      const drawW = img.naturalWidth * scale
      const drawH = img.naturalHeight * scale
      const drawX = padX + (maxW - drawW) / 2
      const drawY = padY + (maxH - drawH) / 2

      // Draw the actual authentic screenshot with subtle rounded corners
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(drawX, drawY, drawW, drawH, 10)
      ctx.clip()
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
      ctx.restore()

      // Crisp inner boundary line around the screenshot
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(drawX, drawY, drawW, drawH, 10)
      ctx.stroke()
    } else {
      // Clean dark placeholder while texture loads
      ctx.fillStyle = '#0b162c'
      ctx.fillRect(16, 16, width - 32, height - 32)
    }

    // 3. Card Edge Design: Outer border frame with metallic corner notches
    ctx.save()
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.roundRect(6, 6, width - 12, height - 12, 12)
    ctx.stroke()

    // Corner decorative notches (Edge design)
    const notch = 24
    ctx.strokeStyle = '#38BDF8'
    ctx.lineWidth = 3.5
    // Top-left
    ctx.beginPath(); ctx.moveTo(6, 6 + notch); ctx.lineTo(6, 6); ctx.lineTo(6 + notch, 6); ctx.stroke()
    // Top-right
    ctx.beginPath(); ctx.moveTo(width - 6 - notch, 6); ctx.lineTo(width - 6, 6); ctx.lineTo(width - 6, 6 + notch); ctx.stroke()
    // Bottom-left
    ctx.beginPath(); ctx.moveTo(6, height - 6 - notch); ctx.lineTo(6, height - 6); ctx.lineTo(6 + notch, height - 6); ctx.stroke()
    // Bottom-right
    ctx.beginPath(); ctx.moveTo(width - 6 - notch, height - 6); ctx.lineTo(width - 6, height - 6); ctx.lineTo(width - 6, height - 6 - notch); ctx.stroke()
    ctx.restore()

    texture.needsUpdate = true
  }

  // Initial draw (placeholder)
  renderCard()

  // Load the actual image
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    renderCard(img)
  }
  img.onerror = () => {
    // If path needed encoding or fallback
    renderCard()
  }
  img.src = imageUrl

  return texture
}
