import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  MENTORSHIP_PLANS,
  MentorshipPlan,
  PRAVYN_WHATSAPP_PHONE,
  getSlingshotWhatsAppUrl,
  initiateRazorpayCheckout,
  getRazorpayKey,
} from '../../services/razorpay'

/* --------------------------------------------------------------------------
   CoinDCX-Style Slide-To-Enroll Component (Preserved Exact Interaction & Visuals)
   -------------------------------------------------------------------------- */
interface SlideToEnrollProps {
  label: string
  successLabel?: string
  colorVariant?: 'blue' | 'gold' | 'cyan'
  disabled?: boolean
  disabledLabel?: string
  onSuccess: () => void
}

export function SlideToEnroll({
  label,
  successLabel = 'Enrolled! Redirecting...',
  colorVariant = 'blue',
  disabled = false,
  disabledLabel = 'Enrollment Closed · Cohort Active',
  onSuccess,
}: SlideToEnrollProps) {
  const [sliderPos, setSliderPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const isCompletedRef = useRef(false)

  const triggerComplete = useCallback(() => {
    if (isCompletedRef.current || disabled) return
    isCompletedRef.current = true
    setIsDragging(false)
    setIsCompleted(true)
    if (trackRef.current) {
      const maxSlide = trackRef.current.offsetWidth - 38
      setSliderPos(maxSlide)
    }
    onSuccess()
    setTimeout(() => {
      isCompletedRef.current = false
      setIsCompleted(false)
      setSliderPos(0)
    }, 2800)
  }, [onSuccess, disabled])

  const handleStart = (clientX: number) => {
    if (isCompletedRef.current || disabled) return
    setIsDragging(true)
    startX.current = clientX - sliderPos
  }

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isCompletedRef.current || disabled || !trackRef.current) return
    const maxSlide = Math.max(0, trackRef.current.offsetWidth - 38)
    const newPos = Math.max(0, Math.min(clientX - startX.current, maxSlide))
    setSliderPos(newPos)
    if (newPos >= maxSlide * 0.75) {
      triggerComplete()
    }
  }, [isDragging, disabled, triggerComplete])

  const handleEnd = useCallback(() => {
    if (!isDragging || isCompletedRef.current || disabled) return
    setIsDragging(false)
    if (!trackRef.current) return
    const maxSlide = Math.max(0, trackRef.current.offsetWidth - 38)
    if (sliderPos >= maxSlide * 0.6) {
      triggerComplete()
    } else {
      setSliderPos(0)
    }
  }, [isDragging, sliderPos, disabled, triggerComplete])

  useEffect(() => {
    if (!isDragging || disabled) return
    const onWindowMove = (e: MouseEvent) => handleMove(e.clientX)
    const onWindowUp = () => handleEnd()
    window.addEventListener('mousemove', onWindowMove)
    window.addEventListener('mouseup', onWindowUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMove)
      window.removeEventListener('mouseup', onWindowUp)
    }
  }, [isDragging, disabled, handleMove, handleEnd])

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isCompletedRef.current && !isDragging && !disabled) {
      triggerComplete()
    }
  }

  return (
    <div
      className={`slide-track slide-${colorVariant} ${disabled ? 'is-disabled' : ''} ${isCompleted ? 'is-completed' : ''}`}
      ref={trackRef}
      onClick={handleTrackClick}
      onTouchMove={e => !disabled && handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label={disabled ? disabledLabel : label}
    >
      <div className="slide-progress" style={{ width: disabled ? 0 : `${sliderPos + 16}px` }} />
      <span className="slide-text">
        {disabled ? (
          <span className="slide-disabled-content">
            <span className="slide-lock-icon" aria-hidden="true">🔒</span>
            <span className="slide-label">{disabledLabel}</span>
          </span>
        ) : isCompleted ? (
          successLabel
        ) : (
          <>
            <span className="slide-label">{label}</span>
            <span className="slide-chevrons" aria-hidden="true">›››</span>
          </>
        )}
      </span>
      <div
        className={`slide-knob ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform: `translateX(${disabled ? 0 : sliderPos}px)` }}
        onMouseDown={e => {
          if (disabled) return
          e.stopPropagation()
          handleStart(e.clientX)
        }}
        onTouchStart={e => {
          if (disabled) return
          e.stopPropagation()
          handleStart(e.touches[0].clientX)
        }}
      >
        {disabled ? (
          <span className="knob-icon lock-mark">🔒</span>
        ) : isCompleted ? (
          <span className="knob-icon check-mark">✓</span>
        ) : (
          <span className="knob-icon arrow-mark">→</span>
        )}
      </div>
    </div>
  )
}

/* --------------------------------------------------------------------------
   PROGRAMMES SECTION COMPONENT
   Compact Front Cards + Portal-Powered Fullscreen Brochure Modal
   -------------------------------------------------------------------------- */
interface ProgrammesSectionProps {
  isBatchLive: boolean
  onEnroll?: (programmeName: string) => void
}


export function ProgrammesSection({ isBatchLive }: ProgrammesSectionProps) {
  const [activeModal, setActiveModal] = useState<'mastery' | 'online' | 'offline' | null>(null)
  const [pendingPlan, setPendingPlan] = useState<MentorshipPlan | null>(null)
  const [successPayment, setSuccessPayment] = useState<{
    plan: MentorshipPlan
    paymentId: string
  } | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const executeRazorpay = (plan: MentorshipPlan) => {
    setCheckoutLoading(true)
    initiateRazorpayCheckout({
      plan,
      onSuccess: (response, enrolledPlan) => {
        setCheckoutLoading(false)
        setPendingPlan(null)
        setSuccessPayment({
          plan: enrolledPlan,
          paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
        })
      },
      onDismiss: () => {
        setCheckoutLoading(false)
      },
      onError: (err) => {
        console.warn('Razorpay checkout notice:', err)
        setCheckoutLoading(false)
      },
    })
  }

  const reserveActionLockRef = useRef(false)

  const handleSlingshotReserve = useCallback(() => {
    if (reserveActionLockRef.current) return
    reserveActionLockRef.current = true

    const url = getSlingshotWhatsAppUrl(MENTORSHIP_PLANS.offline)
    const win = window.open(url, '_blank', 'noopener,noreferrer')
    if (!win) {
      window.location.href = url
    }

    setTimeout(() => {
      reserveActionLockRef.current = false
    }, 2800)
  }, [])

  const handleEnrollClick = (plan: MentorshipPlan) => {
    const currentKey = getRazorpayKey()
    if (currentKey === 'rzp_test_placeholder_key') {
      // Show helper dialog explaining gateway readiness and providing test options
      setPendingPlan(plan)
    } else {
      executeRazorpay(plan)
    }
  }

  // Body scroll lock while modal is open
  useEffect(() => {
    if (activeModal || pendingPlan || successPayment) {
      const prevOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prevOverflow
      }
    }
  }, [activeModal, pendingPlan, successPayment])

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeModal])

  return (
    <section className="prog-section" id="programmes" data-section="programmes">
      {/* ── Section Header ────────────────────────────────────────── */}
      <div className="prog-header reveal-el">
        <p className="section-tag">02 / PROGRAMMES</p>
        <h2>Three pathways to mastery.</h2>
        <p className="prog-header-sub">Live batch, offline intensive, or personal 1-on-1 — choose your edge.</p>
      </div>

      {/* ── 3-Card Balanced Trio Grid (Personal Mentorship | Featured Live Batch | Slingshot Model) ── */}
      <div className="prog-cards-grid">

        {/* ══════════════════════════════════════════════════════════════
           CARD 01: PERSONAL MENTORSHIP — PRIVATE 1-ON-1 (CYBER SAPPHIRE)
           ══════════════════════════════════════════════════════════════ */}
        <div className="prog-card-container prog-card-side reveal-el">
          <div className="card-border-beam beam-blue" aria-hidden="true" />

          <article className="prog-card-face card-theme-blue">
            <div className="card-ambient-glow glow-blue" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tr" aria-hidden="true" />
            <span className="card-corner-bracket bracket-bl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-br" aria-hidden="true" />
            <div className="card-subtle-mesh" aria-hidden="true" />

            {/* Top Bar: Mode Tag & Index 01 */}
            <div className="card-editorial-top">
              <div className="card-mode-badge mode-badge-blue">
                <span className="mode-pulse dot-blue" />
                <span>1-ON-1 · PRIVATE ZOOM</span>
              </div>
              <div className="card-index-num num-blue">01</div>
            </div>

            {/* Title & Philosophy Quote */}
            <div className="card-hero-block">
              <h3 className="card-editorial-title title-blue">
                PERSONAL MENTORSHIP
              </h3>
              <p className="card-editorial-quote">
                1-to-1 mentorship built around your personal trading journey & execution.
              </p>
            </div>

            {/* Price Statement */}
            <div className="card-price-statement">
              <div className="price-num-row">
                <span className="price-symbol symbol-blue">₹</span>
                <span className="price-amount amount-blue">24,999</span>
              </div>
              <span className="price-cadence">One-time enrollment</span>
            </div>

            {/* Clean Checkmark Feature List (4 Core Points) */}
            <ul className="card-feature-checklist checklist-blue">
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Personal 1-on-1 Sessions with Mentor</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Live Trading Access & Execution Context</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Futures Market & Basics + Personal Model for Nasdaq</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Direct 1-on-1 Follow-up From Your Mentor</span>
              </li>
            </ul>

            {/* Secondary Action: View Full Details ↗ */}
            <button
              type="button"
              className="card-details-trigger trigger-blue"
              onClick={() => setActiveModal('online')}
              aria-label="View full curriculum details for Personal Mentorship"
            >
              <span>VIEW FULL DETAILS</span>
              <span className="arrow-sym">↗</span>
            </button>

            <div className="card-divider-hairline" />

            {/* CoinDCX Slide-To-Enroll Slider */}
            <div className="card-slider-wrap">
              <SlideToEnroll
                label="Slide to Enroll"
                disabled={isBatchLive}
                disabledLabel="Enrollment Closed · Cohort is Live"
                successLabel="Redirecting to Razorpay..."
                colorVariant="blue"
                onSuccess={() => handleEnrollClick(MENTORSHIP_PLANS.online)}
              />
            </div>
          </article>
        </div>

        {/* ══════════════════════════════════════════════════════════════
           CARD 02: FEATURED LIVE BATCH — ICT MASTERY MENTORSHIP (ACTIVE)
           ══════════════════════════════════════════════════════════════ */}
        <div className="prog-card-container prog-card-featured reveal-el">
          <div className="live-card-backdrop-aura" aria-hidden="true" />
          <div className="card-border-beam beam-cyan" aria-hidden="true" />

          <article className="prog-card-face card-theme-cyan">
            <div className="card-live-sweep" aria-hidden="true" />
            <div className="card-ambient-glow glow-cyan" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tr" aria-hidden="true" />
            <span className="card-corner-bracket bracket-bl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-br" aria-hidden="true" />
            <div className="card-subtle-mesh" aria-hidden="true" />

            {/* Top Bar: Eyebrow Tag & Compact Horizontal Live Status Pill + Index 02 */}
            <div className="card-editorial-top">
              <div className="card-mode-badge mode-badge-cyan">
                <span className="mode-pulse dot-cyan" />
                <span>ONLINE · LIVE BATCH</span>
              </div>
              <div className="card-top-right-group">
                <div className="card-status-pill status-pill-live" aria-label="Batch is live now">
                  <span className="status-live-dot" aria-hidden="true" />
                  <span>LIVE NOW</span>
                </div>
                <div className="card-index-num num-cyan">02</div>
              </div>
            </div>

            {/* Title & Philosophy Quote */}
            <div className="card-hero-block">
              <h3 className="card-editorial-title title-cyan">
                ICT MASTERY MENTORSHIP
              </h3>
              <p className="card-editorial-quote">
                Mentorship with live trading sessions with mentor after the classes.
              </p>
            </div>

            {/* Price Statement */}
            <div className="card-price-statement">
              <div className="price-num-row">
                <span className="price-symbol symbol-cyan">₹</span>
                <span className="price-amount amount-cyan">9,999</span>
              </div>
              <span className="price-cadence">Sept 29 Batch · 11 Days (7 PM – 9 PM)</span>
            </div>

            {/* Clean Checkmark Feature List (4 Core Points) */}
            <ul className="card-feature-checklist checklist-cyan">
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Starts Sept 29 · 11 Days (7 PM – 9 PM)</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Language: தமிழ் · Session Recordings Provided</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Live Trading Sessions with Mentor After Classes</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>15 Topics: Slingshot & Nasdaq Models, Forex & Futures</span>
              </li>
            </ul>

            {/* Secondary Action: View Full Details ↗ */}
            <button
              type="button"
              className="card-details-trigger trigger-cyan"
              onClick={() => setActiveModal('mastery')}
              aria-label="View full curriculum details for ICT Mastery Mentorship"
            >
              <span>VIEW FULL DETAILS</span>
              <span className="arrow-sym">↗</span>
            </button>

            <div className="card-divider-hairline" />

            {/* CoinDCX Slide-To-Enroll Slider */}
            <div className="card-slider-wrap">
              <SlideToEnroll
                label="Slide to Enroll"
                disabled={isBatchLive}
                disabledLabel="Enrollment Closed · Cohort is Live"
                successLabel="Redirecting to Razorpay..."
                colorVariant="cyan"
                onSuccess={() => handleEnrollClick(MENTORSHIP_PLANS.mastery)}
              />
            </div>
          </article>
        </div>

        {/* ══════════════════════════════════════════════════════════════
           CARD 03: SLINGSHOT MODEL — OFFLINE CHENNAI (IMPERIAL GOLD)
           ══════════════════════════════════════════════════════════════ */}
        <div className="prog-card-container prog-card-side reveal-el">
          <div className="card-border-beam beam-gold" aria-hidden="true" />

          <article className="prog-card-face card-theme-gold">
            <div className="card-ambient-glow glow-gold" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tr" aria-hidden="true" />
            <span className="card-corner-bracket bracket-bl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-br" aria-hidden="true" />
            <div className="card-subtle-mesh" aria-hidden="true" />

            {/* Top Bar: Mode Tag & Index 03 */}
            <div className="card-editorial-top">
              <div className="card-mode-badge mode-badge-gold">
                <span className="mode-pulse dot-gold" />
                <span>UPCOMING · OFFLINE CHENNAI</span>
              </div>
              <div className="card-index-num num-gold">03</div>
            </div>

            {/* Title & Philosophy Quote */}
            <div className="card-hero-block">
              <h3 className="card-editorial-title title-gold">
                SLINGSHOT MODEL
              </h3>
              <p className="card-editorial-quote">
                Master our proprietary XAUUSD execution model in Chennai.
              </p>
            </div>

            {/* Price Statement */}
            <div className="card-price-statement">
              <div className="price-num-row">
                <span className="price-symbol symbol-gold">₹</span>
                <span className="price-amount amount-gold">19,999</span>
              </div>
              <span className="price-cadence">December Batch (Dates Soon)</span>
            </div>

            {/* Clean Checkmark Feature List (4 Core Points) */}
            <ul className="card-feature-checklist checklist-gold">
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Proprietary XAUUSD Strategy & Execution</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>High-Probability 2–3R Trades (5–7 Setups / Wk)</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>In-Person Classroom Cohort in Chennai</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>WhatsApp Group + Lifetime Access & Live Sessions</span>
              </li>
            </ul>

            {/* Secondary Action: View Full Details ↗ */}
            <button
              type="button"
              className="card-details-trigger trigger-gold"
              onClick={() => setActiveModal('offline')}
              aria-label="View full details for Slingshot Model"
            >
              <span>VIEW FULL DETAILS</span>
              <span className="arrow-sym">↗</span>
            </button>

            <div className="card-divider-hairline" />

            {/* CoinDCX Slide-To-Enroll Slider */}
            <div className="card-slider-wrap">
              <SlideToEnroll
                label="Slide to Reserve Seat"
                disabled={isBatchLive}
                disabledLabel="Enrollment Closed · Cohort is Live"
                successLabel="Opening WhatsApp..."
                colorVariant="gold"
                onSuccess={handleSlingshotReserve}
              />
            </div>
          </article>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════
         PORTAL-RENDERED FULLSCREEN 3D FLIP BROCHURE MODAL OVERLAY
         Rendered directly into document.body to bypass any parent stacking context
         ══════════════════════════════════════════════════════════════ */}
      {activeModal && typeof document !== 'undefined' && createPortal(
        <div
          className="prog-modal-backdrop"
          onClick={() => setActiveModal(null)}
          role="dialog"
          aria-modal="true"
          aria-label={
            activeModal === 'mastery'
              ? 'ICT Mastery Mentorship Curriculum Brochure'
              : activeModal === 'online'
              ? 'Personal Mentorship Curriculum Brochure'
              : 'Slingshot Model Bootcamp Brochure'
          }
        >
          <div
            className={`prog-modal-dialog ${
              activeModal === 'mastery'
                ? 'modal-theme-cyan'
                : activeModal === 'online'
                ? 'modal-theme-blue'
                : 'modal-theme-gold'
            }`}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Corner Accents */}
            <span className="card-corner-bracket bracket-tl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tr" aria-hidden="true" />
            <span className="card-corner-bracket bracket-bl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-br" aria-hidden="true" />

            {/* Modal Header Bar — 100% Unobstructed Above All Navbars */}
            <div className="prog-modal-header">
              <div className="modal-header-info">
                <span
                  className={`card-mode-badge ${
                    activeModal === 'mastery'
                      ? 'mode-badge-cyan'
                      : activeModal === 'online'
                      ? 'mode-badge-blue'
                      : 'mode-badge-gold'
                  }`}
                >
                  <span
                    className={`mode-pulse ${
                      activeModal === 'mastery'
                        ? 'dot-cyan'
                        : activeModal === 'online'
                        ? 'dot-blue'
                        : 'dot-gold'
                    }`}
                  />
                  <span>
                    {activeModal === 'mastery'
                      ? 'ONLINE · LIVE BATCH (SEP 29)'
                      : activeModal === 'online'
                      ? 'ONLINE · 1-ON-1 ZOOM'
                      : 'OFFLINE · CHENNAI'}
                  </span>
                </span>
                <h3 className="modal-title">
                  {activeModal === 'mastery'
                    ? 'ICT MASTERY MENTORSHIP'
                    : activeModal === 'online'
                    ? 'PERSONAL MENTORSHIP'
                    : 'SLINGSHOT MODEL'}
                </h3>
                <span className="modal-price">
                  {activeModal === 'mastery'
                    ? '₹9,999/- · Starts September 29th'
                    : activeModal === 'online'
                    ? '₹24,999/- · One-Time Investment'
                    : '₹19,999/- · December Intensive'}
                </span>
              </div>
              <button
                type="button"
                className={`modal-close-btn ${
                  activeModal === 'mastery'
                    ? 'close-btn-cyan'
                    : activeModal === 'online'
                    ? 'close-btn-blue'
                    : 'close-btn-gold'
                }`}
                onClick={() => setActiveModal(null)}
                aria-label="Close brochure"
              >
                <span>✕ BACK TO CARDS</span>
              </button>
            </div>

            {/* Modal Body: Scannable Curriculum Document */}
            <div className="prog-modal-scroll">
              {activeModal === 'mastery' ? (
                /* ── ICT MASTERY MENTORSHIP CURRICULUM ─────────── */
                <div className="modal-content-sections">
                  {/* BATCH INFORMATION */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-cyan">01</span>
                      <h5 className="doc-sec-title">BATCH INFORMATION & SCHEDULE</h5>
                    </div>
                    <div className="doc-editorial-list">
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Classes Start:</strong> September 29th
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Duration:</strong> 11 Days Comprehensive Intensive
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Class Timings:</strong> 7:00 PM to 9:00 PM Daily Live Sessions
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Language:</strong> தமிழ் (Tamil)
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Session Recordings:</strong> Full session recordings will be provided
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Live Trading Sessions:</strong> Mentorship with Live Trading Sessions with Mentor after the classes 📈🔥
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 15 TOPICS CURRICULUM */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-cyan">02</span>
                      <h5 className="doc-sec-title">CURRICULUM TOPICS (15 CORE MODULES)</h5>
                    </div>
                    <div className="doc-columns-grid">
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Basics Of Forex Market</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>ICT Concept Intro</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Basic Market Structure</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>OB & PD arrays</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Liquidity & QML</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>SMT Divergence & Displacement</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Timeframe Alignment</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Sessions & Killzones</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>XAUUSD Characteristics</span>
                      </div>
                      <div className="doc-item highlight-cyan">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>My Own Slingshot Model</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>ICT Silver Bullet</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Futures Trading Basics</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Futures Market Propfirms</span>
                      </div>
                      <div className="doc-item highlight-cyan">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Our Own Nasdaq Model for Futures Market</span>
                      </div>
                      <div className="doc-item full-row highlight-cyan">
                        <span className="doc-topic-icon bullet-cyan" aria-hidden="true">✦</span>
                        <span>Risk Management & Psychology</span>
                      </div>
                    </div>
                  </div>

                  {/* POST-CLASS LIVE SESSIONS */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-cyan">03</span>
                      <h5 className="doc-sec-title">LIVE MARKET SESSIONS & INCLUSIONS</h5>
                    </div>
                    <div className="doc-editorial-list">
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Live Market Session:</strong> This mentorship includes LIVE MARKET SESSION With Mentor 👨🏻💻🙌🔥
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Execution Mentorship:</strong> Live chart execution sessions with mentor directly after the classes.
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-cyan">—</span>
                        <div className="doc-row-text">
                          <strong>Recordings Provided:</strong> Full session recordings provided for life-long revision & mastery.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeModal === 'online' ? (
                /* ── PERSONAL MENTORSHIP FULL CURRICULUM ─────────── */
                <div className="modal-content-sections">
                  {/* WHAT YOU GET */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num">01</span>
                      <h5 className="doc-sec-title">WHAT YOU GET</h5>
                    </div>
                    <div className="doc-editorial-list">
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">
                          <strong>1-1 Sessions:</strong> Dedicated private training built around your personal schedule and trading psychology.
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">
                          <strong>From Basics to Everything:</strong> Complete foundational mechanics through to professional market execution.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CURRICULUM */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num">02</span>
                      <h5 className="doc-sec-title">CURRICULUM</h5>
                    </div>
                    <div className="doc-columns-grid">
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Basics Of Forex Market</span>
                      </div>
                      <div className="doc-item highlight-blue">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Futures Market & Basics</span>
                      </div>
                      <div className="doc-item highlight-blue">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Personal Model for Nasdaq</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Prop Firms & Their Rules</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Market Structure Understanding</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Orderblocks & Types</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Blocks & Gaps</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Liquidity & Its Illustrations</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Premium & Discount</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>SMT Divergence</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Timeframe Alignment & Analysis</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Sessions & Its Behaviour</span>
                      </div>
                      <div className="doc-item highlight-blue">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Entire ICT Topics Explained</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>XAUUSD Characteristics</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Risk Management & Psychology</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-blue" aria-hidden="true">✦</span>
                        <span>Character Understanding of Pairs</span>
                      </div>
                    </div>
                  </div>

                  {/* AFTER THE CLASSES */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num">03</span>
                      <h5 className="doc-sec-title">AFTER THE CLASSES</h5>
                    </div>
                    <div className="doc-editorial-list">
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Live Trading Session Access Will Be Given</div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Plan Trade With Your Mentor</div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Complete Class Recordings Access Provided</div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Get Your Personalised Trading Model</div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Direct 1-on-1 Follow-up From Your Mentor</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── SLINGSHOT MODEL FULL CURRICULUM ─────────────── */
                <div className="modal-content-sections">
                  {/* PROGRAM DETAILS */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-gold">01</span>
                      <h5 className="doc-sec-title">PROGRAM DETAILS & LOGISTICS</h5>
                    </div>
                    <div className="doc-editorial-list">
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Dates:</strong> December 2026 Batch (Dates Announced Soon)
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Timings:</strong> 10 AM — 6 PM Daily In-Person Classroom
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Location:</strong> Chennai (Venue Disclosed to Enrolled Traders)
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Hospitality:</strong> Lunch & Snacks Provided Daily
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OUR XAUUSD SLINGSHOT */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-gold">02</span>
                      <h5 className="doc-sec-title">OUR XAUUSD SLINGSHOT</h5>
                    </div>
                    <div className="doc-slingshot-banner">
                      <div className="ds-eyebrow">Introducing Our Own Strategy For:</div>
                      <div className="ds-headline">“XAUUSD - SLINGSHOT”</div>
                      <div className="ds-specs">
                        <div className="ds-spec-item">✦ Proven Strategies & PNL Reports</div>
                        <div className="ds-spec-item">✦ Easy To Understand</div>
                        <div className="ds-spec-item">✦ Proper 2 to 3R Trades</div>
                        <div className="ds-spec-item">✦ Weekly 5 to 7 Entries</div>
                        <div className="ds-spec-item full-width">
                          ✦ Slingshot Model Plan Sharing WhatsApp Group Access + Lifetime Access & Live Sessions
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CURRICULUM TOPICS */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-gold">03</span>
                      <h5 className="doc-sec-title">CURRICULUM TOPICS</h5>
                    </div>
                    <div className="doc-columns-grid compact">
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Basics Of Forex Market</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Prop Firms & Their Rules</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Market Structure Understanding</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Orderblocks & Types</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Liquidity & Its Illustrations</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Premium & Discount</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>SMT Divergence</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Timeframe Analysis</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Sessions & Its Behaviour</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Risk Management & Psychology</span>
                      </div>
                      <div className="doc-item">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">✦</span>
                        <span>Character Understanding of Pairs</span>
                      </div>
                      <div className="doc-item full-row highlight-gold">
                        <span className="doc-topic-icon bullet-gold" aria-hidden="true">★</span>
                        <span>Proprietary XAUUSD Model + Extra Asia Session Model for Nasdaq Taught</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Conversion Bar with Slider */}
            <div className="prog-modal-footer">
              <SlideToEnroll
                label={activeModal === 'offline' ? 'Slide to Reserve Seat' : 'Slide to Enroll'}
                disabled={isBatchLive}
                disabledLabel="Enrollment Closed · Cohort is Live"
                successLabel={activeModal === 'offline' ? 'Opening WhatsApp...' : 'Redirecting to Razorpay...'}
                colorVariant={
                  activeModal === 'mastery'
                    ? 'cyan'
                    : activeModal === 'online'
                    ? 'blue'
                    : 'gold'
                }
                onSuccess={() => {
                  if (activeModal === 'offline') {
                    setActiveModal(null)
                    handleSlingshotReserve()
                  } else {
                    const plan =
                      activeModal === 'mastery'
                        ? MENTORSHIP_PLANS.mastery
                        : MENTORSHIP_PLANS.online
                    setActiveModal(null)
                    handleEnrollClick(plan)
                  }
                }}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ══════════════════════════════════════════════════════════════
         RAZORPAY GATEWAY HELPER MODAL (FOR CREDENTIALS / TEST FLOW)
         ══════════════════════════════════════════════════════════════ */}
      {pendingPlan && typeof document !== 'undefined' && createPortal(
        <div
          className="rzp-modal-backdrop"
          onClick={() => setPendingPlan(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`rzp-dialog ${pendingPlan.colorVariant === 'gold' ? 'theme-gold' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="rzp-header">
              <span className={`rzp-badge ${pendingPlan.colorVariant === 'gold' ? 'gold' : ''}`}>
                <span>◆</span> RAZORPAY GATEWAY
              </span>
              <button
                type="button"
                className="rzp-close"
                onClick={() => setPendingPlan(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="rzp-plan-card">
              <div className="rzp-plan-name">{pendingPlan.name}</div>
              <div className="rzp-plan-desc">{pendingPlan.description}</div>
              <div className="rzp-amount-row">
                <span className="rzp-amount-label">Direct Enrollment Fee</span>
                <span className={`rzp-amount-val ${pendingPlan.colorVariant === 'gold' ? 'gold' : ''}`}>
                  ₹{pendingPlan.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="rzp-info-box">
              <strong>Gateway Configuration Ready:</strong> Razorpay Standard Checkout SDK is fully integrated. Add your Key ID in <code>.env</code> (<code>VITE_RAZORPAY_KEY_ID</code>) to begin accepting real UPI, Cards & Netbanking payments.
            </div>

            <div className="rzp-actions">
              <button
                type="button"
                className={`rzp-btn-primary ${pendingPlan.colorVariant === 'gold' ? 'gold' : ''}`}
                disabled={checkoutLoading}
                onClick={() => executeRazorpay(pendingPlan)}
              >
                {checkoutLoading ? 'Opening Razorpay Gateway...' : 'Launch Razorpay Gateway Modal →'}
              </button>

              <button
                type="button"
                className="rzp-btn-secondary"
                onClick={() => {
                  const mockPayId = 'pay_sim_' + Math.random().toString(36).substring(2, 9).toUpperCase()
                  setPendingPlan(null)
                  setSuccessPayment({
                    plan: pendingPlan,
                    paymentId: mockPayId,
                  })
                }}
              >
                Simulate Successful Payment (Test Flow)
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ══════════════════════════════════════════════════════════════
         PAYMENT SUCCESS & ENROLLMENT CONFIRMATION MODAL
         ══════════════════════════════════════════════════════════════ */}
      {successPayment && typeof document !== 'undefined' && createPortal(
        <div
          className="rzp-modal-backdrop"
          onClick={() => setSuccessPayment(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={`rzp-dialog ${successPayment.plan.colorVariant === 'gold' ? 'theme-gold' : ''}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="rzp-success-badge">✓</div>
            <h3 className="rzp-success-title">Enrollment Confirmed!</h3>
            <p className="rzp-success-sub">
              Your payment has been received. You are now officially enrolled in the {successPayment.plan.name} cohort.
            </p>

            <div className="rzp-receipt-card">
              <div className="rzp-receipt-row">
                <span className="rzp-receipt-label">Programme</span>
                <span className="rzp-receipt-val">{successPayment.plan.name}</span>
              </div>
              <div className="rzp-receipt-row">
                <span className="rzp-receipt-label">Delivery Format</span>
                <span className="rzp-receipt-val">{successPayment.plan.mode}</span>
              </div>
              <div className="rzp-receipt-row">
                <span className="rzp-receipt-label">Amount Paid</span>
                <span className="rzp-receipt-val">₹{successPayment.plan.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="rzp-receipt-row">
                <span className="rzp-receipt-label">Payment ID</span>
                <span className="rzp-receipt-val">{successPayment.paymentId}</span>
              </div>
            </div>

            <div className="rzp-actions">
              <a
                href={`https://wa.me/${PRAVYN_WHATSAPP_PHONE}?text=Hi%20Praveen,%20I%20have%20completed%20my%20enrollment%20for%20${encodeURIComponent(successPayment.plan.name)}.%20Payment%20ID:%20${encodeURIComponent(successPayment.paymentId)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rzp-whatsapp-btn"
              >
                <span>Connect with Mentor on WhatsApp →</span>
              </a>

              <button
                type="button"
                className="rzp-btn-secondary"
                onClick={() => setSuccessPayment(null)}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  )
}
