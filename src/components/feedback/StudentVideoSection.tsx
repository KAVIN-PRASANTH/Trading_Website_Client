import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import './studentVideos.css'

export interface StudentStory {
  id: string
  name: string
  role: string
  cohort: string
  gdriveId: string
  poster: string
}

const STUDENT_STORIES: StudentStory[] = [
  {
    id: 'story-siva',
    name: 'Siva Srinivasan',
    role: 'Student Story',
    cohort: 'Live Batch Cohort Alumni',
    gdriveId: '1LvlNp9z6sveaO4JkxvKvYU84ejwW_XkZ',
    poster: '/feedback_vedios/thumb_8186.jpg',
  },
  {
    id: 'story-keshav',
    name: 'Keshav Kumar',
    role: 'Student Story',
    cohort: 'Live Batch Cohort Alumni',
    gdriveId: '182dP8AVnLxAPqUvxUbajfuNQeVdL11RM',
    poster: '/feedback_vedios/thumb_8199.jpg',
  },
  {
    id: 'story-shiny',
    name: 'Shiny',
    role: 'Student Story',
    cohort: 'Live Batch Cohort Alumni',
    gdriveId: '1LvlNp9z6sveaO4JkxvKvYU84ejwW_XkZ',
    poster: '/feedback_vedios/thumb_8186.jpg',
  },
  {
    id: 'story-navin',
    name: 'Navin',
    role: 'Student Story',
    cohort: 'Live Batch Cohort Alumni',
    gdriveId: '182dP8AVnLxAPqUvxUbajfuNQeVdL11RM',
    poster: '/feedback_vedios/thumb_8199.jpg',
  },
  {
    id: 'story-raja',
    name: 'Raja',
    role: 'Student Story',
    cohort: 'Live Batch Cohort Alumni',
    gdriveId: '1LvlNp9z6sveaO4JkxvKvYU84ejwW_XkZ',
    poster: '/feedback_vedios/thumb_8186.jpg',
  },
  {
    id: 'story-aadhil',
    name: 'Aadhil',
    role: 'Student Story',
    cohort: 'Live Batch Cohort Alumni',
    gdriveId: '182dP8AVnLxAPqUvxUbajfuNQeVdL11RM',
    poster: '/feedback_vedios/thumb_8199.jpg',
  },
]

export const StudentVideoSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeVideo, setActiveVideo] = useState<StudentStory | null>(null)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const dragStartX = useRef<number>(0)
  const dragDeltaX = useRef<number>(0)
  const didDrag = useRef<boolean>(false)
  const lastWheelTime = useRef<number>(0)
  const stageRef = useRef<HTMLDivElement | null>(null)

  // Handlers for story cycling
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + STUDENT_STORIES.length) % STUDENT_STORIES.length)
  }, [])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % STUDENT_STORIES.length)
  }, [])

  // Auto-slide effect: automatically pauses on hover, dragging, or when modal is open
  useEffect(() => {
    if (!isAutoRotate || isHovered || isDragging || activeVideo) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STUDENT_STORIES.length)
    }, 6500)

    return () => clearInterval(timer)
  }, [isAutoRotate, isHovered, isDragging, activeVideo])

  // Drag / Swipe pointer handlers for manual sliding (Mouse + Touch via Pointer Events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragDeltaX.current = 0
    didDrag.current = false
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // fallback
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const diff = e.clientX - dragStartX.current
    dragDeltaX.current = diff
    if (Math.abs(diff) > 8) {
      didDrag.current = true
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId)
      }
    } catch {
      // fallback
    }
    const diff = dragDeltaX.current
    if (diff < -30) {
      handleNext()
    } else if (diff > 30) {
      handlePrev()
    }
    setTimeout(() => {
      didDrag.current = false
      dragDeltaX.current = 0
    }, 80)
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

  // Body scroll lock and navbar hide during modal playback
  useEffect(() => {
    if (!activeVideo) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('sv-modal-active')

    return () => {
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('sv-modal-active')
    }
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
            STUDENT STORY ORBIT — 3D Vertical Reel Theater Stage
            ═══════════════════════════════════════════════════════ */}
        <div
          ref={stageRef}
          className={`sv-orbit-viewport ${isHovered ? 'is-interacting' : ''} ${isDragging ? 'is-dragging' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          role="region"
          aria-label="Student Stories Video Orbit - Drag or click to slide"
          tabIndex={0}
        >
          {/* Subtle Ambient Radial Lighting */}
          <div className="sv-orbit-backdrop-glow" aria-hidden="true" />

          {/* Desktop Navigation Floating Arrows */}
          <button
            type="button"
            className="sv-nav-arrow sv-nav-prev"
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            aria-label="Previous reel story"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className="sv-nav-arrow sv-nav-next"
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            aria-label="Next reel story"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

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
                    if (didDrag.current) return
                    if (!isActive) {
                      setActiveIndex(index)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (!isActive) {
                        setActiveIndex(index)
                      }
                    }
                  }}
                  aria-label={
                    isActive
                      ? `Active reel story of ${item.name}`
                      : `Select reel story of ${item.name}`
                  }
                  aria-current={isActive ? 'true' : 'false'}
                >
                  <div className="sv-card-inner">
                    {/* Media Surface */}
                    <div className="sv-video-frame-wrap">
                      {isActive ? (
                        /* Active card embeds Google Drive player filling cleanly */
                        <iframe
                          key={`gdrive-player-${item.id}`}
                          src={`https://drive.google.com/file/d/${item.gdriveId}/preview`}
                          className="sv-video-preview sv-gdrive-frame"
                          allow="autoplay; encrypted-media; fullscreen"
                          title={`Student feedback reel by ${item.name}`}
                        />
                      ) : (
                        /* Surrounding 3D cards render clean vertical poster */
                        <img
                          className="sv-video-preview sv-preview-img"
                          src={item.poster}
                          alt={item.name}
                          loading="eager"
                        />
                      )}
                      {!isActive && <div className="sv-card-scrim" />}
                    </div>

                    {/* Student Identity: Minimal, clean, name only */}
                    <div className="sv-card-caption">
                      <span className="sv-caption-name">{item.name}</span>
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
          CINEMATIC THEATER MODAL VIDEO PLAYER
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
              {/* Modal Header */}
              <div className="sv-modal-head">
                <div className="sv-modal-title-wrap">
                  <span className="sv-modal-badge-pill">
                    <span>●</span> VERIFIED STUDENT REEL
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

              {/* Player Shell */}
              <div className="sv-modal-player-wrap sv-player-reel">
                <iframe
                  src={`https://drive.google.com/file/d/${activeVideo.gdriveId}/preview`}
                  className="sv-modal-gdrive-iframe"
                  allow="autoplay; encrypted-media; fullscreen"
                  title={activeVideo.name}
                />
              </div>

              {/* Modal Footer */}
              <div className="sv-modal-foot">
                <div className="sv-modal-foot-left">
                  <span>Authentic student reel</span>
                  <span>•</span>
                  <span>Pravyn ICT Community</span>
                </div>
                <a
                  href={`https://drive.google.com/file/d/${activeVideo.gdriveId}/view`}
                  target="_blank"
                  rel="noreferrer"
                  className="sv-modal-foot-cta"
                >
                  <span>Open in Drive</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
