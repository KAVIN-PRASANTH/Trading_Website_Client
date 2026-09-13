import React, { useState, useRef, useEffect, useCallback } from 'react'
import { StudentPayoutScene } from './StudentPayoutScene'
import { SphereImpulse } from './AchievementSphere'
import { FEEDBACK_IMAGE_URLS } from './feedbackImages'

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

export const StudentPayoutSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'grid'>('3d')
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [webglSupported, setWebglSupported] = useState(true)

  // 4-Way Directional Controller for full 360 rotation on mobile and desktop
  const sphereImpulse = useRef<SphereImpulse>({ vx: 0, vy: 0, continuousDir: null })

  const handleDirectionStart = useCallback((dir: 'up' | 'down' | 'left' | 'right') => {
    sphereImpulse.current.continuousDir = dir
    if (dir === 'left') sphereImpulse.current.vy -= 0.018
    if (dir === 'right') sphereImpulse.current.vy += 0.018
    if (dir === 'up') sphereImpulse.current.vx += 0.016
    if (dir === 'down') sphereImpulse.current.vx -= 0.016
  }, [])

  const handleDirectionEnd = useCallback(() => {
    sphereImpulse.current.continuousDir = null
  }, [])

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
        <span className="section-tag center">
          <span className="payout-live-pulse" />
          STUDENT PAYOUT
        </span>
        <h2 className="payout-title">
          From Learning to <em>Funded.</em>
        </h2>
        <p className="payout-subtitle">
          Real payouts, live trading feedback, and consistency milestones from Pravyn ICT students.
        </p>

        {/* Milestone Metrics Ribbon */}
        <div className="payout-stats-ribbon">
          <div className="payout-stat-item">
            <strong>$1.4M+</strong>
            <span>STUDENT MILESTONES</span>
          </div>
          <div className="payout-stat-sep" />
          <div className="payout-stat-item">
            <strong>120+</strong>
            <span>FUNDED TRADERS</span>
          </div>
          <div className="payout-stat-sep" />
          <div className="payout-stat-item">
            <strong>94.2%</strong>
            <span>DISCIPLINE SCORE</span>
          </div>
          <div className="payout-stat-sep" />
          <div className="payout-stat-item">
            <strong>4.9★</strong>
            <span>COMMUNITY RATING</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher / HUD Bar */}
      <div className="payout-controls-bar">
        <div className="payout-focus-preview">
          <span className="payout-live-pulse" />
          <span className="focus-label">REAL COMMUNITY RESULTS:</span>
          <span className="focus-name">VERIFIED STUDENT PAYOUT PROOF</span>
          <span className="focus-tier">({FEEDBACK_IMAGE_URLS.length} SCREENSHOTS)</span>
        </div>

        <div className="payout-nav-actions">
          {webglSupported && !prefersReducedMotion && (
            <button
              type="button"
              className="payout-mode-toggle"
              onClick={() => setViewMode((m) => (m === '3d' ? 'grid' : '3d'))}
              aria-label="Toggle 3D Sphere or Gallery View"
            >
              {viewMode === '3d' ? '⊞ Feedback Gallery' : '✦ 3D Payout Sphere'}
            </button>
          )}
        </div>
      </div>

      {/* Interactive 3D Sphere Experience */}
      {viewMode === '3d' && webglSupported ? (
        <WebGLErrorBoundary
          fallback={
            <div className="payout-grid-stage">
              <div className="payout-screenshots-grid">
                {FEEDBACK_IMAGE_URLS.map((url, idx) => (
                  <div key={idx} className="payout-screenshot-card">
                    <div className="psc-badge">PROOF #{String(idx + 1).padStart(2, '0')}</div>
                    <img src={url} alt={`Student Payout Verification Screenshot ${idx + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          }
        >
          <div className="payout-sphere-stage">
            <StudentPayoutScene sphereImpulse={sphereImpulse} />

            {/* 4-Way Directional Controller for full 360 rotation on mobile and desktop */}
            <div className="payout-dpad-controls" aria-label="3D Sphere Directional Controls">
              <button
                type="button"
                className="dpad-btn dpad-up"
                aria-label="Roll Sphere Up"
                title="Roll Up"
                onPointerDown={() => handleDirectionStart('up')}
                onPointerUp={handleDirectionEnd}
                onPointerLeave={handleDirectionEnd}
              >
                ▲
              </button>
              <div className="dpad-middle-row">
                <button
                  type="button"
                  className="dpad-btn dpad-left"
                  aria-label="Spin Sphere Left"
                  title="Spin Left"
                  onPointerDown={() => handleDirectionStart('left')}
                  onPointerUp={handleDirectionEnd}
                  onPointerLeave={handleDirectionEnd}
                >
                  ◀
                </button>
                <div className="dpad-center-badge" title="360° Multi-Directional Rotation">
                  <span>360°</span>
                </div>
                <button
                  type="button"
                  className="dpad-btn dpad-right"
                  aria-label="Spin Sphere Right"
                  title="Spin Right"
                  onPointerDown={() => handleDirectionStart('right')}
                  onPointerUp={handleDirectionEnd}
                  onPointerLeave={handleDirectionEnd}
                >
                  ▶
                </button>
              </div>
              <button
                type="button"
                className="dpad-btn dpad-down"
                aria-label="Roll Sphere Down"
                title="Roll Down"
                onPointerDown={() => handleDirectionStart('down')}
                onPointerUp={handleDirectionEnd}
                onPointerLeave={handleDirectionEnd}
              >
                ▼
              </button>
            </div>

            {/* Scroll & Drag Guidance Pill */}
            <div className="payout-drag-hint" aria-hidden>
              <span className="hint-icon">✦</span>
              <span>Swipe or use 360° buttons to rotate 3D sphere</span>
            </div>
          </div>
        </WebGLErrorBoundary>
      ) : (
        /* Accessible Feedback Screenshot Gallery View */
        <div className="payout-grid-stage">
          <div className="payout-screenshots-grid">
            {FEEDBACK_IMAGE_URLS.map((url, idx) => (
              <div key={idx} className="payout-screenshot-card">
                <div className="psc-badge">VERIFIED PAYOUT #{String(idx + 1).padStart(2, '0')}</div>
                <img src={url} alt={`Student Payout Verification Screenshot ${idx + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
