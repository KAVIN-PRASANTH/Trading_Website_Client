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
  const selectedProofRef = useRef<ProofScreenshotItem | null>(null)
  selectedProofRef.current = selectedProof

  // Set-based hover tracking for rock-solid element-level pause
  const hoveredCardsSetRef = useRef<Set<string>>(new Set())
  const isHoveredRef = useRef(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef(true)

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

  // Element-level hover handlers: ONLY pause when cursor is over a card
  const handleCardEnter = useCallback((cardKey: string, e: React.MouseEvent | React.PointerEvent) => {
    if ('pointerType' in e && e.pointerType === 'touch') return // Touch taps do not trigger hover pause
    hoveredCardsSetRef.current.add(cardKey)
    isHoveredRef.current = true
  }, [])

  const handleCardLeave = useCallback((cardKey: string, e: React.MouseEvent | React.PointerEvent) => {
    if ('pointerType' in e && e.pointerType === 'touch') return
    hoveredCardsSetRef.current.delete(cardKey)
    if (hoveredCardsSetRef.current.size === 0) {
      isHoveredRef.current = false
    }
  }, [])

  // Continuous Right-to-Left conveyor loop
  const offsetRef = useRef(0)
  const lastTimeRef = useRef<number>(performance.now())

  useEffect(() => {
    if (reducedMotion) return

    let animId: number
    lastTimeRef.current = performance.now()

    // Speed: comfortable reading pace (Desktop: ~45px/s, Mobile: ~32px/s)
    const speed = isMobile ? 32 : 46

    const tick = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      const track = trackRef.current
      if (track) {
        // Measure single set width for seamless wrap
        const singleSetWidth = track.scrollWidth / 2

        if (singleSetWidth > 0) {
          // Advance offset only when active and not hovered/lightbox open
          if (!isHoveredRef.current && selectedProofRef.current === null && isVisibleRef.current) {
            offsetRef.current += speed * dt
          }

          // Wrap seamlessly when first set finishes
          const currentOffset = offsetRef.current % singleSetWidth

          // Apply GPU-accelerated horizontal transform (Right-to-Left: negative X)
          track.style.transform = `translate3d(${-currentOffset.toFixed(2)}px, 0, 0)`
        }
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [isMobile, reducedMotion])

  const handleSelectProof = useCallback((item: ProofScreenshotItem) => {
    setSelectedProof(item)
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setSelectedProof(null)
  }, [])

  return (
    <div
      ref={viewportRef}
      className="proof-marquee-wrapper"
      role="region"
      aria-label="Student Proof Horizontal Infinite Marquee"
    >
      {/* Viewport with smooth edge gradient fade */}
      <div className="proof-marquee-viewport">
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
                onMouseEnter={(e) => handleCardEnter(cardKey, e)}
                onMouseLeave={(e) => handleCardLeave(cardKey, e)}
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
