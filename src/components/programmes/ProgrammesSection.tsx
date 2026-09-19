import React, { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  MENTORSHIP_PLANS,
  MentorshipPlan,
  initiateRazorpayCheckout,
  getRazorpayKey,
} from '../../services/razorpay'

/* --------------------------------------------------------------------------
   CoinDCX-Style Slide-To-Enroll Component (Preserved Exact Interaction & Visuals)
   -------------------------------------------------------------------------- */
interface SlideToEnrollProps {
  label: string
  successLabel?: string
  colorVariant?: 'blue' | 'gold'
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
      const maxSlide = trackRef.current.offsetWidth - 50
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
    const maxSlide = Math.max(0, trackRef.current.offsetWidth - 50)
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
    const maxSlide = Math.max(0, trackRef.current.offsetWidth - 50)
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
      <div className="slide-progress" style={{ width: disabled ? 0 : `${sliderPos + 25}px` }} />
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
  const [activeModal, setActiveModal] = useState<'online' | 'offline' | null>(null)
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
        <h2>Two ways to learn.</h2>
        <p className="prog-header-sub">One way to trade with precision.</p>
      </div>

      {/* ── Compact Front Cards Grid ──────────────────────────────── */}
      <div className="prog-cards-wrap">

        {/* ══════════════════════════════════════════════════════════════
           CARD 01: PERSONAL MENTORSHIP — ONLINE ONLY (CYBER SAPPHIRE)
           ══════════════════════════════════════════════════════════════ */}
        <div className="prog-card-container reveal-el">
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
                <span>ONLINE · ZOOM</span>
              </div>
              <div className="card-index-num num-blue">01</div>
            </div>

            {/* Title & Philosophy Quote */}
            <div className="card-hero-block">
              <h3 className="card-editorial-title title-blue">
                PERSONAL MENTORSHIP
              </h3>
              <p className="card-editorial-quote">
                1-to-1 mentorship built around your trading journey and execution.
              </p>
            </div>

            {/* Price Statement */}
            <div className="card-price-statement">
              <div className="price-num-row">
                <span className="price-symbol">₹</span>
                <span className="price-amount">24,999</span>
              </div>
              <span className="price-cadence">One-time enrollment</span>
            </div>

