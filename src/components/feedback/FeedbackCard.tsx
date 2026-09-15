import React, { memo, useRef, useState, useEffect } from 'react'
import { StudentFeedback } from './feedbackData'

interface FeedbackCardProps {
  feedback: StudentFeedback
  index: number
  totalCount: number
  layer: 'active' | 'next' | 'prev' | 'bg' | 'hidden'
  style: React.CSSProperties
  isDragging?: boolean
  isFlipped?: boolean
  onToggleFlip?: () => void
  onViewFullProof?: (imgSrc: string) => void
  onClick?: () => void
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerMove?: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerUp?: (e: React.PointerEvent<HTMLDivElement>) => void
  onPointerCancel?: (e: React.PointerEvent<HTMLDivElement>) => void
}

export const FeedbackCard: React.FC<FeedbackCardProps> = memo(({
  feedback,
  index,
  totalCount,
  layer,
  style,
  isDragging = false,
  isFlipped = false,
  onToggleFlip,
  onViewFullProof,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [activeProofIdx, setActiveProofIdx] = useState(0)

  // Reset proof index if feedback changes
  useEffect(() => {
    setActiveProofIdx(0)
  }, [feedback.id])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (layer !== 'active' || !cardRef.current || isFlipped) return
    const w = cardRef.current.clientWidth || 400
    const h = cardRef.current.clientHeight || 480
    const x = (e.nativeEvent.offsetX / w) * 100
    const y = (e.nativeEvent.offsetY / h) * 100
    cardRef.current.style.setProperty('--glare-x', `${x}%`)
    cardRef.current.style.setProperty('--glare-y', `${y}%`)
  }

  const layerClass = `layer-${layer}`
  const springClass = !isDragging ? 'with-spring' : ''
  const dragClass = isDragging ? 'is-dragging' : ''
  const flippedClass = isFlipped ? 'is-flipped' : ''
  const isActive = layer === 'active'

  const currentProof = feedback.proofImages[activeProofIdx] || feedback.proofImages[0]
  const studentInitial = feedback.name.trim().charAt(0).toUpperCase() || 'S'

  return (
    <div
      ref={cardRef}
      className={`fdeck-card ${layerClass} ${springClass} ${dragClass} ${flippedClass}`}
      style={style}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      role="article"
      aria-label={`Student feedback from ${feedback.name}`}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <div className="fdeck-card-inner">
        {/* ── CARD FRONT ── */}
        <div className="fdeck-face fdeck-face-front">
          {/* Subtle Dynamic Glare */}
          <div className="fdeck-card-glare" aria-hidden="true" />

          {/* Front Header: Subtle Index + Section Tag */}
          <div className="fdeck-front-header">
            <div className="fdeck-header-infinity" aria-label="Infinite student feedback stream">
              <svg viewBox="0 0 24 24" className="fdeck-infinity-icon" aria-hidden="true">
                <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.178-8-12.356-8-5.096 0-5.096 8 0 8 5.178 0 7.261-8 12.356-8z" />
              </svg>
              <span className="fdeck-infinity-label">LIVE STREAM</span>
            </div>

            <div className="fdeck-header-badge">
              <span className="fdeck-badge-dot" aria-hidden="true" />
              <span>STUDENT FEEDBACK</span>
            </div>
          </div>

          {/* Front Body: Heroic, Readable Authentic Testimonial */}
          <div className="fdeck-front-body">
            <div className="fdeck-quote-container">
              <span className="fdeck-inline-quote" aria-hidden="true">“</span>
              <blockquote className="fdeck-quote-text">
                {feedback.feedback}
              </blockquote>
            </div>
          </div>

          {/* Front Footer: Monogram Identity + Sleek Real Proof CTA */}
          <div className="fdeck-front-footer">
            <div className="fdeck-student-identity">
              <div className="fdeck-avatar-monogram" aria-hidden="true">
                <span>{studentInitial}</span>
              </div>
              <div className="fdeck-student-meta">
                <span className="fdeck-student-name">{feedback.name}</span>
              </div>
            </div>

            <button
              type="button"
              className="fdeck-proof-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFlip?.()
              }}
              aria-label={`View real proof screenshot from ${feedback.name}`}
              title="Flip card to view original proof screenshot"
            >
              <span className="fdeck-proof-radar" aria-hidden="true" />
              <span className="fdeck-proof-btn-text">REAL PROOF</span>
              <svg viewBox="0 0 24 24" className="fdeck-proof-arrow" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── CARD BACK (ORIGINAL SCREENSHOT PROOF) ── */}
        <div className="fdeck-face fdeck-face-back">
          {/* Back Header */}
          <div className="fdeck-back-header">
            <div className="fdeck-back-title-wrap">
              <div className="fdeck-avatar-monogram fdeck-monogram-sm" aria-hidden="true">
                <span>{studentInitial}</span>
              </div>
              <div className="fdeck-back-names">
                <span className="fdeck-proof-tag">REAL PROOF</span>
                <span className="fdeck-proof-student">{feedback.name}</span>
              </div>
            </div>

            {feedback.proofImages.length > 1 && (
              <div className="fdeck-multi-proof-selector" aria-label="Multiple proof screenshots">
                {feedback.proofImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`fdeck-proof-pill ${activeProofIdx === i ? 'is-active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveProofIdx(i)
                    }}
                    aria-label={`Show proof screenshot ${i + 1} of ${feedback.proofImages.length}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Screenshot Preview */}
          <div className="fdeck-back-preview">
            <img
              src={currentProof}
              alt={`Original student feedback proof screenshot from ${feedback.name}`}
              className="fdeck-proof-img"
              loading="eager"
              onError={(e) => {
                const imgEl = e.currentTarget
                if (imgEl.src.includes('/Student_feedback/')) {
                  imgEl.src = imgEl.src.replace('/Student_feedback/', '/student_feeedback/')
                } else if (imgEl.src.includes('/student_feeedback/')) {
                  imgEl.src = imgEl.src.replace('/student_feeedback/', '/Student_feedback/')
                }
              }}
            />
          </div>

          {/* Back Footer Actions */}
          <div className="fdeck-back-footer">
            <button
              type="button"
              className="fdeck-back-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onToggleFlip?.()
              }}
              aria-label="Flip back to testimonial"
              title="Flip back to card front"
            >
              <svg viewBox="0 0 24 24" className="fdeck-btn-icon" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>BACK</span>
            </button>

            <button
              type="button"
              className="fdeck-view-full-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onViewFullProof?.(currentProof)
              }}
              aria-label="Open full resolution screenshot modal"
              title="Open full resolution screenshot"
            >
              <svg viewBox="0 0 24 24" className="fdeck-btn-icon" aria-hidden="true">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
              <span>VIEW FULL PROOF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

FeedbackCard.displayName = 'FeedbackCard'
