import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './studentVideos.css'

export interface StudentStory {
  id: string
  name: string
  role: string
  cohort: string
  videoSrc: string
  poster: string
}

const STUDENT_STORIES: StudentStory[] = [
  {
    id: 'story-shiny',
    name: 'Shiny',
    role: 'Student Story',
    cohort: 'Classroom Batch Alumni',
    videoSrc: '/feedback_vedios/DdHCh0bh9Uv.mp4',
    poster: '/feedback_vedios/thumb_DdHCh0bh9Uv.jpg',
  },
  {
    id: 'story-keshav',
    name: 'Keshav Kumar',
    role: 'Student Story',
    cohort: 'Chennai Batch Alumni',
    videoSrc: '/feedback_vedios/DdRLnAEtLiQ.mp4',
    poster: '/feedback_vedios/thumb_DdRLnAEtLiQ.jpg',
  },
  {
    id: 'story-siva',
    name: 'Siva Srinivasan',
    role: 'Student Story',
    cohort: 'Classroom Batch Alumni',
    videoSrc: '/feedback_vedios/DdHCh0bh9Uv.mp4',
    poster: '/feedback_vedios/thumb_DdHCh0bh9Uv.jpg',
  },
  {
    id: 'story-navin',
    name: 'Navin',
    role: 'Student Story',
    cohort: 'Chennai Batch Alumni',
    videoSrc: '/feedback_vedios/DdRLnAEtLiQ.mp4',
    poster: '/feedback_vedios/thumb_DdRLnAEtLiQ.jpg',
  },
  {
    id: 'story-raja',
    name: 'Raja',
    role: 'Student Story',
    cohort: 'Classroom Batch Alumni',
    videoSrc: '/feedback_vedios/DdHCh0bh9Uv.mp4',
    poster: '/feedback_vedios/thumb_DdHCh0bh9Uv.jpg',
  },
  {
    id: 'story-aadhil',
    name: 'Aadhil',
    role: 'Student Story',
    cohort: 'Chennai Batch Alumni',
    videoSrc: '/feedback_vedios/DdRLnAEtLiQ.mp4',
    poster: '/feedback_vedios/thumb_DdRLnAEtLiQ.jpg',
  },
]

