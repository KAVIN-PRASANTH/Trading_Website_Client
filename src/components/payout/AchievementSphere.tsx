import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FEEDBACK_IMAGE_URLS } from './feedbackImages'
import { AchievementCard3D } from './AchievementCard3D'

export interface SphereImpulse {
  vx: number
  vy: number
  continuousDir: 'up' | 'down' | 'left' | 'right' | null
}

interface AchievementSphereProps {
  sphereImpulse?: React.MutableRefObject<SphereImpulse>
  autoRotateSpeed?: number
  isAutoRotating?: boolean
}

interface CardLayout {
  id: string
  imageUrl: string
  position: [number, number, number]
  normal: [number, number, number]
  index: number
}

export const AchievementSphere: React.FC<AchievementSphereProps> = ({
  sphereImpulse,
  autoRotateSpeed = 0.0032,
  isAutoRotating = true,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const { gl, viewport } = useThree()

  const isMobile = viewport.width < 5.8
  const isTablet = viewport.width >= 5.8 && viewport.width < 9.5

  // 1. Sphere Radius
  // Calibrated for portrait phone screenshot cards
  const radius = useMemo(() => {
    if (isMobile) return 3.75
    if (isTablet) return 4.15
    return 4.8
  }, [isMobile, isTablet])

  // 2. Card Dimensions: Portrait aspect ratio (1 : 1.4)
  const cardWidth = useMemo(() => {
    if (isMobile) return Math.min(viewport.width * 0.42, 1.68)
    if (isTablet) return 1.78
    return 1.88
  }, [isMobile, isTablet, viewport.width])

  const cardHeight = useMemo(() => cardWidth * 1.4, [cardWidth])

  // 3. True 3D Sphere Geometry: 12 Real Student Feedback Images across 3 Latitude Tiers
  // - Top Tier (+22° latitude): 4 cards (45°, 135°, 225°, 315°)
  // - Middle Equator Tier (0° latitude): 4 cards (0°, 90°, 180°, 270°)
  // - Bottom Tier (-22° latitude): 4 cards (45°, 135°, 225°, 315°)
  const cardLayouts = useMemo<CardLayout[]>(() => {
    const images = FEEDBACK_IMAGE_URLS
    const layouts: CardLayout[] = []

    const tiers = [
      { phiDeg: 22, thetaOffsetDeg: 45, count: 4, startIndex: 0 },   // Top Ring
      { phiDeg: 0, thetaOffsetDeg: 0, count: 4, startIndex: 4 },     // Middle Equator
      { phiDeg: -22, thetaOffsetDeg: 45, count: 4, startIndex: 8 },  // Bottom Ring
    ]

    for (const tier of tiers) {
      const phi = (tier.phiDeg * Math.PI) / 180
      const cosPhi = Math.cos(phi)
      const sinPhi = Math.sin(phi)

      for (let j = 0; j < tier.count; j++) {
        const itemIdx = tier.startIndex + j
        const imgUrl = images[itemIdx % images.length]

        const thetaDeg = tier.thetaOffsetDeg + (j * 360) / tier.count
        const theta = (thetaDeg * Math.PI) / 180

        const x = radius * cosPhi * Math.sin(theta)
        const y = radius * sinPhi
        const z = radius * cosPhi * Math.cos(theta)

        const norm = new THREE.Vector3(x, y, z).normalize()

        layouts.push({
          id: `feedback-card-${itemIdx}`,
          imageUrl: imgUrl,
          position: [x, y, z],
          normal: [norm.x, norm.y, norm.z],
          index: itemIdx,
        })
      }
    }

    return layouts
  }, [radius])

  // 4. Multi-Directional 360° Physics State
  const isPointerDown = useRef(false)
  const isDragging = useRef(false)
  const pointerDownPos = useRef({ x: 0, y: 0 })
  const lastPointer = useRef({ x: 0, y: 0 })
  const currentRotationY = useRef(0)
  const currentRotationX = useRef(0)
  const targetRotationY = useRef(0)
  const targetRotationX = useRef(0)
  const velocityY = useRef(0)
  const velocityX = useRef(0)

  // 5. Seamless Pointer Event Listeners (Zero touch-freeze on tap)
  useEffect(() => {
    const dom = gl.domElement

    const handlePointerDown = (e: PointerEvent) => {
      if (!e.isPrimary) return
      isPointerDown.current = true
      isDragging.current = false
      pointerDownPos.current = { x: e.clientX, y: e.clientY }
      lastPointer.current = { x: e.clientX, y: e.clientY }
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current || !e.isPrimary) return

      const totalDist = Math.hypot(
        e.clientX - pointerDownPos.current.x,
        e.clientY - pointerDownPos.current.y
      )

      // Only engage drag if moved beyond threshold (> 5px)
      if (!isDragging.current) {
        if (totalDist > 5) {
          isDragging.current = true
          // Seamlessly synchronize target rotation with current rotation (ZERO freeze or hitch!)
          targetRotationY.current = currentRotationY.current
          targetRotationX.current = currentRotationX.current
          lastPointer.current = { x: e.clientX, y: e.clientY }
          velocityY.current = 0
          velocityX.current = 0
          try {
            dom.setPointerCapture(e.pointerId)
          } catch {}
        } else {
          return
        }
      }

      const dx = e.clientX - lastPointer.current.x
      const dy = e.clientY - lastPointer.current.y
      lastPointer.current = { x: e.clientX, y: e.clientY }

      // Direct 1:1 finger tracking sensitivity
      const speedScale = isMobile ? 0.0055 : 0.004

      // Horizontal 360° drag (spin left/right)
      targetRotationY.current -= dx * speedScale
      velocityY.current = -dx * 0.002

      // Vertical 360° drag (tilt top/bottom)
      // Clamped to ±1.42 rad (±81°) so bottom certificates rise fully to eye level
      targetRotationX.current = THREE.MathUtils.clamp(
        targetRotationX.current + dy * speedScale,
        -1.42,
        1.42
      )
      velocityX.current = dy * 0.002
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (!e.isPrimary) return
      isPointerDown.current = false
      isDragging.current = false
      try {
        dom.releasePointerCapture(e.pointerId)
      } catch {}
    }

    const handleWheel = (e: WheelEvent) => {
      velocityY.current += e.deltaY * 0.00015
    }

    dom.addEventListener('pointerdown', handlePointerDown)
    dom.addEventListener('pointermove', handlePointerMove)
    dom.addEventListener('pointerup', handlePointerUp)
    dom.addEventListener('pointercancel', handlePointerUp)
    dom.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown)
      dom.removeEventListener('pointermove', handlePointerMove)
      dom.removeEventListener('pointerup', handlePointerUp)
      dom.removeEventListener('pointercancel', handlePointerUp)
      dom.removeEventListener('wheel', handleWheel)
    }
  }, [gl.domElement, isMobile])

  // 6. Rock-Solid 60 FPS Animation, D-Pad & Inertia Loop
  useFrame((_, rawDelta) => {
    const group = groupRef.current
    if (!group) return

    const delta = Math.min(rawDelta, 0.05)
    const factor = delta * 60

    // Process D-Pad Directional Controls (from 4 directional buttons)
    if (sphereImpulse && sphereImpulse.current) {
      const imp = sphereImpulse.current

      if (imp.continuousDir === 'left') {
        targetRotationY.current -= 0.028 * factor
      } else if (imp.continuousDir === 'right') {
        targetRotationY.current += 0.028 * factor
      } else if (imp.continuousDir === 'up') {
        targetRotationX.current = THREE.MathUtils.clamp(
          targetRotationX.current + 0.022 * factor,
          -1.42,
          1.42
        )
      } else if (imp.continuousDir === 'down') {
        targetRotationX.current = THREE.MathUtils.clamp(
          targetRotationX.current - 0.022 * factor,
          -1.42,
          1.42
        )
      }

      if (Math.abs(imp.vy) > 0.0001) {
        velocityY.current += imp.vy
        imp.vy = 0
      }
      if (Math.abs(imp.vx) > 0.0001) {
        velocityX.current += imp.vx
        imp.vx = 0
      }
    }

    if (isDragging.current) {
      // While actively dragging: immediate responsive 1:1 finger tracking
      currentRotationY.current = THREE.MathUtils.lerp(
        currentRotationY.current,
        targetRotationY.current,
        0.35
      )
      currentRotationX.current = THREE.MathUtils.lerp(
        currentRotationX.current,
        targetRotationX.current,
        0.35
      )
    } else {
      // While released or cruising: smooth inertia decay
      velocityY.current *= 0.94
      velocityX.current *= 0.94

      // Continuous cruising horizontal rotation: Direct, consistent, zero hitch!
      const effectiveAutoRotateSpeed = isAutoRotating ? autoRotateSpeed : 0
      currentRotationY.current += (effectiveAutoRotateSpeed + velocityY.current) * factor
      targetRotationY.current = currentRotationY.current

      // Vertical tilt handling
      currentRotationX.current = THREE.MathUtils.clamp(
        currentRotationX.current + velocityX.current * factor,
        -1.42,
        1.42
      )
      targetRotationX.current = currentRotationX.current

      // When vertical inertia decays, gently ease vertical tilt back to eye-level (0)
      if (Math.abs(velocityX.current) < 0.0003 && !sphereImpulse?.current?.continuousDir) {
        currentRotationX.current = THREE.MathUtils.lerp(
          currentRotationX.current,
          0,
          0.02 * factor
        )
        targetRotationX.current = currentRotationX.current
      }
    }

    // Apply rotation to 3D sphere group
    group.rotation.y = currentRotationY.current
    group.rotation.x = currentRotationX.current
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 12 Real Student Feedback Cards Distributed in True 3D Spherical Space */}
      {cardLayouts.map((layout) => (
        <AchievementCard3D
          key={layout.id}
          imageUrl={layout.imageUrl}
          position={layout.position}
          normal={layout.normal}
          index={layout.index}
          sphereRadius={radius}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
        />
      ))}
    </group>
  )
}
