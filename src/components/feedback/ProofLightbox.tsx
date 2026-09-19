import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ProofScreenshotItem } from './proofTypes'

interface ProofLightboxProps {
  item: ProofScreenshotItem | null
  catalog: ProofScreenshotItem[]
  onClose: () => void
  onSelect: (item: ProofScreenshotItem) => void
}

export const ProofLightbox: React.FC<ProofLightboxProps> = ({
  item,
  catalog,
  onClose,
  onSelect,
}) => {
  if (!item) return null

  const currentIndex = catalog.findIndex((c) => c.id === item.id)

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + catalog.length) % catalog.length
    onSelect(catalog[prevIdx])
  }, [currentIndex, catalog, onSelect])

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % catalog.length
    onSelect(catalog[nextIdx])
  }, [currentIndex, catalog, onSelect])

  // Lock body scroll and register keyboard listener
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, handlePrev, handleNext])

  return createPortal(
    <div
      className="proof-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.studentName} original screenshot proof`}
    >
      {/* Viewport-fixed prominent corner exit button */}
      <button
        type="button"
        className="proof-lightbox-fixed-close"
        onClick={onClose}
        aria-label="Close proof viewer (Esc)"
        title="Close proof viewer (Esc)"
      >
        <span className="proof-lightbox-close-icon">✕</span>
        <span className="proof-lightbox-close-text">CLOSE (ESC)</span>
      </button>

      <div className="proof-lightbox-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar */}
        <div className="proof-lightbox-topbar">
          <div className="proof-lightbox-meta">
            <span className="proof-lightbox-student-pill">{item.studentName}</span>
            {item.badgeLabel && (
              <span className="proof-lightbox-badge-pill">● {item.badgeLabel}</span>
            )}
            <span className="proof-lightbox-counter">
              {currentIndex + 1} of {catalog.length}
            </span>
          </div>

          <div className="proof-lightbox-actions">
            <button
              type="button"
              className="proof-nav-btn proof-nav-prev"
              onClick={handlePrev}
              aria-label="Previous proof screenshot (ArrowLeft)"
              title="Previous proof (ArrowLeft)"
            >
              ← Prev
            </button>
            <button
              type="button"
              className="proof-nav-btn proof-nav-next"
              onClick={handleNext}
              aria-label="Next proof screenshot (ArrowRight)"
              title="Next proof (ArrowRight)"
            >
              Next →
            </button>
            <button
              type="button"
              className="proof-lightbox-close-btn"
              onClick={onClose}
              aria-label="Close"
              title="Close (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable / Pinch-zoomable High-Resolution Image Container */}
        <div className="proof-lightbox-body">
          <img
            src={item.imageUrl}
            alt={`${item.studentName} authentic WhatsApp conversation proof`}
            className="proof-lightbox-img"
            loading="eager"
          />
        </div>

        {/* Footer info bar */}
        <div className="proof-lightbox-footer">
          <div className="proof-footer-left">
            <span className="proof-live-pulse" />
            <span>ORIGINAL UNEDITED STUDENT PROOF · 100% AUTHENTIC WHATSAPP CONVERSATION</span>
          </div>
          <span className="proof-lightbox-hint">Click outside or press Esc to return to mosaic</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
