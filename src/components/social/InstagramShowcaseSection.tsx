import React, { useState, useEffect, useRef } from 'react'
import './instagramShowcase.css'

interface MainReelItem {
  id: string
  videoSrc: string
  poster: string
  title: string
  caption: string
  audio: string
  likes: string
  comments: string
}

const MAIN_REELS: MainReelItem[] = [
  {
    id: 'reel-1',
    videoSrc: '/mentor/praveen_reel_1.mp4',
    poster: '/mentor/thumb_praveen_1.jpg',
    title: 'Live Mentorship Breakdown',
    caption: 'Real-time market structure & liquidity sweeps with @pravyn_ict. Practical trading context 🔥',
    audio: 'Pravyn ICT · Original Audio',
    likes: '4.8K',
    comments: '312',
  },
  {
    id: 'reel-2',
    videoSrc: '/mentor/praveen_reel_2.mp4',
    poster: '/mentor/thumb_praveen_2.jpg',
    title: 'Community Q&A & Discipline',
    caption: 'Student questions, risk control rules, and live killzone execution. No hindsight.',
    audio: 'Pravyn ICT · Market Breakdown',
    likes: '3.9K',
    comments: '228',
  },
  {
    id: 'reel-3',
    videoSrc: '/student_videos/keshav.mp4',
    poster: '/student_videos/thumb_keshav.jpg',
    title: 'London Open Slingshot',
    caption: 'London Open XAUUSD Slingshot Model Execution & Live Liquidity Purge 🔥',
    audio: 'Pravyn ICT · Community Win',
    likes: '2.9K',
    comments: '165',
  },
  {
    id: 'reel-4',
    videoSrc: '/student_videos/raja.mp4',
    poster: '/student_videos/thumb_raja.jpg',
    title: 'Funded Trader Consistency',
    caption: 'Discipline, risk control, and funded prop firm consistency with live mentor classes.',
    audio: 'Pravyn ICT · Original Audio',
    likes: '3.2K',
    comments: '184',
  },
]

