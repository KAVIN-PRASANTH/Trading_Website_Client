import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './studentVideos.css'

export interface StudentStory {
  id: string
  name: string
  role: string
  cohort: string
  videoSrc: string
  poster: string
  quote?: string
}

const STUDENT_STORIES: StudentStory[] = [
  {
    id: 'story-shiny',
    name: 'Shiny',
    role: 'Student Story',
    cohort: 'Classroom Batch Alumni',
    videoSrc: '/student_videos/shiny.mp4',
    poster: '/student_videos/thumb_shiny.jpg',
    quote: 'From structure basics to disciplined execution in live markets.',
  },
  {
    id: 'story-keshav',
    name: 'Keshav Kumar',
    role: 'Student Story',
    cohort: 'Chennai Batch Alumni',
    videoSrc: '/student_videos/keshav.mp4',
    poster: '/student_videos/thumb_keshav.jpg',
    quote: 'Mastering liquidity draw and precision price action frameworks.',
  },
  {
    id: 'story-siva',
    name: 'Siva Srinivasan',
    role: 'Student Story',
    cohort: 'Classroom Batch Alumni',
    videoSrc: '/student_videos/siva.mp4',
    poster: '/student_videos/thumb_siva.jpg',
    quote: 'Eliminated guesswork. Focus on daily bias and precise entry criteria.',
  },
  {
    id: 'story-navin',
    name: 'Navin',
    role: 'Student Story',
    cohort: 'Chennai Batch Alumni',
    videoSrc: '/student_videos/navin.mp4',
    poster: '/student_videos/thumb_navin.jpg',
    quote: 'The psychology shift and trade journaling transformed my consistency.',
  },
  {
    id: 'story-raja',
    name: 'Raja',
    role: 'Student Story',
    cohort: 'Classroom Batch Alumni',
    videoSrc: '/student_videos/raja.mp4',
    poster: '/student_videos/thumb_raja.jpg',
    quote: 'Clear execution models without reliance on false indicators or signals.',
  },
]

export const StudentVideoSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [activeVideo, setActiveVideo] = useState<StudentStory | null>(null)
  const [isInView, setIsInView] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)

  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const modalVideoRef = useRef<HTMLVideoElement | null>(null)
  const cardsContainerRef = useRef<HTMLDivElement | null>(null)

  // IntersectionObserver: Only autoplay when in viewport
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.2)
        }
      },
      { threshold: [0, 0.2, 0.5] }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Auto-advance cards when idle
  useEffect(() => {
    if (isHovered || activeVideo || !isInView) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STUDENT_STORIES.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [isHovered, activeVideo, isInView])

  // Play active video automatically when active & in view
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isInView) {
      video.muted = true
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isInView, activeIndex])

  const handleSelectCard = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  }

  const handleOpenTheater = (item: StudentStory) => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    setActiveVideo(item)
  }

  const handleCloseTheater = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause()
      modalVideoRef.current.removeAttribute('src')
      modalVideoRef.current.load()
    }
    setActiveVideo(null)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeVideo) {
        if (e.key === 'Escape') handleCloseTheater()
        return
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setActiveIndex((prev) => (prev - 1 + STUDENT_STORIES.length) % STUDENT_STORIES.length)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        setActiveIndex((prev) => (prev + 1) % STUDENT_STORIES.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeVideo])

  return (
    <section
      ref={sectionRef}
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
            EXPANDING CARDS GALLERY (Clean, Minimal & Smooth)
            ═══════════════════════════════════════════════════════ */}
        <div
          ref={cardsContainerRef}
          className="expanding-cards-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="region"
          aria-label="Student video feedback expanding cards"
        >
          {STUDENT_STORIES.map((story, index) => {
            const isActive = index === activeIndex

            return (
              <div
                key={story.id}
                className={`expanding-card ${isActive ? 'is-active' : 'is-collapsed'}`}
                onClick={() => {
                  if (!isActive) {
                    handleSelectCard(index)
                  } else {
                    handleOpenTheater(story)
                  }
                }}
                onMouseEnter={() => handleSelectCard(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    if (!isActive) {
                      handleSelectCard(index)
                    } else {
                      handleOpenTheater(story)
                    }
                  }
                }}
                aria-label={`Student story of ${story.name}`}
                aria-expanded={isActive}
              >
                {/* Background Poster (always mounted for continuous visual transition) */}
                <img
                  src={story.poster}
                  alt={story.name}
                  className="card-background-poster"
                  loading={index <= 2 ? 'eager' : 'lazy'}
                />

                {/* Active In-Card Video (Plays automatically when card is active) */}
                {isActive && (
                  <div className="card-video-wrapper">
                    <video
                      ref={videoRef}
                      key={`active-video-${story.id}`}
                      src={story.videoSrc}
                      poster={story.poster}
                      autoPlay
                      playsInline
                      loop
                      muted
                      className="card-inline-video"
                    />
                  </div>
                )}

                {/* Cinematic Dark Gradient Scrim */}
                <div className="card-gradient-overlay" />

                {/* Collapsed State Play Cue (Subtle Icon, No Text) */}
                <div className="card-collapsed-cue" aria-hidden="true">
                  <div className="collapsed-play-pill">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          IMMERSIVE FULL-SCREEN THEATER VIEWER
          ═══════════════════════════════════════════════════════ */}
      {activeVideo &&
        createPortal(
          <div
            className="sv-fullscreen-overlay"
            onClick={handleCloseTheater}
            role="dialog"
            aria-modal="true"
            aria-label={`Video story of ${activeVideo.name}`}
          >
            <button
              type="button"
              className="sv-fullscreen-close-btn"
              onClick={(e) => {
                e.stopPropagation()
                handleCloseTheater()
              }}
              aria-label="Close video"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="sv-fullscreen-video-container" onClick={(e) => e.stopPropagation()}>
              <video
                ref={modalVideoRef}
                key={`modal-video-${activeVideo.id}`}
                src={activeVideo.videoSrc}
                poster={activeVideo.poster}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="sv-fullscreen-video"
              />
              <div className="sv-fullscreen-caption">
                <h4 className="sv-caption-name">{activeVideo.name}</h4>
                {activeVideo.quote && <p className="sv-caption-quote">"{activeVideo.quote}"</p>}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}