export const StudentVideoSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeVideo, setActiveVideo] = useState<StudentStory | null>(null)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const isInteracting = useRef<boolean>(false)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchDeltaX = useRef<number>(0)
  const touchDeltaY = useRef<number>(0)
  const isHorizontalSwipe = useRef<boolean>(false)
  const touchStartTime = useRef<number>(0)
  const justSwiped = useRef<boolean>(false)

  const mouseStartX = useRef<number>(0)
  const isMouseDown = useRef<boolean>(false)
  const isMouseDragging = useRef<boolean>(false)

  const lastWheelTime = useRef<number>(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const modalVideoRef = useRef<HTMLVideoElement | null>(null)

  // Handlers for story cycling
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + STUDENT_STORIES.length) % STUDENT_STORIES.length)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % STUDENT_STORIES.length)
  }, [])

  // Auto-slide effect: automatically rotates every 5.5s unless hovered, swiping, or modal is open
  useEffect(() => {
    if (!isAutoRotate || isHovered || isDragging || activeVideo) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STUDENT_STORIES.length)
    }, 5500)

    return () => clearInterval(timer)
  }, [isAutoRotate, isHovered, isDragging, activeVideo])

  // --- TOUCH HANDLERS (Mobile hand slide swipe) ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return
    const t = e.touches[0]
    touchStartX.current = t.clientX
    touchStartY.current = t.clientY
    touchDeltaX.current = 0
    touchDeltaY.current = 0
    touchStartTime.current = Date.now()
    isHorizontalSwipe.current = false
    isInteracting.current = true
    justSwiped.current = false
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isInteracting.current || e.touches.length !== 1) return
    const t = e.touches[0]
    const dx = t.clientX - touchStartX.current
    const dy = t.clientY - touchStartY.current
    touchDeltaX.current = dx
    touchDeltaY.current = dy

    if (!isHorizontalSwipe.current) {
      const absX = Math.abs(dx)
      const absY = Math.abs(dy)
      // Check if user is gesturing horizontally (hand slide)
      if (absX > 10 && absX >= absY) {
        isHorizontalSwipe.current = true
        setIsDragging(true)
      } else if (absY > 20 && absY > absX * 1.5) {
        // Clear vertical scroll gesture - let browser scroll page
        isInteracting.current = false
        setIsDragging(false)
      }
    }
  }

  const handleTouchEnd = () => {
    if (!isInteracting.current && !isHorizontalSwipe.current) {
      setIsDragging(false)
      return
    }

    const wasHorizontal = isHorizontalSwipe.current
    const dx = touchDeltaX.current
    const elapsed = Date.now() - touchStartTime.current

    isInteracting.current = false
    isHorizontalSwipe.current = false
    setIsDragging(false)

    if (wasHorizontal) {
      const isQuickFlick = elapsed < 400 && Math.abs(dx) > 20
      const isLongSwipe = Math.abs(dx) > 30

      if (isQuickFlick || isLongSwipe) {
        justSwiped.current = true
        if (dx < 0) {
          handleNext()
        } else {
          handlePrev()
        }
        setTimeout(() => {
          justSwiped.current = false
        }, 250)
      }
    }
  }

  // --- MOUSE HANDLERS (Desktop hand dragging) ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('.sv-pagination-bar')) return

    isMouseDown.current = true
    isMouseDragging.current = false
    mouseStartX.current = e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) return
    const dx = e.clientX - mouseStartX.current
    if (Math.abs(dx) > 15) {
      isMouseDragging.current = true
      setIsDragging(true)
    }
  }

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) return
    const dx = e.clientX - mouseStartX.current
    isMouseDown.current = false
    setIsDragging(false)

    if (isMouseDragging.current && Math.abs(dx) > 35) {
      justSwiped.current = true
      if (dx < 0) {
        handleNext()
      } else {
        handlePrev()
      }
      setTimeout(() => {
        justSwiped.current = false
      }, 200)
    }
  }

  const handleMouseLeave = () => {
    isMouseDown.current = false
    setIsDragging(false)
    setIsHovered(false)
  }

  // Horizontal wheel / trackpad scroll support
  const handleWheel = (e: React.WheelEvent) => {
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : (e.shiftKey ? e.deltaY : 0)
    if (Math.abs(delta) > 25) {
      const now = Date.now()
      if (now - lastWheelTime.current > 400) {
        lastWheelTime.current = now
        if (delta > 0) {
          handleNext()
        } else {
          handlePrev()
        }
      }
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideo) {
        if (e.key === 'Escape') {
          setActiveVideo(null)
        }
        return
      }

      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

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
  }, [activeVideo, handlePrev, handleNext])

  // Instant hardware-accelerated video playback on modal open (prevents desktop audio/video lag)
  useEffect(() => {
    if (activeVideo && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0
      const p = modalVideoRef.current.play()
      if (p !== undefined) {
        p.catch(() => {
          // Playback gracefully ready for user control
        })
      }
    }
  }, [activeVideo])

  // Prevent background touch scroll during modal playback WITHOUT touching body overflow (avoids mobile scroll jump)
  useEffect(() => {
    if (!activeVideo) return

    const handleTouchMove = (e: TouchEvent) => {
      if (!(e.target as HTMLElement)?.closest('.sv-modal-shell')) {
        e.preventDefault()
      }
    }

    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => window.removeEventListener('touchmove', handleTouchMove)
  }, [activeVideo])

  const handleOpenVideo = (item: StudentStory) => {
    setActiveVideo(item)
  }

  const handleCloseVideo = () => {
    setActiveVideo(null)
  }

  // Calculate relative orbital slot for an item
  const getSlot = (index: number): number => {
    const total = STUDENT_STORIES.length
    return (index - activeIndex + total) % total
  }

  return (
    <section
      className="student-videos-section"
      id="student-videos"
      data-section="student-videos"
    >
      <div className="sv-container">
        {/* Section Header */}
        <div className="sv-header reveal-el">
          <div className="sv-tag">
            <span className="sv-tag-dot" />
            <span>03 / STUDENT STORIES</span>
          </div>
          <h2>
            Hear directly from<br />
            <em>the traders who learned with us.</em>
          </h2>
          <p className="sv-lead">
            Real voices. Real journeys. Uncut authentic video feedback recorded by traders in the Pravyn ICT community.
          </p>
        </div>

        {/* ═══════════════════════════════════════════════════════
            STUDENT STORY ORBIT — Hand Slide (Drag / Swipe) + Auto Slide
            (Navigation arrows removed for pure intuitive gesture control)
            ═══════════════════════════════════════════════════════ */}
        <div
          ref={stageRef}
          className={`sv-orbit-viewport ${isHovered ? 'is-interacting' : ''} ${isDragging ? 'is-dragging' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          role="region"
          aria-label="Student Stories Video Orbit - Hand slide or auto rotate"
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="sv-orbit-backdrop-glow" aria-hidden="true" />

          {/* 3D Spatial Video Stage */}
          <div className="sv-orbit-scene" role="region" aria-roledescription="3d carousel">
            {STUDENT_STORIES.map((item, index) => {
              const slot = getSlot(index)
              const isActive = slot === 0

              return (
                <div
                  key={item.id}
                  className={`sv-orbit-card slot-${slot} ${isActive ? 'is-active' : 'is-surrounding'}`}
                  onClick={() => {
                    if (justSwiped.current) return
                    if (!isActive) {
                      setActiveIndex(index)
                    } else {
                      handleOpenVideo(item)
                    }
                  }}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (!isActive) {
                        setActiveIndex(index)
                      } else {
                        handleOpenVideo(item)
                      }
                    }
                  }}
                  aria-label={
                    isActive
                      ? `Watch video story of ${item.name}`
                      : `Select reel story of ${item.name}`
                  }
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <div className="sv-card-inner">
                    {/* Media Surface */}
                    <div className="sv-video-frame-wrap">
                      <img
                        className="sv-video-preview sv-preview-img"
                        src={item.poster}
                        alt={item.name}
                        loading="eager"
                        draggable={false}
                      />
                      <div className="sv-card-scrim" />

                      {/* Single Center Play Button on Active Card */}
                      {isActive && (
                        <div
                          className="sv-card-play-action"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (justSwiped.current) return
                            handleOpenVideo(item)
                          }}
                          role="button"
                          tabIndex={-1}
                        >
                          <button
                            type="button"
                            className="sv-hero-play-pulse-btn"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (justSwiped.current) return
                              handleOpenVideo(item)
                            }}
                            aria-label={`Play story of ${item.name}`}
                          >
                            <span className="sv-hero-play-ring" />
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                              <polygon points="6 3 20 12 6 21 6 3" />
                            </svg>
                          </button>
                          <span className="sv-hero-play-hint">Watch Story</span>
                        </div>
                      )}
                    </div>

                    {/* Student Identity: Minimal, clean, name only */}
                    <div className="sv-card-caption">
                      <span className="sv-caption-name">{item.name}</span>
                      {isActive && (
                        <span className="sv-caption-live-badge">
                          <span className="sv-caption-live-dot" />
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Orbit Pagination Indicators */}
        <div className="sv-pagination-bar">
          {STUDENT_STORIES.map((item, idx) => (
            <button
              key={`dot-${item.id}`}
              type="button"
              className={`sv-dot ${idx === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}: ${item.name}`}
            />
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CINEMATIC THEATER MODAL VIDEO PLAYER (ZOOMED VIEW)
          (Mounted to document.body via React Portal)
          ═══════════════════════════════════════════════════════ */}
      {activeVideo &&
        createPortal(
          <div
            className="sv-modal-backdrop"
            onClick={handleCloseVideo}
            role="dialog"
            aria-modal="true"
            aria-label={`Video story of ${activeVideo.name}`}
          >
            <div className="sv-modal-shell sv-modal-reel" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header with prominent Back button */}
              <div className="sv-modal-head">
                <button
                  type="button"
                  className="sv-modal-back-btn"
                  onClick={handleCloseVideo}
                  aria-label="Back to stories"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back</span>
                </button>

                <div className="sv-modal-title-wrap">
                  <span className="sv-modal-badge-pill">
                    <span>●</span> VERIFIED STUDENT STORY
                  </span>
                  <h4 className="sv-modal-student-name">
                    {activeVideo.name}
                  </h4>
                </div>

                <button
                  type="button"
                  className="sv-modal-close-btn"
                  onClick={handleCloseVideo}
                  aria-label="Close video player"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Player Shell: Smooth Hardware-Accelerated Playback */}
              <div className="sv-modal-player-wrap sv-player-reel">
                <video
                  ref={modalVideoRef}
                  key={`modal-video-${activeVideo.id}`}
                  src={activeVideo.videoSrc}
                  poster={activeVideo.poster}
                  controls
                  autoPlay
                  playsInline
                  loop
                  preload="auto"
                  className="sv-modal-video-element"
                />
              </div>

              {/* Modal Footer with Back Button */}
              <div className="sv-modal-foot">
                <div className="sv-modal-foot-left">
                  <span>Pravyn ICT Community</span>
                </div>
                <button
                  type="button"
                  className="sv-modal-foot-back-btn"
                  onClick={handleCloseVideo}
                  aria-label="Back to stories"
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Stories</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