export function InstagramShowcaseSection() {
  const [currentReelIndex, setCurrentReelIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [likesState, setLikesState] = useState<{ [key: string]: boolean }>({})
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Auto-scroll to next reel every 7 seconds unless hovered
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentReelIndex(prev => (prev + 1) % MAIN_REELS.length)
    }, 7000)

    return () => clearInterval(timer)
  }, [isPaused])

  // Play active video and pause others
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return
      if (idx === currentReelIndex) {
        vid.currentTime = 0
        vid.play().catch(() => {})
      } else {
        vid.pause()
      }
    })
  }, [currentReelIndex])

  const handleNextReel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentReelIndex(prev => (prev + 1) % MAIN_REELS.length)
  }

  const handlePrevReel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setCurrentReelIndex(prev => (prev - 1 + MAIN_REELS.length) % MAIN_REELS.length)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    videoRefs.current.forEach(vid => {
      if (vid) vid.muted = nextMuted
    })
  }

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLikesState(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <section className="ig-env-section" id="instagram" data-section="instagram">
      <div className="ig-ambient-depth" aria-hidden="true" />

      <div className="ig-stage-container">
        {/* ══════════════════════════════════════════════════════════════
           ZONE 1: LEFT EDITORIAL SAFE ZONE (Strictly 28–32% of Stage)
           ══════════════════════════════════════════════════════════════ */}
        <div className="ig-zone-left reveal-el">
          <div className="ig-eyebrow-badge">
            <span className="ig-live-pulse-dot" />
            <span>COMMUNITY / INSTAGRAM</span>
          </div>

          <h2 className="ig-hero-headline">
            Daily trades.<br />
            <em>On Instagram.</em>
          </h2>

          <p className="ig-hero-desc">
            Follow <strong className="ig-author-highlight">@pravyn_ict</strong> for real-time London &amp; New York session breakdowns, live trade execution context, and verified community milestones.
          </p>

          {/* Clean Inline Stats (No boxed container) */}
          <div className="ig-inline-stats">
            <div className="ig-inline-stat">
              <span className="ig-stat-val">1,000+</span>
              <span className="ig-stat-lbl">Active Traders</span>
            </div>
            <span className="ig-stat-dot" aria-hidden="true">·</span>
            <div className="ig-inline-stat">
              <span className="ig-stat-val">Daily</span>
              <span className="ig-stat-lbl">Market Bias</span>
            </div>
            <span className="ig-stat-dot" aria-hidden="true">·</span>
            <div className="ig-inline-stat">
              <span className="ig-stat-val">100%</span>
              <span className="ig-stat-lbl">Live Proofs</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="ig-hero-actions">
            <a
              href="https://www.instagram.com/pravyn_ict/"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-btn-follow"
              id="ig-btn-follow"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Follow @pravyn_ict</span>
              <span className="ig-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
           ZONE 2: MEDIA CLUSTER (SAFE BUFFER FROM TEXT, FULL-WIDTH USE)
           ══════════════════════════════════════════════════════════════ */}
        <div className="ig-media-cluster reveal-el">
          {/* Supporting Media 1: Left Bridge Card (Between Text & Hero Reel) */}
          <a
            href="https://www.instagram.com/pravyn_ict/"
            target="_blank"
            rel="noopener noreferrer"
            className="ig-supp-card supp-left-bridge"
            aria-label="Instagram Setup Reel: Live Market Analysis"
          >
            <div className="ig-supp-media-wrap">
              <img
                src="/mentor/IMG_8017.PNG"
                alt="Praveen ICT Live Market Analysis"
                className="ig-supp-img"
              />
              <div className="ig-supp-gradient" />
              <div className="ig-supp-meta">
                <span className="ig-supp-tag">MARKET ANALYSIS</span>
                <p className="ig-supp-title">London session liquidity sweeps</p>
                <div className="ig-supp-likes">♥ 4.8K · Pravyn ICT</div>
              </div>
            </div>
          </a>

          {/* MAIN HERO REEL PHONE (Scaled ~8% down for perfect balance) */}
          <div
            className="ig-hero-phone-wrap"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            aria-label="Instagram Hero Reel Player"
          >
            <div className="ig-phone-bezel">
              {/* Dynamic Island Notch */}
              <div className="ig-dynamic-island" />

              {/* Segmented Story Progress Bars */}
              <div className="ig-story-segments">
                {MAIN_REELS.map((_, idx) => (
                  <div
                    key={idx}
                    className="ig-segment-track"
                    onClick={() => setCurrentReelIndex(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Jump to reel ${idx + 1}`}
                  >
                    <div
                      className={`ig-segment-progress ${
                        idx === currentReelIndex
                          ? 'is-active'
                          : idx < currentReelIndex
                          ? 'is-done'
                          : ''
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Top Bar inside Phone Screen */}
              <div className="ig-phone-header">
                <a
                  href="https://www.instagram.com/pravyn_ict/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ig-phone-brand-link"
                >
                  <span className="ig-brand-text">Reels</span>
                  <span className="ig-red-live-dot" />
                </a>

                <button
                  type="button"
                  className="ig-mute-toggle-btn"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? '🔇' : '🔊'}
                </button>
              </div>

              {/* Auto-Scroll Reels Feed Viewport */}
              <div className="ig-phone-viewport">
                <div
                  className="ig-reels-stack"
                  style={{ transform: `translateY(-${currentReelIndex * 100}%)` }}
                >
                  {MAIN_REELS.map((reel, idx) => {
                    const isLiked = !!likesState[reel.id]
                    return (
                      <div key={reel.id} className="ig-reel-item-slide">
                        <video
                          ref={el => {
                            videoRefs.current[idx] = el
                          }}
                          className="ig-reel-video-element"
                          src={reel.videoSrc}
                          poster={reel.poster}
                          loop
                          muted={isMuted}
                          playsInline
                          preload="metadata"
                        />

                        <div className="ig-reel-gradient-shade" />

                        {/* Floating Social Actions Rail */}
                        <div className="ig-reel-social-rail">
                          <button
                            type="button"
                            className={`ig-social-btn ${isLiked ? 'liked' : ''}`}
                            onClick={e => toggleLike(reel.id, e)}
                            aria-label="Like reel"
                          >
                            <span className="ig-social-glyph">{isLiked ? '❤️' : '🤍'}</span>
                            <span className="ig-social-count">{isLiked ? '2.5K' : reel.likes}</span>
                          </button>

                          <a
                            href="https://www.instagram.com/pravyn_ict/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ig-social-btn"
                            aria-label="Comments"
                          >
                            <span className="ig-social-glyph">💬</span>
                            <span className="ig-social-count">{reel.comments}</span>
                          </a>

                          <a
                            href="https://www.instagram.com/direct/t/pravyn_ict/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ig-social-btn"
                            aria-label="Share"
                          >
                            <span className="ig-social-glyph">✈️</span>
                          </a>
                        </div>

                        {/* Bottom Info: Creator, Caption & Waveform */}
                        <div className="ig-reel-info-layer">
                          <a
                            href="https://www.instagram.com/pravyn_ict/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ig-creator-badge"
                          >
                            <div className="ig-creator-ring">
                              <img
                                src="/mentor/IMG_6107.PNG"
                                alt="Pravyn ICT"
                                className="ig-creator-avatar"
                              />
                            </div>
                            <span className="ig-creator-handle">pravyn_ict</span>
                            <span className="ig-verified-tick" title="Verified Creator">✓</span>
                          </a>

                          <p className="ig-reel-caption-text">{reel.caption}</p>

                          <div className="ig-audio-track-chip">
                            <span className="ig-audio-waveform">
                              <span className="wave-bar wb-1" />
                              <span className="wave-bar wb-2" />
                              <span className="wave-bar wb-3" />
                            </span>
                            <span className="ig-audio-label">{reel.audio}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Discreet Navigation Controls */}
              <div className="ig-reel-nav-steppers">
                <button
                  type="button"
                  className="ig-stepper-btn"
                  onClick={handlePrevReel}
                  aria-label="Previous reel"
                  title="Previous"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="ig-stepper-btn"
                  onClick={handleNextReel}
                  aria-label="Next reel"
                  title="Next"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          {/* Right Supporting Media Column (Staggered Vertical Separation) */}
          <div className="ig-zone-right">
            {/* Supporting Media 2: Top Mentor Award Card */}
            <a
              href="https://www.instagram.com/pravyn_ict/"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-supp-card supp-top-chart"
              aria-label="Instagram Post: Mentorship Excellence FinFluenZe Awards"
            >
              <div className="ig-supp-media-wrap">
                <img
                  src="/mentor/IMG_6107.PNG"
                  alt="Praveen ICT FinFluenZe Awards Recognition"
                  className="ig-supp-img"
                />
                <div className="ig-supp-gradient" />
                <div className="ig-supp-meta">
                  <span className="ig-supp-tag">FINFLUENZE AWARDS</span>
                  <p className="ig-supp-title">Mentorship Excellence 2026</p>
                  <div className="ig-supp-likes">♥ 5.2K · Pravyn ICT</div>
                </div>
              </div>
            </a>

            {/* Supporting Media 3: Bottom Mentor Recognition Card */}
            <a
              href="https://www.instagram.com/pravyn_ict/"
              target="_blank"
              rel="noopener noreferrer"
              className="ig-supp-card supp-bottom-payout"
              aria-label="Instagram Post: FinFluenZe Awards VIP Recognition"
            >
              <div className="ig-supp-media-wrap">
                <img
                  src="/mentor/IMG_6127.PNG"
                  alt="Praveen ICT FinFluenZe Awards VIP Recognition"
                  className="ig-supp-img"
                />
                <div className="ig-supp-gradient" />
                <div className="ig-supp-meta">
                  <span className="ig-supp-tag">VIP MENTOR</span>
                  <p className="ig-supp-title">FinFluenZe Awards 2026</p>
                  <div className="ig-supp-likes">♥ 3.9K · Pravyn ICT</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
