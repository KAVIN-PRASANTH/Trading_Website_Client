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

    /* ─────────────────────────────────────────────────────────────────
       STABLE REF — keeps latest callbacks reachable inside native
       touch listeners without stale closures or re-adding listeners
    ───────────────────────────────────────────────────────────────── */
    const touchCbRef = useRef({
      goNext,
      goPrev,
      onInteractionStart,
      onInteractionEnd,
      isCardFlipped,
      total,
      setDragOffset,
      setIsDragging,
      stackRef,
      lastActionTimeRef,
    })
    // Sync every render
    touchCbRef.current = {
      goNext, goPrev, onInteractionStart, onInteractionEnd,
      isCardFlipped, total, setDragOffset, setIsDragging,
      stackRef, lastActionTimeRef,
    }

    /* ─────────────────────────────────────────────────────────────────
       NATIVE TOUCH HANDLER (mobile-only)
       ─ touchmove is registered with { passive: false } so we can call
         e.preventDefault() to stop page scroll ONLY when the gesture
         is confirmed horizontal.
       ─ Vertical swipes fall through and let the browser scroll normally.
    ───────────────────────────────────────────────────────────────── */
    useEffect(() => {
      const el = stackRef.current
      if (!el) return

      // Per-gesture state (closure vars, not React state)
      let tracking = false
      let horizontal = false
      let startX = 0, startY = 0
      let lastX = 0, lastTime = 0
      let velocity = 0
      let currentDx = 0

      const onTouchStart = (e: TouchEvent) => {
        const cb = touchCbRef.current
        if (e.touches.length !== 1 || cb.isCardFlipped || cb.total <= 1) return
        const t = e.touches[0]
        startX = lastX = t.clientX
        startY = t.clientY
        lastTime = Date.now()
        velocity = 0
        currentDx = 0
        tracking = true
        horizontal = false
      }

      const onTouchMove = (e: TouchEvent) => {
        if (!tracking || e.touches.length !== 1) return
        const cb = touchCbRef.current
        const t = e.touches[0]
        const dx = t.clientX - startX
        const dy = t.clientY - startY
        const now = Date.now()

        // Velocity sampling
        const dt = now - lastTime
        if (dt > 8) {
          velocity = (t.clientX - lastX) / dt
          lastX = t.clientX
          lastTime = now
        }
        currentDx = dx

        if (!horizontal) {
          const absX = Math.abs(dx)
          const absY = Math.abs(dy)
          if (absX < 5 && absY < 5) return  // dead zone — ignore micro tremors

          if (absX >= absY * 1.05) {
            // ✅ Horizontal intent confirmed — take control
            horizontal = true
            e.preventDefault()           // ← stops page scroll for this gesture
            cb.setDragOffset({ x: dx, y: 0 })
            cb.setIsDragging(true)
            cb.onInteractionStart?.()
          } else {
            // ✅ Vertical intent — release entirely, browser scrolls the page
            tracking = false
            return
          }
        }

        if (horizontal) {
          e.preventDefault()             // ← keep blocking scroll during drag
          cb.setDragOffset({ x: dx, y: 0 })
        }
      }

      const onTouchEnd = () => {
        if (!tracking) return
        const cb = touchCbRef.current
        const wasHorizontal = horizontal
        tracking = false
        horizontal = false
        cb.setIsDragging(false)

        if (wasHorizontal) {
          cb.onInteractionEnd?.()
          const cardWidth = cb.stackRef.current?.offsetWidth || 320
          const threshold = Math.min(cardWidth * 0.18, 55)
          const isSwipeLeft  = currentDx < -threshold || (velocity < -0.25 && currentDx < -12)
          const isSwipeRight = currentDx >  threshold || (velocity >  0.25 && currentDx >  12)
          cb.setDragOffset({ x: 0, y: 0 })
          if (isSwipeLeft)       cb.goNext()
          else if (isSwipeRight) cb.goPrev()
        } else {
          cb.setDragOffset({ x: 0, y: 0 })
        }
      }

      const onTouchCancel = () => {
        const cb = touchCbRef.current
        tracking = false
        horizontal = false
        cb.setIsDragging(false)
        cb.setDragOffset({ x: 0, y: 0 })
        cb.onInteractionEnd?.()
      }

      // touchstart: passive=true (don't block browser's initial scroll decision)
      // touchmove:  passive=false (MUST be able to call preventDefault)
      el.addEventListener('touchstart',  onTouchStart,  { passive: true })
      el.addEventListener('touchmove',   onTouchMove,   { passive: false })
      el.addEventListener('touchend',    onTouchEnd,    { passive: true })
      el.addEventListener('touchcancel', onTouchCancel, { passive: true })

      return () => {
        el.removeEventListener('touchstart',  onTouchStart)
        el.removeEventListener('touchmove',   onTouchMove)
        el.removeEventListener('touchend',    onTouchEnd)
        el.removeEventListener('touchcancel', onTouchCancel)
      }
    }, []) // runs once on mount — reads latest values via touchCbRef.current

    /* ─────────────────────────────────────────────────────────────────
       MOUSE POINTER EVENTS (desktop drag — touch is handled above)
    ───────────────────────────────────────────────────────────────── */
    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return   // touch handled by native listeners
      if (total <= 1 || isCardFlipped || e.button !== 0) return
      pointerIdRef.current = e.pointerId
      startCoordRef.current = { x: e.clientX, y: e.clientY, time: Date.now() }
      lastSampleRef.current = { x: e.clientX, time: Date.now() }
      velocityRef.current = 0
      isHorizontalGestureRef.current = false
      isTrackingRef.current = true
    }

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return
      if (!isTrackingRef.current || pointerIdRef.current !== e.pointerId || isCardFlipped) return

      const dx = e.clientX - startCoordRef.current.x
      const dy = e.clientY - startCoordRef.current.y
      const now = Date.now()
      const dt = now - lastSampleRef.current.time
      if (dt > 8) {
        velocityRef.current = (e.clientX - lastSampleRef.current.x) / dt
        lastSampleRef.current = { x: e.clientX, time: now }
      }

      if (!isHorizontalGestureRef.current) {
        const absX = Math.abs(dx), absY = Math.abs(dy)
        if (absX < 5 && absY < 5) return
        if (absX >= absY * 1.05) {
          isHorizontalGestureRef.current = true
          setIsDragging(true)
          onInteractionStart?.()
          try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ok */ }
        } else {
          isTrackingRef.current = false
          return
        }
      }
      if (isHorizontalGestureRef.current) setDragOffset({ x: dx, y: dy * 0.06 })
    }

    const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return
      if (!isTrackingRef.current && !isHorizontalGestureRef.current) return

      const wasHorizontal = isHorizontalGestureRef.current
      isTrackingRef.current = false
      isHorizontalGestureRef.current = false
      setIsDragging(false)
      pointerIdRef.current = null
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId)
      } catch { /* ok */ }

      if (wasHorizontal) {
        onInteractionEnd?.()
        const dx = dragOffset.x
        const cardWidth = stackRef.current?.offsetWidth || 320
        const threshold = Math.min(cardWidth * 0.2, 60)
        const vx = velocityRef.current
        setDragOffset({ x: 0, y: 0 })
        if (dx < -threshold || (vx < -0.28 && dx < -12))      goNext()
        else if (dx > threshold || (vx > 0.28 && dx > 12))    goPrev()
      } else {
        setDragOffset({ x: 0, y: 0 })
      }
    }

    const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return
      isTrackingRef.current = false
      isHorizontalGestureRef.current = false
      setIsDragging(false)
      pointerIdRef.current = null
      setDragOffset({ x: 0, y: 0 })
      onInteractionEnd?.()
    }

    /* ─────────────────────────────────────────────────────────────────
       TRACKPAD / WHEEL (horizontal scroll → slide)
    ───────────────────────────────────────────────────────────────── */
    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (wheelLockRef.current || total <= 1 || isCardFlipped) return
      if (Math.abs(e.deltaX) > 38 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        wheelLockRef.current = true
        onInteractionStart?.()
        e.deltaX > 0 ? goNext() : goPrev()
        setTimeout(() => { wheelLockRef.current = false; onInteractionEnd?.() }, 450)
      }
    }

    return (
      <div
        className={`fdeck-stack ${isCardFlipped ? 'is-viewing-proof' : ''} ${isDragging ? 'is-dragging' : ''}`}
        ref={stackRef}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
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
            />
          )
        })}
      </div>
    )
  }
)
