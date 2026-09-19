import React, { forwardRef } from 'react'
import { ProofScreenshotItem } from './proofTypes'

export interface ProofPieceProps {
  item: ProofScreenshotItem
  style?: React.CSSProperties
  onSelect: (item: ProofScreenshotItem) => void
  onPointerEnter?: (e: React.PointerEvent) => void
  onPointerLeave?: (e: React.PointerEvent) => void
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
}

export const ProofPiece = forwardRef<HTMLDivElement, ProofPieceProps>(({
  item,
  style,
  onSelect,
  onPointerEnter,
  onPointerLeave,
  onMouseEnter,
  onMouseLeave,
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(item)
    }
  }

  return (
    <div
      ref={ref}
      className="proof-marquee-card"
      style={style}
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`Inspect ${item.studentName}'s authentic student proof screenshot`}
      title={`Click to view full unedited screenshot (${item.studentName})`}
    >
      <div className="proof-card-inner">
        {/* Real Unedited Screenshot Object - Natural aspect ratio */}
        <img
          src={item.imageUrl}
          alt={`Authentic WhatsApp trading feedback proof from ${item.studentName}`}
          className="proof-card-img"
          loading="lazy"
          draggable={false}
        />

        {/* Subtle physical depth vignette */}
        <div className="proof-card-glare" aria-hidden="true" />

        {/* Minimal hover inspection badge */}
        <div className="proof-card-inspect-hint" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Full View</span>
        </div>
      </div>
    </div>
  )
})

ProofPiece.displayName = 'ProofPiece'

