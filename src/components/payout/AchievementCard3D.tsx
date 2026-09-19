import React, { useMemo, useRef, useState } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { getOrCreateFeedbackCardTexture } from './feedbackTextureGenerator'

export interface CarouselMotion {
  progress: number
  dragDistance: number
}

interface AchievementCard3DProps {
  imageUrl: string
  index: number
  totalCards: number
  cardWidth: number
  cardHeight: number
  Rx: number
  Rz: number
  zOffset: number
  isMobile: boolean
  motionRef: React.MutableRefObject<CarouselMotion>
  onSelect?: (url: string) => void
  onHoverChange?: (hovered: boolean) => void
}

export const AchievementCard3D: React.FC<AchievementCard3DProps> = React.memo(({
  imageUrl,
  index,
  totalCards,
  cardWidth,
  cardHeight,
  Rx,
  Rz,
  zOffset,
  isMobile,
  motionRef,
  onSelect,
  onHoverChange,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const borderMatRef = useRef<THREE.MeshStandardMaterial>(null)
  const frontMatRef = useRef<THREE.MeshBasicMaterial>(null)
  const [isHovered, setIsHovered] = useState(false)

  // 1. Texture with high-resolution screenshot
  const texture = useMemo(() => getOrCreateFeedbackCardTexture(imageUrl, index), [imageUrl, index])

  // 2. Direct GPU transform update in Three.js frame loop - zero React re-render overhead!
  useFrame((state) => {
    const group = groupRef.current
    if (!group) return

    const t = state.clock.getElapsedTime()
    const progress = motionRef.current.progress

    // Normalized circular position u in [0, 1)
    let u = ((index / totalCards) + progress) % 1
    if (u < 0) u += 1

    const theta = (u - 0.5) * 2 * Math.PI
    const cosVal = Math.cos(theta)
    const opacity = cosVal >= 0 ? 1.0 : Math.max(0, 1.0 + cosVal * 1.8)

    if (opacity <= 0.02) {
      group.visible = false
      return
    }
    group.visible = true

    // Organic weightless floating levitation
    const floatY = Math.sin(t * 1.7 + index * 1.2) * 0.12
    const floatRotX = Math.cos(t * 1.3 + index * 1.1) * 0.03
    const floatRotZ = Math.sin(t * 1.1 + index * 1.4) * 0.02

    // Track position
    const x = Rx * Math.sin(theta)
    const z = Rz * Math.cos(theta) + zOffset

    // Amphitheater rotation: flat to user when front-facing (|theta| < 0.20)
    const rotY = Math.abs(theta) < 0.20 ? 0 : -Math.sin(theta) * 0.40

    // Prominence scale for front card
    const frontFocus = Math.max(0, cosVal)
    const baseScale = isMobile
      ? 0.90 + Math.pow(frontFocus, 1.4) * 0.36
      : 0.82 + Math.pow(frontFocus, 1.6) * 0.52

    const hoverZ = isHovered ? 0.35 : 0
    const hoverScale = isHovered ? 1.08 : 1.0
    const s = baseScale * hoverScale

    group.position.set(x, floatY, z + hoverZ)
    group.rotation.set(floatRotX, rotY, floatRotZ)
    group.scale.set(s, s, s)

    if (frontMatRef.current) {
      frontMatRef.current.opacity = opacity
    }
    if (borderMatRef.current) {
      borderMatRef.current.opacity = opacity * 0.95
    }
  })

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    // Avoid touch events getting permanently stuck in hover state on mobile
    if ((e.nativeEvent as PointerEvent).pointerType === 'touch') return
    e.stopPropagation()
    setIsHovered(true)
    if (onHoverChange) onHoverChange(true)
    document.body.style.cursor = 'pointer'
  }

  const handlePointerOut = () => {
    setIsHovered(false)
    if (onHoverChange) onHoverChange(false)
    document.body.style.cursor = 'default'
  }

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    // Suppress click if user was dragging / sliding
    if (motionRef.current.dragDistance > 8) return
    if (onSelect) onSelect(imageUrl)
  }

  const slabDepth = 0.016

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Subtle Sleek Dark Backing Slab */}
      <mesh position={[0, 0, -slabDepth / 2]}>
        <boxGeometry args={[cardWidth, cardHeight, slabDepth]} />
        <meshStandardMaterial
          ref={borderMatRef}
          color="#040816"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* Front Face: Clean Authentic Student Payout Screenshot */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[cardWidth, cardHeight, 1, 1]} />
        <meshBasicMaterial
          ref={frontMatRef}
          map={texture}
          transparent
          opacity={1.0}
          toneMapped={false}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  )
})

