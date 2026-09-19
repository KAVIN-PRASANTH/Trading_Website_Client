import React from 'react'
import { ProofScreenshotItem } from './proofTypes'

export interface MosaicSlot {
  id: string
  tier: 'large' | 'medium' | 'small'
  // Position as percentage from container origin
  x: number // percentage
  y: number // percentage
  width: string
  height: string
  scale: number
  rotate: number // degrees
  zIndex: number
  opacity: number
}

interface ProofTileProps {
  item: ProofScreenshotItem
  slot: MosaicSlot
  onSelect: (item: ProofScreenshotItem) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const ProofTile: React.FC<ProofTileProps> = ({
  item,
  slot,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}) => {
  const isLarge = slot.tier === 'large'
  const isMedium = slot.tier === 'medium'

  const tileStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${slot.x}%`,
    top: `${slot.y}%`,
    width: slot.width,
    height: slot.height,
    transform: `translate(-50%, -50%) rotate(${slot.rotate}deg) scale(${slot.scale})`,
    zIndex: slot.zIndex,
    opacity: slot.opacity,
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(item)
    }
  }

  return (
    <div
      className={`proof-mosaic-tile proof-tile-${slot.tier}`}
      style={tileStyle}
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={`View ${item.studentName}'s authentic feedback proof screenshot`}
      title={`Click to inspect ${item.studentName}'s original screenshot`}
    >
      <div className="proof-tile-inner">
        {/* Physical artifact top header strip */}
        <div className="proof-tile-header">
          <div className="proof-tile-student">
            <span className="proof-tile-avatar-dot" />
            <span className="proof-tile-name">{item.studentName}</span>
          </div>

          <div className="proof-tile-tag">
            <span className="proof-tile-tag-dot" />
            <span className="proof-tile-tag-text">
              {isLarge ? '● VERIFIED PROOF' : isMedium ? 'WHATSAPP' : 'PROMPT'}
            </span>
          </div>
        </div>

        {/* Natural uncropped screenshot container */}
        <div className="proof-tile-img-wrap">
          <img
            src={item.imageUrl}
            alt={`${item.studentName} unedited student trading testimonial screenshot`}
            className="proof-tile-img"
            loading="lazy"
          />

          {/* Subtle gradient vignette on edges for physical photograph feel */}
          <div className="proof-tile-vignette" aria-hidden="true" />

          {/* Click to inspect overlay pill on hover */}
          <div className="proof-tile-hover-cue" aria-hidden="true">
            <span className="proof-cue-icon">🔍</span>
            <span className="proof-cue-text">Inspect Proof</span>
          </div>
        </div>

        {/* Bottom indicator badge */}
        {item.badgeLabel && isLarge && (
          <div className="proof-tile-footer">
            <span className="proof-tile-badge-highlight">{item.badgeLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
