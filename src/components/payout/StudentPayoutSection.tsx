import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { StudentPayoutScene } from './StudentPayoutScene'
import { SphereImpulse } from './AchievementSphere'
import { FEEDBACK_IMAGE_URLS } from './feedbackImages'
import { NumberTicker } from '../common/NumberTicker'

interface ErrorBoundaryProps {
  fallback: React.ReactNode
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class WebGLErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.warn('WebGL Scene encountered an issue, gracefully rendering accessible view:', error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export const StudentPayoutSection: React.FC = React.memo(() => {
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d')
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)
  const [activeProofImg, setActiveProofImg] = useState<string | null>(null)

  // Sphere impulse ref preserved for future interactions
  const sphereImpulse = useRef<SphereImpulse>({ vx: 0, vy: 0, continuousDir: null })

  // Check for prefers-reduced-motion and WebGL support on mount
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mql.matches) {
      setPrefersReducedMotion(true)
      setViewMode('grid')
    }
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
      if (e.matches) setViewMode('grid')
    }
    mql.addEventListener('change', listener)

    try {
      const testCanvas = document.createElement('canvas')
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
        setViewMode('grid')
      }
    } catch {
      setWebglSupported(false)
      setViewMode('grid')
    }

    return () => mql.removeEventListener('change', listener)
  }, [])

  // Lock body & html scroll and listen for Escape key when lightbox is open
  useEffect(() => {
    if (!activeProofImg) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProofImg(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevTouchAction = document.body.style.touchAction

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
      document.body.style.touchAction = prevTouchAction
    }
  }, [activeProofImg])

  return (
    <section
      className="student-payout-section"
      id="student-payout"
      data-section="student-payout"
      aria-label="Student Payout Achievements"
    >
      {/* Background radial ambient accents */}
      <div className="payout-bg-radial" aria-hidden />
      <div className="payout-grid-overlay" aria-hidden />

      {/* Section Header */}
      <div className="payout-header">
        <span className="section-tag section-tag-emerald center">
          <span className="payout-live-pulse" />
          STUDENT PAYOUT
        </span>
        <h2 className="payout-title">
          From Learning to <em>Funded.</em>
        </h2>
        <p className="payout-subtitle">
          Real payouts, live trading feedback, and consistency milestones from Pravyn ICT students.
        </p>

        {/* Milestone Metrics Ribbon — Luxury Institutional Telemetry */}
        <div className="payout-stats-ribbon">
          <div className="payout-stat-item">
            <div className="stat-value-display">
              <span className="stat-number-text">
                <NumberTicker value={500} />
              </span>
              <span className="stat-suffix stat-suffix-emerald">+</span>
            </div>
            <span className="payout-stat-label">
              <span className="stat-pip stat-pip-emerald" aria-hidden="true" />
              Funded Students
            </span>
          </div>

          <div className="payout-stat-sep" />

          <div className="payout-stat-item">
            <div className="stat-value-display">
              <span className="stat-number-text">
                <NumberTicker value={94.2} decimalPlaces={1} />
              </span>
              <span className="stat-suffix stat-suffix-cyan">%</span>
            </div>
            <span className="payout-stat-label">
              <span className="stat-pip stat-pip-cyan" aria-hidden="true" />
              Discipline Score
            </span>
          </div>

          <div className="payout-stat-sep" />

          <div className="payout-stat-item">
            <div className="stat-value-display">
              <span className="stat-number-text">
                <NumberTicker value={4.9} decimalPlaces={1} />
              </span>
              <span className="stat-star-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
            </div>
            <span className="payout-stat-label">
              <span className="stat-pip stat-pip-gold" aria-hidden="true" />
              Community Rating
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Floating 3D Proof Field */}
      {viewMode === '3d' && webglSupported ? (
        <WebGLErrorBoundary
          fallback={
            <div className="payout-grid-stage">
              <div className="payout-screenshots-grid">
                {FEEDBACK_IMAGE_URLS.map((url, idx) => (
                  <div key={idx} className="payout-screenshot-card">
                    <img src={url} alt={`Student Payout Verification Screenshot ${idx + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="payout-sphere-stage">
            <StudentPayoutScene
              sphereImpulse={sphereImpulse}
              isAutoRotating={isAutoRotating}
              onSelectCard={(url) => setActiveProofImg(url)}
            />

            {/* Single clean icon button inside the card stage to switch to grid */}
            {webglSupported && !prefersReducedMotion && (
              <button
                type="button"
                className="payout-stage-toggle-btn"
                onClick={() => setViewMode('grid')}
                title="Switch to Grid View"
                aria-label="Switch to Grid View"
              >
                <span className="toggle-btn-icon">⊞</span>
                <span className="toggle-btn-label">Grid</span>
              </button>
            )}
          </div>
        </WebGLErrorBoundary>
      ) : (
        /* Accessible Feedback Screenshot Gallery View */
        <div className="payout-grid-stage">
          {webglSupported && !prefersReducedMotion && (
            <div className="payout-grid-header-actions">
              <button
                type="button"
                className="payout-stage-toggle-btn"
                onClick={() => setViewMode('3d')}
                title="Switch to 3D View"
                aria-label="Switch to 3D View"
              >
                <span className="toggle-btn-icon">✦</span>
                <span className="toggle-btn-label">3D View</span>
              </button>
            </div>
          )}
          <div className="payout-screenshots-grid">
            {FEEDBACK_IMAGE_URLS.map((url, idx) => (
              <div
                key={idx}
                className="payout-screenshot-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveProofImg(url)}
              >
                <img src={url} alt={`Student Payout Verification Screenshot ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-Resolution Screenshot Modal Lightbox — Rendered via Portal directly into document.body */}
      {activeProofImg && typeof document !== 'undefined' && createPortal(
        <div
          className="payout-lightbox-backdrop"
          onClick={() => setActiveProofImg(null)}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault()
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Student Payout Certificate Proof"
        >
          <div className="payout-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="payout-lightbox-close"
              onClick={() => setActiveProofImg(null)}
              aria-label="Close proof preview"
            >
              ✕
            </button>
            <div className="payout-lightbox-img-wrap">
              <img src={activeProofImg} alt="Verified Student Payout Proof" />
            </div>
            <div className="payout-lightbox-footer">
              <span className="payout-live-pulse" />
              <span>VERIFIED STUDENT PAYOUT CERTIFICATE & COMMUNITY EVIDENCE</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
})
