import React, { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FEEDBACK_IMAGE_URLS } from './feedbackImages'
import { AchievementCard3D, CarouselMotion } from './AchievementCard3D'

export interface SphereImpulse {
  vx: number
  vy: number
  continuousDir: 'up' | 'down' | 'left' | 'right' | null
  step?: (dir: 1 | -1) => void
}

interface AchievementSphereProps {
  sphereImpulse?: React.MutableRefObject<SphereImpulse>
  autoRotateSpeed?: number
  isAutoRotating?: boolean
  onSelectCard?: (url: string) => void
}

export const AchievementSphere: React.FC<AchievementSphereProps> = ({
  sphereImpulse,
  autoRotateSpeed = 0.038,
  isAutoRotating = true,
  onSelectCard,
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const { gl, viewport } = useThree()

  const isMobile = viewport.width < 5.8
  const isTablet = viewport.width >= 5.8 && viewport.width < 9.5

  // 1. Proportional Card Dimensions
  const cardWidth = useMemo(() => {
    if (isMobile) return 1.15
    if (isTablet) return 1.32
    return 1.48
  }, [isMobile, isTablet])

  const cardHeight = useMemo(() => cardWidth * 1.4, [cardWidth])

  const totalCards = FEEDBACK_IMAGE_URLS.length

  // Elliptical track parameters
  const Rx = isMobile ? 2.3 : 3.85
  const Rz = isMobile ? 1.35 : 2.0
  const zOffset = isMobile ? -0.30 : -0.65

  // 2. High-Precision Motion State (Ref-based, zero React re-render overhead!)
  const motionRef = useRef<CarouselMotion>({ progress: 0, dragDistance: 0 })
  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const dragVelocity = useRef(0)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const lastMoveX = useRef(0)
  const recentMoves = useRef<{ x: number; t: number }[]>([])
  const resumeAutoRotateAt = useRef(0)
  const isAnyCardHovered = useRef(false)
  const pointerPos = useRef({ x: 0, y: 0 })

  // Expose step function to sphereImpulse for UI Prev / Next buttons
  useEffect(() => {
    if (sphereImpulse) {
      sphereImpulse.current.step = (dir: 1 | -1) => {
        targetProgress.current += dir * (1 / totalCards)
        resumeAutoRotateAt.current = performance.now() + 2500
      }
    }
  }, [sphereImpulse, totalCards])

  // 3. Smooth Touch & Pointer Navigation
  useEffect(() => {
    const dom = gl.domElement

    const handlePointerDown = (e: PointerEvent) => {
      isDragging.current = true
      dragStartX.current = e.clientX
      dragStartY.current = e.clientY
      lastMoveX.current = e.clientX
      motionRef.current.dragDistance = 0
      recentMoves.current = [{ x: e.clientX, t: performance.now() }]
      dragVelocity.current = 0
      try {
        dom.setPointerCapture(e.pointerId)
      } catch {
        // pointer capture fallback
      }
    }

    const handlePointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect()
      const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ndcY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      pointerPos.current = { x: ndcX, y: ndcY }

      if (isDragging.current) {
        const dx = e.clientX - lastMoveX.current
        lastMoveX.current = e.clientX

        const dist = Math.hypot(e.clientX - dragStartX.current, e.clientY - dragStartY.current)
        motionRef.current.dragDistance = dist

        // Highly responsive direct finger tracking (calibrated 1:1 feel)
        const deltaProgress = (dx / rect.width) * 0.85
        targetProgress.current -= deltaProgress

        const now = performance.now()
        recentMoves.current.push({ x: e.clientX, t: now })
        while (recentMoves.current.length > 1 && now - recentMoves.current[0].t > 120) {
          recentMoves.current.shift()
        }
      }
    }

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging.current) {
        isDragging.current = false
        try {
          dom.releasePointerCapture(e.pointerId)
        } catch {
          // pointer release fallback
        }
        const rect = dom.getBoundingClientRect()
        const now = performance.now()
        const oldest = recentMoves.current[0]
        if (oldest && now - oldest.t > 10) {
          const dt = Math.max(16, now - oldest.t)
          const dx = e.clientX - oldest.x
          const pxPerMs = dx / dt
          // Fluid swipe inertia flick with smooth momentum
          const flickVelocity = -(pxPerMs * 16 / rect.width) * 1.35
          dragVelocity.current = Math.max(-0.045, Math.min(0.045, flickVelocity))
        }
        // Pause auto-rotation for 2.8 seconds after user touch/swipe interaction
        resumeAutoRotateAt.current = now + 2800
      }
    }

    dom.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      dom.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [gl.domElement])

  // 4. Ultra-Smooth 60/120fps Frame Loop
  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const now = performance.now()

    // Smooth aerodynamic inertia decay
    if (!isDragging.current && Math.abs(dragVelocity.current) > 0.00004) {
      targetProgress.current += dragVelocity.current
      dragVelocity.current *= 0.94 // Silky momentum friction
    }

    // Directional control continuous hold (e.g. key hold or arrow touch)
    if (sphereImpulse?.current?.continuousDir === 'left') {
      targetProgress.current -= delta * 0.22
    } else if (sphereImpulse?.current?.continuousDir === 'right') {
      targetProgress.current += delta * 0.22
    }

    // Auto-rotation when user is not interacting, not dragging, and not hovered
    if (
      isAutoRotating &&
      !isDragging.current &&
      !isAnyCardHovered.current &&
      now > resumeAutoRotateAt.current
    ) {
      targetProgress.current += delta * autoRotateSpeed
    }

    // Responsiveness: high during drag for instant finger lock, smooth during gliding
    const lerpFactor = isDragging.current ? 0.38 : 0.12
    currentProgress.current = THREE.MathUtils.lerp(
      currentProgress.current,
      targetProgress.current,
      lerpFactor
    )

    motionRef.current.progress = currentProgress.current

    // Subtle cursor parallax on entire 3D stage
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerPos.current.x * 0.06, 0.05)
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointerPos.current.y * 0.04, 0.05)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {FEEDBACK_IMAGE_URLS.map((url, idx) => (
        <AchievementCard3D
          key={`proof-card-${idx}`}
          imageUrl={url}
          index={idx}
          totalCards={totalCards}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          Rx={Rx}
          Rz={Rz}
          zOffset={zOffset}
          isMobile={isMobile}
          motionRef={motionRef}
          onSelect={onSelectCard}
          onHoverChange={(hovered) => {
            isAnyCardHovered.current = hovered
          }}
        />
      ))}
    </group>
  )
}


