import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { StudentFeedback } from './feedbackData'
import { FeedbackCard } from './FeedbackCard'

export interface FeedbackDeckHandle {
  goNext: () => void
  goPrev: () => void
  goTo: (index: number) => void
  flipBack: () => void
}

interface FeedbackDeckProps {
  testimonials: StudentFeedback[]
  activeIndex: number
  onChangeIndex: (newIndex: number) => void
  reducedMotion?: boolean
  isCardFlipped?: boolean
  onToggleFlip?: () => void
  onInteractionStart?: () => void
  onInteractionEnd?: () => void
  onViewFullProof?: (imgSrc: string) => void
  onProofViewStateChange?: (isViewing: boolean) => void
}

/**
 * Calculates circular relative distance from activeIndex.
 * - 0 = active center card
 * - 1 = right peek card
 * - -1 = left peek card
 * - 2 = center-right background card (opposing tilt)
 * - -2 = exited card on the left (fades to 0)
 * - 3/-3 = hidden distant cards
 */
const getRelativeIndex = (index: number, active: number, count: number): number => {
  let diff = (index - active) % count
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count
  return diff
}

export const FeedbackDeck = forwardRef<FeedbackDeckHandle, FeedbackDeckProps>(
  function FeedbackDeck(
    {
      testimonials,
      activeIndex,
      onChangeIndex,
      reducedMotion = false,
      isCardFlipped: controlledFlipped,
      onToggleFlip: controlledToggleFlip,
      onInteractionStart,
      onInteractionEnd,
      onViewFullProof,
      onProofViewStateChange,
    },
    ref
  ) {
    const stackRef = useRef<HTMLDivElement>(null)
    const total = testimonials.length

    // Track 3D card flip for active card
    const [localFlipped, setLocalFlipped] = useState(false)
    const isCardFlipped = controlledFlipped !== undefined ? controlledFlipped : localFlipped

    const handleToggleFlip = useCallback(() => {
      if (controlledToggleFlip) {
        controlledToggleFlip()
      } else {
        setLocalFlipped(p => !p)
      }
    }, [controlledToggleFlip])

    const flipBack = useCallback(() => {
      if (controlledFlipped !== undefined) {
        if (controlledFlipped && controlledToggleFlip) controlledToggleFlip()
      } else {
        setLocalFlipped(false)
      }
    }, [controlledFlipped, controlledToggleFlip])

    // Reset local flip whenever active index changes
    useEffect(() => {
      setLocalFlipped(false)
    }, [activeIndex])

    // Notify parent section about proof-view state changes if locally controlled
    useEffect(() => {
      if (controlledFlipped === undefined) {
        onProofViewStateChange?.(isCardFlipped)
      }
    }, [isCardFlipped, controlledFlipped, onProofViewStateChange])

    // Responsive screen width detection
    const [windowWidth, setWindowWidth] = useState(() =>
      typeof window !== 'undefined' ? window.innerWidth : 1200
    )

    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth)
      }
      window.addEventListener('resize', handleResize, { passive: true })
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    const isSmallMobile = windowWidth < 420
    const isMobile = windowWidth < 680
    const isTablet = windowWidth >= 680 && windowWidth < 1024
    const isDesktop = windowWidth >= 1024 && windowWidth < 1320
    const isWideDesktop = windowWidth >= 1320
    const isWideScreen = windowWidth >= 1024

    // Responsive lateral peek spacing — Pulled out wide on desktop to fill empty left/right spaces
    const lateralOffsetX = isSmallMobile
      ? 30
      : isMobile
      ? 42
      : isTablet
      ? 110
      : isDesktop
      ? 210
      : 250

    const lateralRot = isSmallMobile ? 2.0 : isMobile ? 2.5 : 3.2
    const lateralScale = isSmallMobile ? 0.94 : isMobile ? 0.94 : 0.95

    // Gesture tracking state
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)

    const isTrackingRef = useRef(false)
    const isHorizontalGestureRef = useRef(false)
    const startCoordRef = useRef({ x: 0, y: 0, time: 0 })
    const lastSampleRef = useRef({ x: 0, time: 0 })
    const velocityRef = useRef(0)
    const pointerIdRef = useRef<number | null>(null)
    const lastActionTimeRef = useRef(0)
    const wheelLockRef = useRef(false)

    // Keep activeIndex accessible in callbacks
    const activeIndexRef = useRef(activeIndex)
    useEffect(() => {
      activeIndexRef.current = activeIndex
    }, [activeIndex])

    /* ---------------------------------------- Navigation Methods ---------------------------------------- */
    const goNext = useCallback(() => {
      if (total <= 1 || isCardFlipped) return
      const now = Date.now()
      if (now - lastActionTimeRef.current < 420) return
      lastActionTimeRef.current = now
      const next = (activeIndexRef.current + 1) % total
      activeIndexRef.current = next
      onChangeIndex(next)
    }, [total, onChangeIndex, isCardFlipped])

    const goPrev = useCallback(() => {
      if (total <= 1 || isCardFlipped) return
      const now = Date.now()
      if (now - lastActionTimeRef.current < 420) return
      lastActionTimeRef.current = now
      const prev = (activeIndexRef.current - 1 + total) % total
      activeIndexRef.current = prev
      onChangeIndex(prev)
    }, [total, onChangeIndex, isCardFlipped])

    const goTo = useCallback(
      (targetIndex: number) => {
        if (total <= 1 || targetIndex === activeIndexRef.current || isCardFlipped) return
        const now = Date.now()
        if (now - lastActionTimeRef.current < 420) return
        lastActionTimeRef.current = now
        const target = (targetIndex + total) % total
        activeIndexRef.current = target
        onChangeIndex(target)
      },
      [total, onChangeIndex, isCardFlipped]
    )

    useImperativeHandle(
      ref,
      () => ({
        goNext,
        goPrev,
        goTo,
        flipBack,
      }),
      [goNext, goPrev, goTo, flipBack]
    )

    /* ---------------------------------------- Fluid Gesture & Pointer Events ---------------------------------------- */
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      // Strictly prevent drag while viewing proof
      if (total <= 1 || e.button !== 0 || isCardFlipped) return
      pointerIdRef.current = e.pointerId
      startCoordRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
      lastSampleRef.current = { x: e.clientX, time: Date.now() }
      velocityRef.current = 0
      isHorizontalGestureRef.current = false
      isTrackingRef.current = true
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isTrackingRef.current || pointerIdRef.current !== e.pointerId || isCardFlipped) return

      const dx = e.clientX - startCoordRef.current.x
      const dy = e.clientY - startCoordRef.current.y
      const now = Date.now()

      const dt = now - lastSampleRef.current.time
      if (dt > 12) {
        velocityRef.current = (e.clientX - lastSampleRef.current.x) / dt
        lastSampleRef.current = { x: e.clientX, time: now }
      }

      if (!isHorizontalGestureRef.current) {
        const absX = Math.abs(dx)
        const absY = Math.abs(dy)

        // Ignore micro tremors / taps
        if (absX < 8 && absY < 8) return

        // Confirm horizontal intent vs vertical page scroll
        if (absX > absY * 1.15 && absX >= 8) {
          isHorizontalGestureRef.current = true
          setIsDragging(true)
          onInteractionStart?.()
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            // Ignore
          }
        } else {
          // User is scrolling the page vertically! Release tracking so natural page scroll continues effortlessly
          isTrackingRef.current = false
          return
        }
      }

      if (isHorizontalGestureRef.current) {
        setDragOffset({ x: dx, y: dy * 0.12 })
      }
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isTrackingRef.current && !isHorizontalGestureRef.current) return

      const wasHorizontal = isHorizontalGestureRef.current
      isTrackingRef.current = false
      isHorizontalGestureRef.current = false
      setIsDragging(false)
      pointerIdRef.current = null

      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId)
        }
      } catch {
        // Ignore
      }

      if (wasHorizontal) {
        onInteractionEnd?.()

        const dx = dragOffset.x
        const cardWidth = stackRef.current?.offsetWidth || 340
        const threshold = Math.min(cardWidth * 0.22, 70)
        const vx = velocityRef.current

        const isSwipeLeft = dx < -threshold || (vx < -0.32 && dx < -16)
        const isSwipeRight = dx > threshold || (vx > 0.32 && dx > 16)

        setDragOffset({ x: 0, y: 0 })

        if (isSwipeLeft) {
          goNext()
        } else if (isSwipeRight) {
          goPrev()
        }
      } else {
        setDragOffset({ x: 0, y: 0 })
      }
    }

    const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
      if (pointerIdRef.current === e.pointerId) {
        try {
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId)
          }
        } catch {
          // Ignore
        }
      }
      isTrackingRef.current = false
      isHorizontalGestureRef.current = false
      setIsDragging(false)
      pointerIdRef.current = null
      setDragOffset({ x: 0, y: 0 })
      onInteractionEnd?.()
    }

    /* ---------------------------------------- Wheel Support ---------------------------------------- */
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      // Strictly prevent wheel navigation while viewing proof
      if (wheelLockRef.current || total <= 1 || isCardFlipped) return

      if (Math.abs(e.deltaX) > 38 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        wheelLockRef.current = true
        onInteractionStart?.()
        if (e.deltaX > 0) {
          goNext()
        } else {
          goPrev()
        }
        setTimeout(() => {
          wheelLockRef.current = false
          onInteractionEnd?.()
        }, 450)
      }
    }

    return (
      <div
        className={`fdeck-stack ${isCardFlipped ? 'is-viewing-proof' : ''}`}
        ref={stackRef}
        onWheel={handleWheel}
        role="region"
        aria-roledescription="3d carousel"
        aria-label="Student Testimonials Card Stack"
      >
        {testimonials.map((item, index) => {
          let transform = ''
          let opacity = 0
          let zIndex = 1
          let layer: 'active' | 'next' | 'prev' | 'bg' | 'hidden' = 'hidden'
          let isVisible = false

          if (reducedMotion) {
            const isHero = index === activeIndex
            transform = 'translate3d(0, 0, 0)'
            opacity = isHero ? 1 : 0
            zIndex = isHero ? 12 : 1
            layer = isHero ? 'active' : 'hidden'
            isVisible = isHero
          } else {
            const diff = getRelativeIndex(index, activeIndex, total)

            if (diff === 0) {
              // ── Active Center Card ──
              layer = 'active'
              zIndex = 12
              opacity = 1
              isVisible = true

              if (isDragging) {
                const rot = dragOffset.x * 0.038
                const sc = Math.max(0.96, 1 - Math.abs(dragOffset.x) * 0.00025)
                transform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rot}deg) scale(${sc})`
              } else {
                transform = `translate3d(0px, 0px, 0px) rotate(0deg) scale(1.0)`
              }
            } else if (diff === 1) {
              // ── Right Peek Card (Next) ──
              layer = 'next'
              zIndex = 9
              isVisible = true

              if (isDragging && dragOffset.x < 0) {
                const dragFrac = Math.min(1, Math.abs(dragOffset.x) / 220)
                const tx = lateralOffsetX * (1 - dragFrac)
                const rot = lateralRot * (1 - dragFrac)
                const sc = lateralScale + (1 - lateralScale) * dragFrac
                opacity = 0.72 + 0.28 * dragFrac
                transform = `translate3d(${tx}px, ${8 * (1 - dragFrac)}px, 0px) rotate(${rot}deg) scale(${sc})`
              } else {
                opacity = 0.72
                transform = `translate3d(${lateralOffsetX}px, 8px, 0px) rotate(${lateralRot}deg) scale(${lateralScale})`
              }
            } else if (diff === -1) {
              // ── Left Peek Card (Prev) — Opposing Rotation ──
              layer = 'prev'
              zIndex = 8
              isVisible = true

              if (isDragging && dragOffset.x > 0) {
                const dragFrac = Math.min(1, dragOffset.x / 220)
                const tx = -lateralOffsetX * (1 - dragFrac)
                const rot = -lateralRot * (1 - dragFrac)
                const sc = lateralScale + (1 - lateralScale) * dragFrac
                opacity = 0.72 + 0.28 * dragFrac
                transform = `translate3d(${tx}px, ${8 * (1 - dragFrac)}px, 0px) rotate(${rot}deg) scale(${sc})`
              } else {
                opacity = 0.72
                transform = `translate3d(${-lateralOffsetX}px, 8px, 0px) rotate(${-lateralRot}deg) scale(${lateralScale})`
              }
            } else if (diff === 2) {
              // ── Outer Right Peek Card (2nd tier on desktop) ──
              layer = 'bg'
              zIndex = 6
              opacity = isWideScreen ? 0.36 : 0
              isVisible = isWideScreen
              const tx = lateralOffsetX * 1.55
              const rot = lateralRot * 1.5
              transform = `translate3d(${tx}px, 14px, 0px) rotate(${rot}deg) scale(0.88)`
            } else if (diff === -2) {
              // ── Outer Left Peek Card (2nd tier on desktop) ──
              layer = 'bg'
              zIndex = 6
              opacity = isWideScreen ? 0.36 : 0
              isVisible = isWideScreen
              const tx = -lateralOffsetX * 1.55
              const rot = -lateralRot * 1.5
              transform = `translate3d(${tx}px, 14px, 0px) rotate(${rot}deg) scale(0.88)`
            } else {
              // ── Distant Hidden Cards ──
              layer = 'hidden'
              zIndex = 1
              opacity = 0
              isVisible = false
              transform = `translate3d(0px, 28px, 0px) scale(0.8)`
            }
          }

          const isHero = layer === 'active'

          return (
            <FeedbackCard
              key={item.id}
              feedback={item}
              index={index}
              totalCount={total}
              layer={layer}
              style={{
                transform,
                opacity,
                zIndex,
                visibility: isVisible ? 'visible' : 'hidden',
                pointerEvents: layer === 'active' ? 'auto' : 'none',
              }}
              isDragging={isHero && isDragging}
              isFlipped={isHero && isCardFlipped}
              onToggleFlip={isHero ? handleToggleFlip : undefined}
              onViewFullProof={onViewFullProof}
              onPointerDown={isHero ? handlePointerDown : undefined}
              onPointerMove={isHero ? handlePointerMove : undefined}
              onPointerUp={isHero ? handlePointerUp : undefined}
              onPointerCancel={isHero ? handlePointerCancel : undefined}
            />
          )
        })}
      </div>
    )
  }
)
