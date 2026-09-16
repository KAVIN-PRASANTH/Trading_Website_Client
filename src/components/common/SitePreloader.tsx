import React, { useEffect, useState } from 'react'

export const SitePreloader: React.FC = () => {
  const [progress, setProgress] = useState(12)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    // Smooth simulated high-speed progress sequence
    const p1 = setTimeout(() => setProgress(42), 250)
    const p2 = setTimeout(() => setProgress(78), 600)
    const p3 = setTimeout(() => setProgress(100), 950)

    // Trigger fade-out transition after reaching 100%
    const fadeTimer = setTimeout(() => {
      setFading(true)
    }, 1200)

    // Fully unmount from DOM after transition completes
    const unmountTimer = setTimeout(() => {
      setMounted(false)
    }, 1750)

    return () => {
      clearTimeout(p1)
      clearTimeout(p2)
      clearTimeout(p3)
      clearTimeout(fadeTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (!mounted) return null

  const getStatusMessage = (p: number) => {
    if (p < 40) return 'INITIALIZING MARKET MATRIX...'
    if (p < 80) return 'CONNECTING INSTITUTIONAL SUITE...'
    if (p < 100) return 'PREPARING TRADER TERMINAL...'
    return 'TERMINAL READY'
  }

  return (
    <div
      className={`site-preloader${fading ? ' preloader-fade' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Trading Leaders Community"
    >
      <div className="preloader-bg-glow" aria-hidden="true" />
      <div className="preloader-grid" aria-hidden="true" />

      <div className="preloader-content">
        {/* Glowing circular logo portal */}
        <div className="preloader-logo-wrap">
          <div className="preloader-orbit-ring" aria-hidden="true" />
          <div className="preloader-orbit-ring-outer" aria-hidden="true" />
          <div className="preloader-core-glow" aria-hidden="true" />
          
          <img
            src="/logo/logo.png"
            alt="Trading Leaders Community Logo"
            className="preloader-logo-img"
          />
        </div>

        {/* Brand identity */}
        <div className="preloader-brand">
          <div className="preloader-title">
            <span>PRAVYN</span><em>ICT</em>
          </div>
          <div className="preloader-tagline">
            TRADING LEADERS COMMUNITY
          </div>
        </div>

        {/* Cybernetic progress track */}
        <div className="preloader-progress-wrap">
          <div className="preloader-progress-track">
            <div
              className="preloader-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="preloader-meta">
            <span className="preloader-status">{getStatusMessage(progress)}</span>
            <span className="preloader-pct">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
