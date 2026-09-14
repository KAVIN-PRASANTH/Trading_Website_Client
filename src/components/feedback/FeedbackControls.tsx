import React, { memo } from 'react'

interface FeedbackControlsProps {
  activeIndex: number
  totalCount: number
  isAutoPlay?: boolean
  onToggleAutoPlay?: () => void
  onPrev: () => void
  onNext: () => void
  onSelectIndex: (index: number) => void
}

const pad = (n: number) => String(n).padStart(2, '0')

export const FeedbackControls: React.FC<FeedbackControlsProps> = memo(({
  activeIndex,
  totalCount,
  isAutoPlay = true,
  onToggleAutoPlay,
  onPrev,
  onNext,
  onSelectIndex,
}) => {
  return (
    <div className="fdeck-controls-wrap">
      {/* Primary Navigation Row */}
      <div className="fdeck-controls-row">
        {/* Previous Card Button */}
        <button
          type="button"
          className="fdeck-nav-btn prev"
          onClick={onPrev}
          aria-label="Previous student testimonial"
          title="Previous testimonial"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Infinity Stream Badge */}
        <div className="fdeck-counter-badge fdeck-infinity-badge" aria-label="Endless testimonials stream">
          <svg viewBox="0 0 24 24" className="fdeck-infinity-icon" aria-hidden="true">
            <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.178-8-12.356-8-5.096 0-5.096 8 0 8 5.178 0 7.261-8 12.356-8z" />
          </svg>
          <span className="fdeck-infinity-text">ENDLESS</span>
        </div>

        {/* Next Card Button */}
        <button
          type="button"
          className="fdeck-nav-btn next"
          onClick={onNext}
          aria-label="Next student testimonial"
          title="Next testimonial"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Secondary Controls: Autoplay Status */}
      <div className="fdeck-secondary-controls">
        {onToggleAutoPlay && (
          <button
            type="button"
            className={`fdeck-autoplay-pill ${isAutoPlay ? 'is-active' : ''}`}
            onClick={onToggleAutoPlay}
            aria-label={isAutoPlay ? 'Pause auto-slide' : 'Resume auto-slide'}
            title={isAutoPlay ? 'Pause auto-slide (3.2s delay)' : 'Resume auto-slide'}
          >
            <span className="fdeck-autoplay-dot" aria-hidden="true" />
            <span className="fdeck-autoplay-label">{isAutoPlay ? 'Auto' : 'Paused'}</span>
          </button>
        )}
      </div>

      {/* Touch & Drag Interaction Hint */}
      <div className="fdeck-gesture-hint" aria-hidden="true">
        <span>Swipe left/right or click cards</span>
        <span className="fdeck-hint-arrow">⟷</span>
      </div>
    </div>
  )
})

FeedbackControls.displayName = 'FeedbackControls'
