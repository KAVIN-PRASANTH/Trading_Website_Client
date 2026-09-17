import React, { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { StudentFeedback, STUDENT_FEEDBACK_DATA } from './feedbackData'
import { FeedbackDeck, FeedbackDeckHandle } from './FeedbackDeck'
import { FeedbackControls } from './FeedbackControls'
import './feedback.css'

interface StudentFeedbackSectionProps {
  testimonials?: StudentFeedback[]
}

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '15px', height: '15px', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
)

export const StudentFeedbackSection: React.FC<StudentFeedbackSectionProps> = ({
  testimonials = STUDENT_FEEDBACK_DATA,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isInteracting, setIsInteracting] = useState(false)
  const [inView, setInView] = useState(true)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [isCardFlipped, setIsCardFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const total = testimonials.length

  const deckRef = useRef<FeedbackDeckHandle>(null)
  const lastManualInteraction = useRef(0)

  // Track combined proof-view state (flipped card or fullscreen modal)
  const isViewingProof = isCardFlipped || lightboxImg !== null

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])

  // Lock body scroll and register capture-phase Escape listener when full-view proof is open
  useEffect(() => {
    if (!lightboxImg) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        setLightboxImg(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [lightboxImg])

  // Viewport intersection observer to avoid running autoslide when out of screen
  useEffect(() => {
    const section = document.getElementById('student-stories') || document.getElementById('testimonials')
    if (!section) return

    // Immediately check if already visible on mount
    const rect = section.getBoundingClientRect()
    const currentlyInView = rect.top < window.innerHeight && rect.bottom > 0
    setInView(currentlyInView)

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      {
        threshold: 0.05,
        rootMargin: '120px 0px 120px 0px',
      }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Pause autoslide if tab/document is not visible
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setInView(false)
      } else {
        const section = document.getElementById('student-stories') || document.getElementById('testimonials')
        if (section) {
          const rect = section.getBoundingClientRect()
          setInView(rect.top < window.innerHeight && rect.bottom > 0)
        }
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  // Smooth Auto-Slide — 1.5s interval, pauses on hold/drag, resumes 1s after interaction
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches
    const hoverPaused = isHovered && !isTouch
    if (!isAutoPlay || reducedMotion || isInteracting || hoverPaused || !inView || total <= 1 || isViewingProof) {
      return
    }

    const timer = setInterval(() => {
      // Brief 1s cooldown after manual interaction
      if (Date.now() - lastManualInteraction.current < 1000) return
      deckRef.current?.goNext()
    }, 1800)

    return () => clearInterval(timer)
  }, [isAutoPlay, reducedMotion, isInteracting, isHovered, inView, total, isViewingProof])



  const registerManualInteraction = useCallback(() => {
    lastManualInteraction.current = Date.now()
  }, [])

  const handleToggleFlip = useCallback(() => {
    registerManualInteraction()
    setIsCardFlipped(p => !p)
  }, [registerManualInteraction])

  const handlePrev = useCallback(() => {
    if (isViewingProof) return
    registerManualInteraction()
    if (total <= 1) return
    deckRef.current?.goPrev()
  }, [total, registerManualInteraction, isViewingProof])

  const handleNext = useCallback(() => {
    if (isViewingProof) return
    registerManualInteraction()
    if (total <= 1) return
    deckRef.current?.goNext()
  }, [total, registerManualInteraction, isViewingProof])

  const handleSelectIndex = useCallback((index: number) => {
    if (isViewingProof) return
    registerManualInteraction()
    deckRef.current?.goTo(index)
  }, [registerManualInteraction, isViewingProof])

  const handleToggleAutoPlay = useCallback(() => {
    setIsAutoPlay(p => !p)
  }, [])

  // Keyboard navigation support (ArrowLeft / ArrowRight) & Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return
      }

      const section = document.getElementById('student-stories') || document.getElementById('testimonials')
      if (section) {
        const rect = section.getBoundingClientRect()
        const inViewport = rect.top < window.innerHeight && rect.bottom > 0
        if (!inViewport) return
      }

      // Handle Escape key: Close lightbox or flip card back to front
      if (e.key === 'Escape') {
        if (lightboxImg) {
          e.preventDefault()
          setLightboxImg(null)
          return
        } else if (isCardFlipped) {
          e.preventDefault()
          deckRef.current?.flipBack()
          return
        }
      }

      // If user is currently inspecting proof, disable arrow key card navigation
      if (isViewingProof) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePrev, handleNext, lightboxImg, isCardFlipped, isViewingProof])

  return (
    <section
      className="fdeck-section"
      id="student-stories"
      data-section="student-stories"
      aria-label="Student Stories and Real Results"
    >
      {/* Anchor fallback for existing testimonials links */}
      <div id="testimonials" aria-hidden="true" style={{ position: 'absolute', top: 0, pointerEvents: 'none' }} />

      {/* Ambient background accents */}
      <div className="fdeck-bg-radial" aria-hidden="true" />
      <div className="fdeck-bg-grid" aria-hidden="true" />

      {/* Section Header */}
      <div className="fdeck-header">
        <div className="fdeck-tag">
          <span className="fdeck-pulse-dot" />
          <span>{String(total).padStart(2, '0')} / STUDENT STORIES</span>
        </div>

        <h2 className="fdeck-title">
          Real Traders.<br />
          <em>Real Transformations.</em>
        </h2>

        <p className="fdeck-sub">
          Explore genuine, unedited student messages, discipline shifts, and verified milestones from our live institutional mentorship.
        </p>

        {/* Authentic proof badge */}
        <div className="fdeck-proof-strip">
          <span className="fdeck-pulse-dot" style={{ background: '#34D399', boxShadow: '0 0 8px #34D399' }} />
          <span className="fdeck-proof-label">100% Authentic Proof Screenshots</span>
        </div>
      </div>

      {/* Interactive 3D Card Deck Stage */}
      <div
        className="fdeck-stage"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FeedbackDeck
          ref={deckRef}
          testimonials={testimonials}
          activeIndex={activeIndex}
          onChangeIndex={(idx) => {
            setIsCardFlipped(false)
            setActiveIndex(idx)
          }}
          reducedMotion={reducedMotion}
          isCardFlipped={isCardFlipped}
          onToggleFlip={handleToggleFlip}
          onViewFullProof={setLightboxImg}
          onProofViewStateChange={setIsCardFlipped}
          onInteractionStart={() => {
            setIsInteracting(true)
            registerManualInteraction()
          }}
          onInteractionEnd={() => {
            setIsInteracting(false)
            registerManualInteraction()
          }}
        />

        <FeedbackControls
          activeIndex={activeIndex}
          totalCount={total}
          isAutoPlay={isAutoPlay}
          onToggleAutoPlay={handleToggleAutoPlay}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelectIndex={handleSelectIndex}
        />
      </div>

      {/* Call To Action */}
      <div className="fdeck-cta-wrap">
        <a className="button button-primary glow-heavy" href="#programmes">
          Join the next batch <ArrowRightIcon />
        </a>
      </div>

      {/* High-Resolution Proof Lightbox Modal Portal (rendered to body to escape parent stacking context) */}
      {lightboxImg &&
        createPortal(
          <div
            className="fdeck-lightbox-overlay"
            onClick={() => setLightboxImg(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Full-screen proof screenshot viewer"
          >
            {/* Viewport-fixed prominent corner exit button */}
            <button
              type="button"
              className="fdeck-lightbox-fixed-close"
              onClick={() => setLightboxImg(null)}
              aria-label="Back to reviews (Esc)"
              title="Close and return to reviews (Esc)"
            >
              <span className="fdeck-lightbox-close-icon">✕</span>
              <span className="fdeck-lightbox-close-text">BACK TO REVIEWS</span>
            </button>

            <div
              className="fdeck-lightbox-container"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="fdeck-lightbox-topbar">
                <button
                  type="button"
                  className="fdeck-lightbox-back-btn"
                  onClick={() => setLightboxImg(null)}
                  aria-label="Back to reviews"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>BACK</span>
                </button>

                <span className="fdeck-lightbox-title">ORIGINAL SCREENSHOT PROOF</span>

                <button
                  type="button"
                  className="fdeck-lightbox-close-btn"
                  onClick={() => setLightboxImg(null)}
                  aria-label="Close proof viewer"
                  title="Close (Esc)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Screenshot Body */}
              <div className="fdeck-lightbox-body">
                <img
                  src={lightboxImg}
                  alt="Original student feedback proof screenshot"
                  className="fdeck-lightbox-img"
                />
              </div>

              {/* Modal Footer with quick exit */}
              <div className="fdeck-lightbox-footer">
                <button
                  type="button"
                  className="fdeck-lightbox-footer-btn"
                  onClick={() => setLightboxImg(null)}
                  aria-label="Back to reviews"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  <span>BACK TO REVIEWS</span>
                </button>
                <span className="fdeck-lightbox-hint">Click outside or press Esc to exit</span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
