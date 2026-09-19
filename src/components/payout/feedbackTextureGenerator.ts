import * as THREE from 'three'

const textureCache = new Map<string, THREE.CanvasTexture>()

/**
 * Creates an ultra-high resolution (1200x1680) 3D card texture from a real student feedback screenshot.
 * Maximizes screenshot visibility, sharpness, and readability with precision borders.
 */
export function getOrCreateFeedbackCardTexture(imageUrl: string, index: number): THREE.CanvasTexture {
  if (textureCache.has(imageUrl)) {
    return textureCache.get(imageUrl)!
  }

  const width = 1200
  const height = 1680
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

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // Helper to draw the authentic screenshot cleanly without artificial borders
  const renderCard = (img?: HTMLImageElement) => {
    // 1. Clean dark obsidian backing
    ctx.fillStyle = '#020612'
    ctx.fillRect(0, 0, width, height)

    // 2. Draw the authentic student feedback screenshot cleanly with no artificial blue borders
    if (img && img.complete && img.naturalWidth > 0) {
      const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight)
      const drawW = img.naturalWidth * scale
      const drawH = img.naturalHeight * scale
      const drawX = (width - drawW) / 2
      const drawY = (height - drawH) / 2

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(drawX, drawY, drawW, drawH, 16)
      ctx.clip()
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
      ctx.restore()
    } else {
      ctx.fillStyle = '#060c1c'
      ctx.fillRect(0, 0, width, height)
    }

    texture.needsUpdate = true
  }

  // Initial render
  renderCard()

  // Load the actual image
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    renderCard(img)
  }
  img.onerror = () => {
    // If URL was unencoded or had issue, try decodeURI
    const retryImg = new Image()
    retryImg.onload = () => renderCard(retryImg)
    retryImg.src = decodeURI(imageUrl)
  }
  img.src = imageUrl

  return texture
}