            {/* Clean Checkmark Feature List */}
            <ul className="card-feature-checklist checklist-blue">
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Personal 1-on-1 Sessions (Unlimited Duration)</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Live Trading Access & Execution Context</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Complete Class Recordings Archive</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Personalised Institutional Trading Model</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Direct Mentor Accountability & Follow-up</span>
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
           CARD 02: SLINGSHOT MODEL — OFFLINE ONLY (IMPERIAL GOLD)
           ══════════════════════════════════════════════════════════════ */}
        <div className="prog-card-container reveal-el">
          <div className="card-border-beam beam-gold" aria-hidden="true" />

          <article className="prog-card-face card-theme-gold">
            <div className="card-ambient-glow glow-gold" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-tr" aria-hidden="true" />
            <span className="card-corner-bracket bracket-bl" aria-hidden="true" />
            <span className="card-corner-bracket bracket-br" aria-hidden="true" />
            <div className="card-subtle-mesh" aria-hidden="true" />

            {/* Top Bar: Mode Tag & Index 02 */}
            <div className="card-editorial-top">
              <div className="card-mode-badge mode-badge-gold">
                <span className="mode-pulse dot-gold" />
                <span>OFFLINE · COIMBATORE</span>
              </div>
              <div className="card-index-num num-gold">02</div>
            </div>

            {/* Title & Philosophy Quote */}
            <div className="card-hero-block">
              <h3 className="card-editorial-title title-gold">
                SLINGSHOT MODEL
              </h3>
              <p className="card-editorial-quote">
                Master our institutional XAUUSD execution model.
              </p>
            </div>

            {/* Price Statement */}
            <div className="card-price-statement">
              <div className="price-num-row">
                <span className="price-symbol symbol-gold">₹</span>
                <span className="price-amount amount-gold">19,999</span>
              </div>
              <span className="price-cadence">One-time enrollment</span>
            </div>

            {/* Clean Checkmark Feature List */}
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
                <span>In-Person Classroom Cohort in Coimbatore</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Course Materials, Daily Hospitality & Lunch</span>
              </li>
              <li>
                <span className="check-icon" aria-hidden="true">✓</span>
                <span>Strictly Capped Cohort (20 Traders Max)</span>
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
                successLabel="Redirecting to Razorpay..."
                colorVariant="gold"
                onSuccess={() => handleEnrollClick(MENTORSHIP_PLANS.offline)}
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
          aria-label={activeModal === 'online' ? 'Personal Mentorship Curriculum Brochure' : 'Slingshot Model Bootcamp Brochure'}
        >
          <div
            className={`prog-modal-dialog ${activeModal === 'online' ? 'modal-theme-blue' : 'modal-theme-gold'}`}
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
                <span className={`card-mode-badge ${activeModal === 'online' ? 'mode-badge-blue' : 'mode-badge-gold'}`}>
                  <span className={`mode-pulse ${activeModal === 'online' ? 'dot-blue' : 'dot-gold'}`} />
                  <span>{activeModal === 'online' ? 'ONLINE · ZOOM' : 'OFFLINE · COIMBATORE'}</span>
                </span>
                <h3 className="modal-title">
                  {activeModal === 'online' ? 'PERSONAL MENTORSHIP' : 'SLINGSHOT MODEL'}
                </h3>
                <span className="modal-price">
                  {activeModal === 'online' ? '₹24,999/- · One-Time Investment' : '₹19,999/- · One-Time Fee'}
                </span>
              </div>
              <button
                type="button"
                className={`modal-close-btn ${activeModal === 'online' ? 'close-btn-blue' : 'close-btn-gold'}`}
                onClick={() => setActiveModal(null)}
                aria-label="Close brochure"
              >
                <span>✕ BACK TO CARDS</span>
              </button>
            </div>

            {/* Modal Body: Scannable Curriculum Document */}
            <div className="prog-modal-scroll">
              {activeModal === 'online' ? (
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
                          <strong>No Limitations for the Sessions:</strong> Continuous mentorship with zero session caps or expiration.
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">
                          <strong>From Basics to Everything:</strong> Complete foundational mechanics through to institutional market execution.
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
                      <div className="doc-item">Basic Market Structure</div>
                      <div className="doc-item">Liquidity</div>
                      <div className="doc-item">Blocks & Gaps</div>
                      <div className="doc-item">Timeframe Alignment</div>
                      <div className="doc-item">SMT</div>
                      <div className="doc-item highlight-blue">Entire ICT Topics Explained</div>
                      <div className="doc-item highlight-blue">Our Own XAUUSD Concepts</div>
                      <div className="doc-item">XAUUSD Characteristics</div>
                      <div className="doc-item">Trading</div>
                      <div className="doc-item">Nasdaq Model</div>
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
                        <div className="doc-row-text">Class Recordings Also Given</div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Get Your Personalised Model</div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-blue">—</span>
                        <div className="doc-row-text">Follow-up From Your Mentor</div>
                      </div>
                    </div>
                  </div>

                  {/* OTHER TOPICS */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num">04</span>
                      <h5 className="doc-sec-title">OTHER TOPICS</h5>
                    </div>
                    <div className="doc-columns-grid compact">
                      <div className="doc-item">Basics Of Forex Market</div>
                      <div className="doc-item">Prop Firms & Their Rules</div>
                      <div className="doc-item">Price Action & Intro to ICT</div>
                      <div className="doc-item">Market Structure Understanding</div>
                      <div className="doc-item">Orderblocks & Types</div>
                      <div className="doc-item">Liquidity & Its Illustrations</div>
                      <div className="doc-item">Premium & Discount</div>
                      <div className="doc-item">SMT Divergence</div>
                      <div className="doc-item">Timeframe Analysis</div>
                      <div className="doc-item">Sessions & Its Behaviour</div>
                      <div className="doc-item full-row">
                        Models For: EURUSD · NAS100 · XAUUSD · AUDUSD · USDJPY
                      </div>
                      <div className="doc-item">Risk Management & Psychology</div>
                      <div className="doc-item">Character Understanding of Pairs</div>
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
                          <strong>Dates:</strong> August 07 — August 14 (8 Days In-Person Intensive)
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Timings:</strong> 10 AM — 6 PM Daily Live Classroom
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Location:</strong> Singanallur, Coimbatore
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Catering:</strong> Lunch Will Be Provided Daily
                        </div>
                      </div>
                      <div className="doc-list-row">
                        <span className="doc-bullet bullet-gold">—</span>
                        <div className="doc-row-text">
                          <strong>Capacity:</strong> 20 Slots Only (Strict Attendance Cap for Dedicated Mentorship)
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
                          ✦ Slingshot Model Plan Sharing WhatsApp Group Access Will Be Given
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OTHER TOPICS */}
                  <div className="doc-section">
                    <div className="doc-section-header">
                      <span className="doc-sec-num num-gold">03</span>
                      <h5 className="doc-sec-title">OTHER TOPICS</h5>
                    </div>
                    <div className="doc-columns-grid compact">
                      <div className="doc-item">Basics Of Forex Market</div>
                      <div className="doc-item">Prop Firms & Their Rules</div>
                      <div className="doc-item">Price Action & Intro to ICT</div>
                      <div className="doc-item">Market Structure Understanding</div>
                      <div className="doc-item">Orderblocks & Types</div>
                      <div className="doc-item">Liquidity & Its Illustrations</div>
                      <div className="doc-item">Premium & Discount</div>
                      <div className="doc-item">SMT Divergence</div>
                      <div className="doc-item">Timeframe Analysis</div>
                      <div className="doc-item">Sessions & Its Behaviour</div>
                      <div className="doc-item full-row">
                        Models For: EURUSD · NAS100 · XAUUSD · AUDUSD · USDJPY
                      </div>
                      <div className="doc-item">Risk Management & Psychology</div>
                      <div className="doc-item">Character Understanding of Pairs</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Conversion Bar with Slider */}
            <div className="prog-modal-footer">
              <SlideToEnroll
                label={activeModal === 'online' ? 'Slide to Enroll' : 'Slide to Reserve Seat'}
                disabled={isBatchLive}
                disabledLabel="Enrollment Closed · Cohort is Live"
                successLabel="Redirecting to Razorpay..."
                colorVariant={activeModal === 'online' ? 'blue' : 'gold'}
                onSuccess={() => {
                  const plan = activeModal === 'online' ? MENTORSHIP_PLANS.online : MENTORSHIP_PLANS.offline
                  setActiveModal(null)
                  handleEnrollClick(plan)
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
                href={`https://wa.me/918637478662?text=Hi%20Praveen,%20I%20have%20completed%20my%20enrollment%20for%20${encodeURIComponent(successPayment.plan.name)}.%20Payment%20ID:%20${encodeURIComponent(successPayment.paymentId)}`}
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
