import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { ProofScreenshotItem, PROOF_SCREENSHOTS_CATALOG } from './proofTypes'
import { ProofPiece } from './ProofPiece'
import { ProofLightbox } from './ProofLightbox'

export const LivingProofMosaic: React.FC = () => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  const [reducedMotion, setReducedMotion] = useState(false)
  const [selectedProof, setSelectedProof] = useState<ProofScreenshotItem | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectedProofRef = useRef<ProofScreenshotItem | null>(null)
  selectedProofRef.current = selectedProof

  // Set-based hover tracking for rock-solid mouse-only pause
  const hoveredCardsSetRef = useRef<Set<string>>(new Set())
  const isHoveredRef = useRef(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(true)

  // Hand swipe / drag tracking refs
  const isPointerDownRef = useRef(false)
  const isDraggingRef = useRef(false)
  const hasDraggedRef = useRef(false)
  const suppressClickRef = useRef(false)
  const directionLockedRef = useRef<'horizontal' | 'vertical' | null>(null)

  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const lastXRef = useRef(0)
  const lastTimeRef = useRef(0)
  const velocityRef = useRef(0) // Momentum velocity in px/s
  const idleResumeTimeRef = useRef(0) // Timestamp when auto-slide can resume

  // Duplicated catalog for seamless infinite conveyor loop (Set A + Set B)
  const marqueeItems = useMemo(
    () => [...PROOF_SCREENSHOTS_CATALOG, ...PROOF_SCREENSHOTS_CATALOG],
    []
  )

  // Responsive breakpoint listener
  useEffect(() => {
    const handleResize = () => {
      const mob = window.innerWidth < 768
      setIsMobile(mob)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // prefers-reduced-motion listener
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])

  // IntersectionObserver to pause marquee when scrolled out of view
  useEffect(() => {
    if (!viewportRef.current || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          isVisibleRef.current = entries[0].isIntersecting
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(viewportRef.current)
    return () => observer.disconnect()
  }, [])

  // Mouse-only hover handlers (ignores touch/pen to prevent mobile hover stickiness)
  const handleCardEnter = useCallback((cardKey: string, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (isDraggingRef.current) return
    hoveredCardsSetRef.current.add(cardKey)
    isHoveredRef.current = true
  }, [])

  const handleCardLeave = useCallback((cardKey: string, e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    hoveredCardsSetRef.current.delete(cardKey)
    if (hoveredCardsSetRef.current.size === 0) {
      isHoveredRef.current = false
    }
  }, [])

  const handleViewportPointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      hoveredCardsSetRef.current.clear()
      isHoveredRef.current = false
    }
  }, [])

  // Continuous Right-to-Left conveyor loop + Momentum Physics & Idle Auto-Slide
  const offsetRef = useRef(0)
  const lastFrameTimeRef = useRef<number>(performance.now())

  useEffect(() => {
    let animId: number
    lastFrameTimeRef.current = performance.now()

    // Speed: comfortable reading pace (Desktop: ~46px/s, Mobile: ~34px/s)
    const baseSpeed = isMobile ? 34 : 46

    const tick = (now: number) => {
      const dt = Math.min((now - lastFrameTimeRef.current) / 1000, 0.1)
      lastFrameTimeRef.current = now

      const track = trackRef.current
      if (track) {
        // Single set width for seamless wrap
        const singleSetWidth = track.scrollWidth / 2

        if (singleSetWidth > 0) {
          if (isDraggingRef.current) {
            // User is actively sliding with hand:
            // Position is updated in real time via pointermove; keep idle timer pushed back
            idleResumeTimeRef.current = now + 1200
          } else {
            // User is NOT dragging
            // 1. Coast with flick momentum if velocity remains
            if (Math.abs(velocityRef.current) > 2) {
              offsetRef.current += velocityRef.current * dt
              // Natural exponential friction deceleration
              velocityRef.current *= Math.pow(0.91, dt * 60)
              idleResumeTimeRef.current = now + 1000
            } else {
              velocityRef.current = 0

              // 2. Auto-slide when idle and conditions met
              const canAutoSlide =
                !isHoveredRef.current &&
                selectedProofRef.current === null &&
                isVisibleRef.current &&
                !reducedMotion &&
                now >= idleResumeTimeRef.current

              if (canAutoSlide) {
                offsetRef.current += baseSpeed * dt
              }
            }

            // Wrap seamlessly in both directions
            let currentOffset = offsetRef.current % singleSetWidth
            if (currentOffset < 0) currentOffset += singleSetWidth
            offsetRef.current = currentOffset

            // Apply GPU-accelerated horizontal transform (Right-to-Left: negative X)
            track.style.transform = `translate3d(${-currentOffset.toFixed(2)}px, 0, 0)`
          }
        }
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [isMobile, reducedMotion])

  // --- Hand Slide / Touch Drag Pointer Events ---
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button (left click or touch)
    if (e.button !== 0) return

    isPointerDownRef.current = true
    isDraggingRef.current = false
    hasDraggedRef.current = false
    directionLockedRef.current = null
    velocityRef.current = 0 // Immediately stop any active flick glide on touch

    startXRef.current = e.clientX
    startYRef.current = e.clientY
    lastXRef.current = e.clientX
    lastTimeRef.current = performance.now()
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return

    const currentX = e.clientX
    const currentY = e.clientY
    const totalDx = currentX - startXRef.current
    const totalDy = currentY - startYRef.current

    // Detect gesture direction if not locked yet
    if (directionLockedRef.current === null) {
      const dist = Math.hypot(totalDx, totalDy)
      if (dist > 7) {
        if (Math.abs(totalDy) > Math.abs(totalDx) * 1.15) {
          // Predominantly vertical -> let native browser scroll the page
          directionLockedRef.current = 'vertical'
          isPointerDownRef.current = false
          return
        } else {
          // Predominantly horizontal -> lock to hand slide carousel
          directionLockedRef.current = 'horizontal'
          isDraggingRef.current = true
          hasDraggedRef.current = true
          suppressClickRef.current = true
          setIsDragging(true)

          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch (_) {}
        }
      }
    }

    if (directionLockedRef.current === 'horizontal') {
      const now = performance.now()
      const dt = Math.max((now - lastTimeRef.current) / 1000, 0.001)
      const dx = currentX - lastXRef.current

      // Moving hand left (dx < 0) advances track forward (increases offset)
      // Moving hand right (dx > 0) rewinds track backward (decreases offset)
      offsetRef.current -= dx

      // Instantaneous velocity calculation with exponential moving average
      const instantVelocity = -dx / dt
      velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65

      const track = trackRef.current
      if (track) {
        const singleSetWidth = track.scrollWidth / 2
        if (singleSetWidth > 0) {
          let currentOffset = offsetRef.current % singleSetWidth
          if (currentOffset < 0) currentOffset += singleSetWidth
          offsetRef.current = currentOffset
          track.style.transform = `translate3d(${-currentOffset.toFixed(2)}px, 0, 0)`
        }
      }

      lastXRef.current = currentX
      lastTimeRef.current = now
    }
  }, [])

  const finishDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current && !isDraggingRef.current) return

    if (isDraggingRef.current) {
      const timeSinceLastMove = performance.now() - lastTimeRef.current

      if (timeSinceLastMove > 90) {
        // Finger paused stationary before release -> no momentum flick
        velocityRef.current = 0
      } else {
        // Cap maximum momentum flick velocity for natural feel
        const maxV = 2200
        velocityRef.current = Math.max(-maxV, Math.min(maxV, velocityRef.current))
      }

      // Suppress any accidental click/lightbox triggers from the drag release
      suppressClickRef.current = true
      setTimeout(() => {
        suppressClickRef.current = false
      }, 200)

      // Auto-slide resumes 1.2s after idle
      idleResumeTimeRef.current = performance.now() + 1200
    }

    isPointerDownRef.current = false
    isDraggingRef.current = false
    directionLockedRef.current = null
    setIsDragging(false)

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch (_) {}
  }, [])

  // Two-finger trackpad / horizontal wheel support
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      offsetRef.current += e.deltaX
      velocityRef.current = 0
      idleResumeTimeRef.current = performance.now() + 1200
    }
  }, [])

  const handleSelectProof = useCallback((item: ProofScreenshotItem) => {
    if (suppressClickRef.current) return
    setSelectedProof(item)
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setSelectedProof(null)
    // Give user a moment after closing before auto-slide resumes
    idleResumeTimeRef.current = performance.now() + 1000
  }, [])

  return (
    <div
      ref={viewportRef}
      className="proof-marquee-wrapper"
      role="region"
      aria-label="Student Proof Horizontal Infinite Marquee"
    >
      {/* Viewport with smooth edge gradient fade & Hand-slide drag surface */}
      <div
        className={`proof-marquee-viewport${isDragging ? ' is-dragging' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onPointerLeave={handleViewportPointerLeave}
        onWheel={handleWheel}
        onClickCapture={(e) => {
          if (suppressClickRef.current) {
            e.stopPropagation()
            e.preventDefault()
          }
        }}
      >
        {/* Continuous Horizontal Track */}
        <div ref={trackRef} className="proof-marquee-track">
          {marqueeItems.map((item, idx) => {
            const cardKey = `${item.id}-marquee-${idx}`
            return (
              <ProofPiece
                key={cardKey}
                item={item}
                onSelect={handleSelectProof}
                onPointerEnter={(e) => handleCardEnter(cardKey, e)}
                onPointerLeave={(e) => handleCardLeave(cardKey, e)}
              />
            )
          })}
        </div>
      </div>

      {/* Fullscreen High-Resolution Lightbox Modal */}
      <ProofLightbox
        item={selectedProof}
        catalog={PROOF_SCREENSHOTS_CATALOG}
        onClose={handleCloseLightbox}
        onSelect={setSelectedProof}
      />
    </div>
  )
}
