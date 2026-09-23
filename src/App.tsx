import React, { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StudentPayoutSection } from './components/payout/StudentPayoutSection'
import { StudentFeedbackSection } from './components/feedback/StudentFeedbackSection'
import { StudentVideoSection } from './components/feedback/StudentVideoSection'
import { ProgrammesSection } from './components/programmes/ProgrammesSection'
import { SitePreloader } from './components/common/SitePreloader'
import { FloatingContactOrbit } from './components/common/FloatingContactOrbit'
import { NumberTicker } from './components/common/NumberTicker'
import { InstagramShowcaseSection } from './components/social/InstagramShowcaseSection'

/* ---------------------------------------- Icons ---------------------------------------- */
const Arrow  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h13M13 6l6 6-6 6"/></svg>
const Play   = () => <svg viewBox="0 0 24 24" aria-hidden><path d="m9 6 9 6-9 6V6Z"/></svg>
const Menu   = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7h16M4 12h16M4 17h16"/></svg>
const Close  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18"/></svg>
const Check  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
const Star   = () => <svg viewBox="0 0 24 24" aria-hidden className="star-icon"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.45 0 .08 5.37.08 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.93 11.93 0 0 0 5.86 1.53h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-.1.25-1.25-6.24-3.54-8.44zM12.07 21.9a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.76.99 1-3.66-.23-.38a9.93 9.93 0 0 1-1.52-5.27c0-5.49 4.47-9.96 9.96-9.96 2.66 0 5.16 1.04 7.04 2.92a9.92 9.92 0 0 1 2.92 7.05c0 5.49-4.47 9.91-9.99 9.91zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52-.18-.01-.38-.01-.58-.01-.2 0-.53.08-.8.38-.28.3-1.07 1.05-1.07 2.56 0 1.51 1.1 2.97 1.25 3.17.15.2 2.16 3.3 5.23 4.63.73.32 1.3.51 1.74.65.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z" />
  </svg>
)

const MailIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

const ProgramIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
)

/* ---------------------------------------- Data ---------------------------------------- */
const modules = [
  ['01', 'Read the narrative',   'Map market structure, ranges and intent before you ever look for an entry.'],
  ['02', 'Find the liquidity',   'Learn where orders rest and why price is drawn to particular levels.'],
  ['03', 'Execute with context', 'Turn a high-probability idea into a deliberate, risk-defined execution plan.'],
]

const questions: [string, string][] = [
  [
    'Is Copy Trading Allowed During the Live Sessions?',
    'We do not provide trade calls or signals, and we do not ask anyone to copy our trades. The live sessions are conducted purely for educational purposes, where you can observe how your mentor analyzes the market, applies the strategy, and manages trades in real-time.\n\nIf you happen to have the same market bias and trading idea, your trade may naturally be similar. However, the purpose of the live session is to learn the strategy and understand how it is applied in real market conditions—not to copy trades.'
  ],
  [
    'How Many Days of Live Trading Sessions Are Conducted Each Week?',
    'We aim to achieve 3 profitable trading days each week using our strategy. To give ourselves enough opportunities, the live sessions may run for a maximum of 4 days per week. We will put in our best effort to identify and execute high-quality trading opportunities based on our strategy.'
  ],
  [
    'Are There Any Rules for the Live Trading Sessions?',
    'Yes. We want our live sessions to be interactive and engaging, not just a one-way learning experience. Participants are encouraged to actively share and discuss their market analysis, ideas, and trade bias with the mentor.\n\nPlease avoid staying muted throughout the entire week without participating. Try your best to share your ideas, ask questions, and discuss your analysis with the mentor.\n\nThe goal is simple: We learn, discuss, and grow together as traders.'
  ],
  [
    'How Long Will the Class Recordings Be Available?',
    'The class recordings will be available for approximately 10–12 months. However, around 3 months of consistent learning and practice should be enough to gain a complete understanding of the trading model.\n\nFor security purposes, the recordings will have a personalized watermark with your name. Each video is intended for individual use, so the maximum view count should be 1. If the view count exceeds this, it may indicate that the recording has been shared with someone else.\n\nIn such cases, access to the recordings may be revoked.'
  ],
  [
    'Can I Pass a Funded Account Challenge and Get Payouts Using the Slingshot Strategy?',
    'Yes, it is possible to use the Slingshot Strategy for a funded account, but success requires consistency, discipline, and proper execution.\n\nAfter completing the classes, you will be expected to practice the model and submit the practical chart work requested by your mentor. Our live sessions and mentor support are designed to help you understand the strategy, improve your execution, and work toward your first funded-account payout.'
  ],
  [
    'How Long Will It Take to Understand the Slingshot Strategy?',
    'The Slingshot Strategy can be taught and understood in as little as 2 days. However, understanding the strategy is only the beginning. To become more consistent and confident in executing trades, we strongly recommend attending the live sessions with your mentor for at least 1 month.\n\nDuring this period, you’ll get practical exposure to the strategy in live market conditions, learn how to apply it correctly, and receive important mentor guidance and feedback to improve your execution.'
  ]
]


const videos = [
  {
    id: 'v1',
    ytId: '1ro8otPMUlo',
    title: 'Backtesting vs Forward Testing – Which is Best?',
    tag: 'Strategy',
    desc: 'How to validate trading strategies with live market execution and build genuine confidence.',
  },
  {
    id: 'v2',
    ytId: 'Ka8SEdSN2Ww',
    title: 'Weekly Market Outlook – EURUSD, DXY & XAUUSD',
    tag: 'Market Outlook',
    desc: 'Comprehensive market breakdown framing high-probability setups before the trading week opens.',
  },
  {
    id: 'v3',
    ytId: 'ON1dSoOflEo',
    title: 'What is SMT? – ICT Smart Money Divergence Explained',
    tag: 'ICT Concepts',
    desc: 'How to spot smart money divergence across correlated assets to confirm high-probability entries.',
  },
]


/* ---------------------------------------- Dynamic Mentor Images Loop ---------------------------------------- */
// Center portrait is fixed permanently as /mentor/IMG_6107.PNG (never changes)
const MAIN_CENTER_IMAGE = '/mentor/IMG_6107.PNG'

// Automatically discovers all image files inside public/mentor/ at build & dev time.
const mentorPicGlob = import.meta.glob('/public/mentor/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,avif,AVIF,svg,SVG}')

// Surrounding background images strictly excluding IMG_6107 so center is never repeated in the orbit
const SURROUNDING_IMAGES: string[] = Object.keys(mentorPicGlob)
  .map((k) => k.replace(/^\/public/, ''))
  .filter((src) => !src.includes('6107') && src !== MAIN_CENTER_IMAGE)
  .sort((a, b) => a.localeCompare(b))

function getPhotoLabel(src: string, index: number): string {
  const name = src.split('/').pop()?.replace(/\.[^.]+$/, '') || `Photo ${index + 1}`
  if (name.includes('6107') || name.includes('107')) return 'Lead Mentor'
  if (name.includes('6127') || name.includes('127')) return 'Market Execution'
  if (name.toLowerCase() === 'main') return 'Structure & Delivery'
  if (name.includes('6301')) return 'ICT Frameworks'
  if (name.includes('1860')) return 'Trader Mindset'
  if (name.includes('7278')) return 'Market Mastery'
  if (name.includes('5645')) return 'Chart Breakdown'
  if (name.includes('5651')) return 'Market Liquidity Flow'
  if (name.includes('6056')) return 'Risk Protocol'
  if (name.includes('6057')) return 'Session Analysis'
  if (name.includes('6095')) return 'Precision Entries'
  if (name.includes('8017')) return 'Strategic Growth'
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/* ---------------------------------------- High-Precision Rapid Countdown ---------------------------------------- */
// Aligned with the announced cohort launch date: September 29, 2026 at 19:00 IST
const BATCH_TARGET = new Date('2026-09-29T19:00:00+05:30')

function calcCountdown(target: Date) {
  const diff = target.getTime() - Date.now()
  const isLive = diff <= 0
  const clamped = Math.max(0, diff)
  const days = Math.floor(clamped / 86400000)
  const hours = Math.floor((clamped % 86400000) / 3600000)
  const minutes = Math.floor((clamped % 3600000) / 60000)
  const seconds = Math.floor((clamped % 60000) / 1000)
  const milliseconds = Math.floor((clamped % 1000) / 10)
  return {
    days,
    hours,
    minutes,
    seconds,
    milliseconds,
    isLive,
  }
}
const pad = (n: number) => String(n).padStart(2, '0')

/* ══════════════════════════════════════════════════════════════
   COHORT INVENTORY & ADMISSIONS SEAT CALCULATION
   25 Days rolling admission window · 25 seats capacity
   Decreases by 1 seat per day leading up to class start date
   ══════════════════════════════════════════════════════════════ */
const TOTAL_COHORT_SEATS = 25
const ADMISSION_WINDOW_DAYS = 25

interface CohortSeatStats {
  totalSeats: number
  availableSeats: number
  filledSeats: number
  percentFilled: number
  urgencyLabel: string
  urgencyLevel: 'critical' | 'high' | 'normal' | 'early' | 'live'
  daysLeft: number
  isLive: boolean
}

function computeCohortSeatStats(daysLeft: number, isLive: boolean): CohortSeatStats {
  const totalSeats = TOTAL_COHORT_SEATS

  if (isLive || daysLeft < 0) {
    return {
      totalSeats,
      availableSeats: 0,
      filledSeats: totalSeats,
      percentFilled: 100,
      urgencyLabel: 'BATCH IN SESSION · CLOSED',
      urgencyLevel: 'live',
      daysLeft: 0,
      isLive: true,
    }
  }

  let availableSeats: number
  let filledSeats: number
  let percentFilled: number
  let urgencyLabel: string
  let urgencyLevel: 'critical' | 'high' | 'normal' | 'early'

  if (daysLeft >= ADMISSION_WINDOW_DAYS) {
    // 25+ days before class start: all 25 seats available (Early Admissions Open)
    availableSeats = totalSeats
    filledSeats = 0
    percentFilled = 0
    urgencyLabel = `${totalSeats} SEATS AVAILABLE · ADMISSIONS OPEN`
    urgencyLevel = 'early'
  } else {
    // Within 20-day window: 1 seat decreases per day
    // 19 days remaining -> 19 available (1 filled, 5%)
    // 18 days remaining -> 18 available (2 filled, 10%)
    // ...
    // 2 days remaining -> 2 available (18 filled, 90%)
    // 1 day remaining -> 1 available (19 filled, 95%)
    // 0 days remaining (<24h to class start) -> 1 available (95%)
    availableSeats = Math.max(1, Math.min(totalSeats, daysLeft))
    filledSeats = totalSeats - availableSeats
    percentFilled = Math.round((filledSeats / totalSeats) * 100)

    if (availableSeats <= 2) {
      urgencyLabel = `CRITICAL: ONLY ${availableSeats} SEAT${availableSeats > 1 ? 'S' : ''} LEFT`
      urgencyLevel = 'critical'
    } else if (availableSeats <= 6) {
      urgencyLabel = `HIGH DEMAND · ${availableSeats} SEATS LEFT`
      urgencyLevel = 'high'
    } else {
      urgencyLabel = `${availableSeats} SEATS LEFT · ${percentFilled}% FILLED`
      urgencyLevel = 'normal'
    }
  }

  return {
    totalSeats,
    availableSeats,
    filledSeats,
    percentFilled,
    urgencyLabel,
    urgencyLevel,
    daysLeft,
    isLive: false,
  }
}

interface HeroCountdownProps {
  target?: Date
  onLiveChange?: (live: boolean) => void
}

const HeroCountdownModule = memo(function HeroCountdownModule({
  target = BATCH_TARGET,
  onLiveChange,
}: HeroCountdownProps) {
  const initial = useMemo(() => calcCountdown(target), [target])
  const [isLive, setIsLive] = useState(initial.isLive)
  const [stats, setStats] = useState(() => computeCohortSeatStats(initial.days, initial.isLive))

  const daysRef = useRef<HTMLSpanElement>(null)
  const hoursRef = useRef<HTMLSpanElement>(null)
  const minsRef = useRef<HTMLSpanElement>(null)
  const secsRef = useRef<HTMLSpanElement>(null)
  const msRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isLive) return

    let animId: number
    const tick = () => {
      const cur = calcCountdown(target)
      if (cur.isLive) {
        setIsLive(true)
        onLiveChange?.(true)
        return
      }

      // Ultra-fluid direct DOM text updates with zero React VDOM overhead
      const msStr = pad(cur.milliseconds)
      if (msRef.current && msRef.current.textContent !== msStr) {
        msRef.current.textContent = msStr
      }

      const secStr = pad(cur.seconds)
      if (secsRef.current && secsRef.current.textContent !== secStr) {
        secsRef.current.textContent = secStr
      }

      const minStr = pad(cur.minutes)
      if (minsRef.current && minsRef.current.textContent !== minStr) {
        minsRef.current.textContent = minStr
      }

      const hrStr = pad(cur.hours)
      if (hoursRef.current && hoursRef.current.textContent !== hrStr) {
        hoursRef.current.textContent = hrStr
      }

      const dayStr = pad(cur.days)
      if (daysRef.current && daysRef.current.textContent !== dayStr) {
        daysRef.current.textContent = dayStr
        setStats(computeCohortSeatStats(cur.days, false))
      }

      animId = requestAnimationFrame(tick)
    }

    animId = requestAnimationFrame(tick)
    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [target, isLive, onLiveChange])

  return (
    <div
      className={`hero-countdown-wrap reveal-el dl-2 ${isLive ? 'is-batch-live-wrap' : ''}`}
    >
      <div className="hero-cd-glow" aria-hidden />
      <div className="hero-cd-ring ring-outer" aria-hidden />
      <div className="hero-cd-ring ring-inner" aria-hidden />

      <div
        className={`hero-countdown-card ${isLive ? 'is-batch-live-card' : ''}`}
      >
        {isLive ? (
          /* ---------------------------------------- LIVE BROADCAST SCREEN ---------------------------------------- */
          <div className="hcd-face hcd-face-live">
            <div className="hcd-header">
              <div className="hcd-live-badge">
                <span className="hcd-pulse-dot dot-live-active" />
                <span>COHORT IN SESSION · LIVE</span>
              </div>
              <div className="hcd-status-tag">
                <span className="hcd-tag-dot tag-dot-live" />
                <span>● SESSIONS ACTIVE</span>
              </div>
            </div>

            <div className="hcd-live-screen">
              <div className="hcd-live-hero">
                <div className="hcd-live-radar-wrap" aria-hidden="true">
                  <span className="hcd-radar-center" />
                  <span className="hcd-radar-wave wave-1" />
                  <span className="hcd-radar-wave wave-2" />
                  <span className="hcd-radar-wave wave-3" />
                </div>
                <div className="hcd-live-meta">
                  <h3 className="hcd-live-headline">BATCH IS LIVE NOW</h3>
                  <p className="hcd-live-desc">
                    Live market execution and in-person classroom mentorship sessions are currently underway for active traders in Coimbatore.
                  </p>
                </div>
              </div>

              {/* Operational Status Matrix */}
              <div className="hcd-live-status-matrix">
                <div className="hcd-matrix-chip chip-live">
                  <span className="hcd-chip-dot" />
                  <span>Mentorship: Active</span>
                </div>
                <div className="hcd-matrix-chip chip-closed">
                  <span className="hcd-chip-dot" />
                  <span>Enrollment: Closed</span>
                </div>
              </div>

              {/* Priority Next Batch Strip */}
              <div className="hcd-live-footer">
                <a href="#programmes" className="hcd-live-waitlist-btn">
                  <span>Inquire for Next Batch Waitlist</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* ---------------------------------------- FRONT FACE: CHRONOGRAPH ---------------------------------------- */
          <div className="hcd-face hcd-face-front">
            {/* Terminal Header */}
            <div className="hcd-header">
              <div className="hcd-live-badge">
                <span className="hcd-pulse-dot" />
                <span>LIVE BATCH</span>
              </div>
              <div className="hcd-header-actions">
                <div className="hcd-status-tag">
                  <span className="hcd-tag-dot" />
                  <span>ADMISSIONS OPEN</span>
                </div>
              </div>
            </div>

            {/* 5-Pillar Chronograph Display */}
            <div className="hcd-chronograph">
              {/* Days Pillar */}
              {initial.days > 0 && (
                <>
                  <div className="hcd-chrono-unit">
                    <div className="hcd-digit-box">
                      <span className="hcd-val" ref={daysRef}>{pad(initial.days)}</span>
                    </div>
                    <span className="hcd-lbl">DAYS</span>
                  </div>

                  <div className="hcd-chrono-sep" aria-hidden="true">:</div>
                </>
              )}

              {/* Hours Pillar */}
              <div className="hcd-chrono-unit">
                <div className="hcd-digit-box">
                  <span className="hcd-val" ref={hoursRef}>{pad(initial.hours)}</span>
                </div>
                <span className="hcd-lbl">HOURS</span>
              </div>

              <div className="hcd-chrono-sep" aria-hidden="true">:</div>

              {/* Minutes Pillar */}
              <div className="hcd-chrono-unit">
                <div className="hcd-digit-box">
                  <span className="hcd-val" ref={minsRef}>{pad(initial.minutes)}</span>
                </div>
                <span className="hcd-lbl">MIN</span>
              </div>

              <div className="hcd-chrono-sep" aria-hidden="true">:</div>

              {/* Seconds Pillar */}
              <div className="hcd-chrono-unit">
                <div className="hcd-digit-box">
                  <span className="hcd-val" ref={secsRef}>{pad(initial.seconds)}</span>
                </div>
                <span className="hcd-lbl">SEC</span>
              </div>

              <div className="hcd-chrono-sep hcd-sep-ms" aria-hidden="true">.</div>

              {/* Rapid Milliseconds Pillar */}
              <div className="hcd-chrono-unit hcd-unit-ms">
                <div className="hcd-digit-box hcd-box-ms">
                  <span className="hcd-val hcd-val-ms" ref={msRef}>{pad(initial.milliseconds)}</span>
                </div>
                <div className="hcd-lbl-wrap">
                  <span className="hcd-lbl hcd-lbl-ms">MS</span>
                  <span className="hcd-ms-live-pulse" title="High-frequency live milliseconds" />
                </div>
              </div>
            </div>

            {/* Dynamic Urgency Meter Footer */}
            <div className="hcd-footer">
              <div className="hcd-urgency-strip">
                <div className="hcd-urgency-info">
                  <div className="hcd-urgency-left">
                    <span className="hcd-urgency-text">LIMITED MENTORSHIP SEATS</span>
                    <span className="hcd-seat-badge-pill">
                      {stats.availableSeats} of 25 SLOTS LEFT
                    </span>
                  </div>
                  <div className="hcd-urgency-right">
                    <span className="hcd-urgency-val">{stats.percentFilled}% FILLED</span>
                  </div>
                </div>
                <div className="hcd-urgency-meter">
                  <div
                    className="hcd-urgency-fill"
                    style={{ width: `${Math.max(5, stats.percentFilled)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

interface NavItem {
  href: string
  label: string
  hasDropdown?: boolean
}

const NAV_LINKS: NavItem[] = [
  { href: '#home',            label: 'Home' },
  { href: '#mentor',          label: 'Mentor' },
  { href: '#programmes',      label: 'Programmes' },
  { href: '#student-reviews', label: 'Student Reviews', hasDropdown: true },
  { href: '#instagram',       label: 'Community' },
  { href: '#faq',             label: 'FAQ' },
  { href: '#contact',         label: 'Contact' },
]

const REVIEW_SUB_LINKS = [
  {
    href: '#student-payout',
    title: 'Payout Proofs',
    icon: '✦',
    colorClass: 'icon-emerald',
  },
  {
    href: '#student-stories',
    title: 'Written Feedback',
    icon: '★',
    colorClass: 'icon-gold',
  },
  {
    href: '#student-videos',
    title: 'Video Testimonials',
    icon: '▶',
    colorClass: 'icon-ruby',
  },
]



/* ----------------------------------------
   CONTACT FORM TYPES & CONSTANTS
   ---------------------------------------- */
const TOPIC_OPTIONS = [
  'Online Batch - ICT Mastery (Sep 29)',
  'Personal Mentorship (1-on-1)',
  'Offline Bootcamp - Chennai',
] as const

const EXPERIENCE_OPTIONS = [
  'Beginner (< 6 Mos)',
  'Intermediate (6M - 2 Yrs)',
  'Advanced / Prop Trader',
] as const

interface ContactFormState {
  name: string
  email: string
  phone: string
  message: string
}

interface ContactErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

const INITIAL_CONTACT_FORM: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

/* ----------------------------------------
   APP
   ---------------------------------------- */
function App() {
  const [contactData, setContactData] = useState<ContactFormState>(INITIAL_CONTACT_FORM)
  const [selectedTopic, setSelectedTopic] = useState<string>('Online Batch - ICT Mastery (Sep 29)')
  const [selectedExp, setSelectedExp] = useState<string>('Intermediate (6M - 2 Yrs)')

  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [contactTouched, setContactTouched] = useState<Record<keyof ContactFormState, boolean>>({
    name: false,
    email: false,
    phone: false,
    message: false,
  })
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [contactStatusMsg, setContactStatusMsg] = useState('')

  const handleSelectTopic = (topic: string) => {
    setSelectedTopic(topic)
    setContactData(prev => {
      if (!prev.message || prev.message.startsWith('Interested in:') || prev.message.startsWith('Enquiring for enrollment in:')) {
        return {
          ...prev,
          message: `Interested in: ${topic}. `,
        }
      }
      return prev
    })
  }

  const handleEnroll = (programmeName: string) => {
    const enrollMsg = `Enquiring for enrollment in: ${programmeName}`
    setSelectedTopic(programmeName)
    setContactData(prev => ({
      ...prev,
      message: enrollMsg,
    }))
    setContactTouched(prev => ({ ...prev, message: true }))
    setContactErrors(prev => ({ ...prev, message: undefined }))
    if (contactStatus === 'success') {
      setContactStatus('idle')
    }

    const contactEl = document.getElementById('contact')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        const nameInput = document.getElementById('cn-name') as HTMLInputElement | null
        nameInput?.focus()
      }, 700)
    }
  }

  const [menuOpen,      setMenuOpen]      = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [activeQs,      setActiveQs]      = useState<number[]>([])
  const [showAllFaqs,   setShowAllFaqs]   = useState(false)
  const [annDismissed,  setAnnDismissed]  = useState(false)
  const [reviewsDropdownOpen, setReviewsDropdownOpen] = useState(false)

  const handleToggleFaqs = () => {
    setShowAllFaqs(prev => {
      const next = !prev
      if (!next) {
        const faqEl = document.getElementById('faq')
        if (faqEl) {
          const rect = faqEl.getBoundingClientRect()
          if (rect.top < -80) {
            faqEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }
      }
      return next
    })
  }

  /* ---------------------------------------- Live Batch Countdown & State ---------------------------------------- */
  const [isBatchLive, setIsBatchLive] = useState(() => Date.now() >= BATCH_TARGET.getTime())

  useEffect(() => {
    if (isBatchLive) return
    const interval = setInterval(() => {
      if (Date.now() >= BATCH_TARGET.getTime()) {
        setIsBatchLive(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isBatchLive])

  /* ---------------------------------------- Surrounding Orbiting Images Mechanism ---------------------------------------- */
  // Preload all surrounding images in memory
  useEffect(() => {
    SURROUNDING_IMAGES.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  // 6 orbital slots initialized with the first 6 unique images
  const [slotImages, setSlotImages] = useState<string[]>(() => {
    return SURROUNDING_IMAGES.slice(0, 6)
  })

  // Pointer tracking next unique candidate from pool
  const nextPoolIndexRef = useRef(6)

  // Callback triggered ONLY when an orbital slot finishes its 18s animation cycle (at 100% / 0%).
  // At 100% / 0%, the slot element is at opacity: 0, scale: 0.15, translate(-50%, -50%) deep inside behind the center.
  // The swap happens when the slot is completely invisible.
  // The newly assigned image will then smoothly emerge from IN to OUT, strictly eliminating any pop in the outer orbit!
  const handleSlotIteration = useCallback((slotIndex: number) => {
    if (SURROUNDING_IMAGES.length <= 6) return
    setSlotImages((prev) => {
      // Collect images currently assigned to all OTHER slots to strictly prevent duplicate images on screen
      const currentlyUsed = new Set(prev.filter((_, idx) => idx !== slotIndex))

      let candidateIdx = nextPoolIndexRef.current % SURROUNDING_IMAGES.length
      let attempts = 0
      while (currentlyUsed.has(SURROUNDING_IMAGES[candidateIdx]) && attempts < SURROUNDING_IMAGES.length) {
        candidateIdx = (candidateIdx + 1) % SURROUNDING_IMAGES.length
        attempts++
      }

      nextPoolIndexRef.current = (candidateIdx + 1) % SURROUNDING_IMAGES.length
      const updated = [...prev]
      updated[slotIndex] = SURROUNDING_IMAGES[candidateIdx]
      return updated
    })
  }, [])

  /* ---------------------------------------- Global Button Liquid Drop Entry Position ---------------------------------------- */
  useEffect(() => {
    const handleBtnMouseEnter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.button, .button-primary, .btn-enroll, #hero-cta, #cn-submit') as HTMLElement | null
      if (!target) return
      const rect = target.getBoundingClientRect()
      const x = Math.max(16, Math.min(rect.width - 16, e.clientX - rect.left))
      target.style.setProperty('--drop-x', `${x}px`)
    }
    document.addEventListener('mouseenter', handleBtnMouseEnter, true)
    return () => document.removeEventListener('mouseenter', handleBtnMouseEnter, true)
  }, [])

  /* ---------------------------------------- Header glass on scroll (state-guarded for zero re-render overhead) ---------------------------------------- */
  useEffect(() => {
    let prev = false
    const h = () => {
      const isScrolled = window.scrollY > 40
      if (isScrolled !== prev) {
        prev = isScrolled
        setScrolled(isScrolled)
      }
    }
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  /* ---------------------------------------- Smooth Anchor Scroll (preserves 100% native 120fps wheel/trackpad scrolling) ---------------------------------------- */
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href === '#') return
      if (href === '#top' || href === '#home') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const el = document.querySelector(href)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [])

  /* ---------------------------------------- Active section tracker ---------------------------------------- */
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-section]')
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection((e.target as HTMLElement).dataset.section ?? '') }),
      { threshold: 0.3 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* ---------------------------------------- Scroll-reveal ---------------------------------------- */
  useEffect(() => {
    const sel = '.reveal-el'
    const targets = document.querySelectorAll<HTMLElement>(sel)
    // Mark immediately so no content is ever stuck or delayed
    targets.forEach(t => t.classList.add('in-view'))
  }, [])


  /* ---------------------------------------- Contact Validation & Delivery ---------------------------------------- */
  const validateField = (name: keyof ContactFormState, value: string): string | undefined => {
    const trimmed = value.trim()
    if (name === 'name') {
      if (!trimmed) return 'Please enter your full name'
      if (trimmed.length < 2) return 'Name must be at least 2 characters'
      if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name contains invalid characters'
    }
    if (name === 'email') {
      if (!trimmed) return 'Please enter your email address'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return 'Please enter a valid email address (e.g. name@example.com)'
    }
    if (name === 'phone') {
      if (!trimmed) return 'Please enter your phone / WhatsApp number'
      if (!/^[+0-9\s-]{7,18}$/.test(trimmed)) {
        return 'Please enter a valid phone number (e.g. +91 98765 43210)'
      }
    }
    if (name === 'message') {
      if (!trimmed) return 'Please share your trading goals or questions'
      if (trimmed.length < 5) return 'Message must be at least 5 characters'
    }
    return undefined
  }

  const validateAll = (data: ContactFormState): ContactErrors => {
    const errs: ContactErrors = {}
    const nameErr = validateField('name', data.name)
    if (nameErr) errs.name = nameErr
    const emailErr = validateField('email', data.email)
    if (emailErr) errs.email = emailErr
    const phoneErr = validateField('phone', data.phone)
    if (phoneErr) errs.phone = phoneErr
    const msgErr = validateField('message', data.message)
    if (msgErr) errs.message = msgErr
    return errs
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof ContactFormState
    setContactData(prev => ({ ...prev, [fieldName]: value }))
    if (contactTouched[fieldName]) {
      const err = validateField(fieldName, value)
      setContactErrors(prev => ({ ...prev, [fieldName]: err }))
    }
  }

  const handleContactBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldName = name as keyof ContactFormState
    setContactTouched(prev => ({ ...prev, [fieldName]: true }))
    const err = validateField(fieldName, value)
    setContactErrors(prev => ({ ...prev, [fieldName]: err }))
  }

  const handleResetForm = () => {
    setContactData(INITIAL_CONTACT_FORM)
    setContactErrors({})
    setContactTouched({ name: false, email: false, phone: false, message: false })
    setSelectedTopic('Online Batch - ICT Mastery (Sep 29)')
    setSelectedExp('Intermediate (6M - 2 Yrs)')
    setContactStatus('idle')
    setContactStatusMsg('')
  }

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Mentorship Enquiry: ${contactData.name || 'Trader'} [${selectedTopic}]`)
    const body = encodeURIComponent(
      `Name: ${contactData.name || ''}\nEmail: ${contactData.email || ''}\nPhone: ${contactData.phone || 'N/A'}\nTopic: ${selectedTopic}\nExperience: ${selectedExp}\n\nTrading Goals / Message:\n${contactData.message || ''}\n\n---\nSent via Pravyn ICT Mentorship Portal`
    )
    return `mailto:pravyntraderweb@gmail.com?subject=${subject}&body=${body}`
  }, [contactData, selectedTopic, selectedExp])

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched to display errors if any
    setContactTouched({
      name: true,
      email: true,
      phone: true,
      message: true,
    })

    const errors = validateAll(contactData)
    setContactErrors(errors)

    if (Object.keys(errors).length > 0) {
      if (errors.name) document.getElementById('cn-name')?.focus()
      else if (errors.email) document.getElementById('cn-email')?.focus()
      else if (errors.phone) document.getElementById('cn-phone')?.focus()
      else if (errors.message) document.getElementById('cn-msg')?.focus()
      return
    }

    setContactStatus('submitting')
    setContactStatusMsg('')

    try {
      const payload = {
        name: contactData.name.trim(),
        email: contactData.email.trim(),
        phone: contactData.phone.trim() || 'Not provided',
        topic: selectedTopic,
        experience: selectedExp,
        message: contactData.message.trim(),
        _subject: `New Mentorship Enquiry from ${contactData.name.trim()} [${selectedTopic}]`,
        _replyto: contactData.email.trim(),
        _template: 'table',
        _captcha: 'false',
      }

      // Token generated by FormSubmit for pravyntraderweb@gmail.com
      const FORMSUBMIT_TOKEN = 'c595fa64ba5a0d5f8165c812c24fe8d5'

      // Primary attempt: Secure obfuscated token endpoint (works across any hosting platform once activated)
      let res: Response | null = null
      let json: any = null

      try {
        res = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        json = await res.json().catch(() => null)
      } catch (tokenErr) {
        console.warn('Token endpoint fetch failed, trying direct endpoint:', tokenErr)
      }

      // Secondary fallback: Direct email endpoint if token failed
      if (!res || (!res.ok && !(json && (json.success === 'true' || json.success === true || json.message?.includes('Activation'))))) {
        try {
          res = await fetch('https://formsubmit.co/ajax/pravyntraderweb@gmail.com', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
          })
          json = await res.json().catch(() => null)
        } catch (emailErr) {
          console.error('Fallback endpoint fetch failed:', emailErr)
        }
      }

      // Check for success or activation notice
      const isSuccess = res && (res.ok || (json && (json.success === 'true' || json.success === true)))
      const isActivationPending = json && typeof json.message === 'string' && json.message.includes('Activation')

      if (isSuccess || isActivationPending) {
        setContactStatus('success')
        if (isActivationPending) {
          setContactStatusMsg('Enquiry dispatched! FormSubmit sent an activation link to pravyntraderweb@gmail.com. Please click "Activate Form" in your email to enable instant automated delivery.')
        } else {
          setContactStatusMsg('Your message has been delivered directly to pravyntraderweb@gmail.com. Mentor Praveen will review your trading background and reply within 24 hours.')
        }
      } else {
        throw new Error(json?.message || 'Server did not acknowledge receipt')
      }
    } catch (err: any) {
      console.error('Email transmission error:', err)
      setContactStatus('error')
      setContactStatusMsg('Unable to transmit automatically over network. Please dispatch directly via your email app or WhatsApp.')
    }
  }

  return (
    <main>
      <SitePreloader />
      <div className="mesh-bg" aria-hidden />
      <div className="orb orb-1" aria-hidden /><div className="orb orb-2" aria-hidden /><div className="orb orb-3" aria-hidden />

      {/* ---------------------------------------- ANNOUNCEMENT BAR ---------------------------------------- */}
      {!annDismissed && (
        <div className="ann-bar" role="banner">
          <div className="ann-ticker-wrap">
            <div className="ann-ticker-track">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="ann-ticker-group" aria-hidden={idx > 0}>
                  <span className="ann-live">
                    <span className="live-dot" />LIVE
                  </span>
                  <span className="ann-text">
                    Next Batch Starts <strong>September 29, 2026</strong>
                  </span>
                  <span className="ann-divider">✦</span>
                </div>
              ))}
            </div>
          </div>
          <button className="ann-close" onClick={() => setAnnDismissed(true)} aria-label="Dismiss"><Close /></button>
        </div>
      )}

      {/* ---------------------------------------- HEADER ---------------------------------------- */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}${annDismissed ? ' no-ann' : ''}`}>
        <a className="brand" href="#home" aria-label="Pravyn ICT — Trading Leaders Community">
          <img src="/logo/logo.png" alt="Trading Leaders Community Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-name"><span>PRAVYN</span><em>ICT</em></span>
            <span className="brand-sub">TRADING LEADERS COMMUNITY</span>
          </div>
        </a>

        <nav className={`nav${menuOpen ? ' nav-open' : ''}`} role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label, hasDropdown }) => {
            if (hasDropdown) {
              const isProofActive =
                activeSection === 'student-reviews' ||
                activeSection === 'student-payout' ||
                activeSection === 'student-stories' ||
                activeSection === 'student-videos'

              return (
                <div
                  key={href}
                  className={`nav-dropdown-wrap ${reviewsDropdownOpen ? 'open' : ''}`}
                  onMouseEnter={() => setReviewsDropdownOpen(true)}
                  onMouseLeave={() => setReviewsDropdownOpen(false)}
                >
                  <a
                    href={href}
                    className={`nav-link-dropdown-trigger ${isProofActive ? 'nav-active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setReviewsDropdownOpen((prev) => !prev)
                    }}
                    aria-haspopup="true"
                    aria-expanded={reviewsDropdownOpen}
                  >
                    <span>{label}</span>
                    <span className="nav-caret" aria-hidden="true">▾</span>
                  </a>

                  {/* Dropdown Popover */}
                  <div className="nav-dropdown-menu" role="menu">
                    <div className="nav-dropdown-head">
                      <span className="ndh-dot" />
                      <span className="ndh-title">STUDENT PROOF CATEGORIES</span>
                    </div>
                    {REVIEW_SUB_LINKS.map((sub) => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        className="nav-dropdown-item"
                        role="menuitem"
                        onClick={() => {
                          setReviewsDropdownOpen(false)
                          setMenuOpen(false)
                        }}
                      >
                        <span className={`ndi-icon ${sub.colorClass || ''}`} aria-hidden="true">{sub.icon}</span>
                        <span className="ndi-title">{sub.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )
            }

            return (
              <a
                key={href}
                href={href}
                className={activeSection === href.slice(1) ? 'nav-active' : ''}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            )
          })}
        </nav>

        <div className="header-right">
          <a className="btn-enroll" href="#programmes">{isBatchLive ? 'Waitlist' : 'Enroll'}</a>
          <button
            className="menu-button"
            onClick={() => setMenuOpen((m) => {
              if (!m) setReviewsDropdownOpen(false)
              return !m
            })}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </header>

      {/* ---------------------------------------- HERO / HOME ---------------------------------------- */}
      <section className="hero" id="home" data-section="home">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="hero-badge reveal-el">
              <span className="badge-dot" />MENTORSHIP FOR SERIOUS TRADERS
            </div>
            <h1 className="reveal-el dl-1">
              Your Live Trading <span className="h1-em">Experience</span>
              <span className="h1-sub">Starts Here.</span>
            </h1>
            <p className="hero-sub reveal-el dl-2">
              Master advanced market structure, live liquidity delivery, and disciplined execution with real-time mentorship designed for serious traders.
            </p>
            <div className="hero-actions reveal-el dl-3">
              <a
                className={`button button-primary glow-heavy ${isBatchLive ? 'is-waitlist-mode' : ''}`}
                href="#programmes"
                id="hero-cta"
              >
                <span className="btn-text">{isBatchLive ? 'Join Next Batch Waitlist' : 'Reserve your seat'}</span> <Arrow />
              </a>
            </div>
          </div>

          <HeroCountdownModule target={BATCH_TARGET} onLiveChange={setIsBatchLive} />
        </div>
      </section>

      {/* ---------------------------------------- TICKER RIBBON ---------------------------------------- */}
      <div className="ticker" aria-label="Course topics">
        <div className="ticker-track">
          {[
            { text: 'MARKET STRUCTURE', color: 'dia-gold' },
            { text: 'LIQUIDITY CONCEPTS', color: 'dia-emerald' },
            { text: 'ICT METHODOLOGY', color: 'dia-cyan' },
            { text: 'SMART MONEY', color: 'dia-violet' },
            { text: 'RISK DISCIPLINE', color: 'dia-coral' },
            { text: 'ORDER BLOCKS', color: 'dia-gold' },
            { text: 'REAL MARKET CONTEXT', color: 'dia-emerald' },
            { text: 'FVG & IMBALANCE', color: 'dia-cyan' },
          ].map((t, i) => (
            <span key={i}><b className={t.color}>◆</b>{t.text}</span>
          ))}
          {[
            { text: 'MARKET STRUCTURE', color: 'dia-gold' },
            { text: 'LIQUIDITY CONCEPTS', color: 'dia-emerald' },
            { text: 'ICT METHODOLOGY', color: 'dia-cyan' },
            { text: 'SMART MONEY', color: 'dia-violet' },
            { text: 'RISK DISCIPLINE', color: 'dia-coral' },
            { text: 'ORDER BLOCKS', color: 'dia-gold' },
            { text: 'REAL MARKET CONTEXT', color: 'dia-emerald' },
            { text: 'FVG & IMBALANCE', color: 'dia-cyan' },
          ].map((t, i) => (
            <span key={`d${i}`} aria-hidden><b className={t.color}>◆</b>{t.text}</span>
          ))}
        </div>
      </div>

      {/* ---------------------------------------- MENTOR ---------------------------------------- */}
      <section className="mentor-section" id="mentor" data-section="mentor">
        <div className="mentor-visual reveal-el">
          {/*
            Depth-emergence loop — ALL 6 unique browser-compatible photos:
            IMG_1860, IMG_5484, IMG_6107, IMG_6127, IMG_6301, IMG_7278
            Each image gets its own orbital slot (tl, tr, br, bl, ml, mr).
            main.PNG stays fixed as the crisp center portrait.
          */}
          <div className="mav-depth-stage" aria-hidden>
            <div className="mav-core-glow" />
            <div className="mav-bg-grid" />
            <div className="mav-orbit mav-orbit-a" />
            <div className="mav-orbit mav-orbit-b" />

            {/*
              Dynamic outer orbital background images:
              Iterates folder images, strictly excluding center image to guarantee ZERO repetition.
              Swaps image ONLY when the slot is deep inside behind center at 0 opacity,
              ensuring every image smoothly emerges from IN to OUT, stays clear, and returns from OUT to IN!
            */}
            {slotImages.map((src, i) => (
              <img
                key={`mav-slot-${i}`}
                src={src}
                alt=""
                className={`mav-dp mav-dp-${i + 1}`}
                onAnimationIteration={() => handleSlotIteration(i)}
                loading="eager"
                decoding="async"
                onLoad={(e) => {
                  e.currentTarget.classList.add('is-loaded')
                }}
                ref={(el) => {
                  if (el && el.complete && el.naturalWidth > 0) {
                    el.classList.add('is-loaded')
                  }
                }}
              />
            ))}
          </div>

          {/* Center portrait — Fixed permanently as IMG_6107.PNG */}
          <div className="mav-hero-wrap">
            <div className="mav-center-portal">
              <div className="mav-ring mav-ring-outer" aria-hidden />
              <div className="mav-ring mav-ring-inner" aria-hidden />
              <img
                className="mav-hero-portrait"
                src={MAIN_CENTER_IMAGE}
                alt="Pravyn — Lead Mentor"
              />
            </div>
          </div>

          {/* Stat strip */}
          <div className="mentor-stat-strip">
            <div className="mentor-stat-item-students">
              <strong>
                <NumberTicker value={2000} suffix="+" />
              </strong>
              <span className="mentor-stat-label">Students Trained</span>
            </div>
            <div className="mentor-stat-item-rating">
              <strong>
                <NumberTicker value={4.9} decimalPlaces={1} />★
              </strong>
              <span className="mentor-stat-label">Rating</span>
            </div>
            <div className="mentor-stat-item-exp">
              <strong>
                <NumberTicker value={6} suffix="+" />
              </strong>
              <span className="mentor-stat-label">Years Experience</span>
            </div>
          </div>
        </div>

        <div className="mentor-content">

          <p className="section-tag section-tag-violet reveal-el"><span className="tag-dot" />01 / YOUR MENTOR</p>
          <h2 className="reveal-el">Built for the trader<br />you intend <em>to become.</em></h2>
          <p className="reveal-el">Pravyn ICT is guided by an experienced practitioner focused on market structure, liquidity and precision price action. Every session is grounded in real execution logic, clear frameworks and accountability—not predictions.</p>
          <blockquote className="reveal-el">"No signals. No jackpots. No false promises."</blockquote>
          <a className="text-link reveal-el" href="#programmes">Start your journey <Arrow /></a>
        </div>
      </section>
      {/* ---------------------------------------- PROGRAMMES ---------------------------------------- */}
      <ProgrammesSection isBatchLive={isBatchLive} onEnroll={handleEnroll} />

      {/* ---------------------------------------- UNIFIED STUDENT REVIEWS & PROOF HUB ---------------------------------------- */}
      <div id="student-reviews" className="student-reviews-hub" data-section="student-reviews">
        {/* Subcategory 1: Payout Proofs 3D Sphere */}
        <StudentPayoutSection />

        {/* Subcategory 2: Written Feedback 3D Card Deck */}
        <StudentFeedbackSection />

        {/* Subcategory 3: Student Video Testimonials */}
        <StudentVideoSection />
      </div>

      {/* ---------------------------------------- YOUTUBE ---------------------------------------- */}
      <section className="videos-section" id="videos" data-section="videos">
        <div className="videos-header reveal-el">
          <p className="section-tag section-tag-ruby"><span className="tag-dot" />FREE RESOURCES</p>
          <h2>Free Video <em>Lessons.</em></h2>
          <p>Explore free market breakdowns, strategy sessions, and trading insights.</p>
        </div>
        <div className="video-grid">
          {videos.map((v) => {
            return (
              <a
                className="vid-card reveal-el"
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.ytId}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch: ${v.title}`}
              >
                <div className="vid-thumb">
                  <img
                    className="vid-yt-thumb"
                    src={`https://img.youtube.com/vi/${v.ytId}/maxresdefault.jpg`}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${v.ytId}/hqdefault.jpg` }}
                    alt={v.title}
                    loading="lazy"
                  />
                  <div className="vid-overlay" />
                  <span className="vid-yt-badge">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
                    YouTube
                  </span>
                </div>
                <div className="vid-info">
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </div>
              </a>
            )
          })}
        </div>
      </section>

      {/* ---------------------------------------- INSTAGRAM COMMUNITY SHOWCASE ---------------------------------------- */}
      <InstagramShowcaseSection />

      {/* ---------------------------------------- FAQ ---------------------------------------- */}
      <section className="faq-section" id="faq" data-section="faq">
        <div className="faq-head reveal-el">
          <p className="section-tag section-tag-blue"><span className="tag-dot" />09 / FAQ</p>
          <h2>Common<br /><em>questions.</em></h2>
        </div>
        <div className="faq-list">
          {/* Top 3 Persistent Questions */}
          {questions.slice(0, 3).map(([q, a], i) => {
            const isActive = activeQs.includes(i)
            return (
              <article className={`faq-item${isActive ? ' active' : ''}`} key={i}>
                <button
                  onClick={() => setActiveQs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                  id={`faq-${i}`}
                  aria-expanded={isActive}
                >
                  <span className="faq-q-num">{String(i+1).padStart(2,'0')}</span>
                  <span className="faq-q-text">{q}</span>
                  <span className="faq-toggle">{isActive ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer${isActive ? ' open' : ''}`}>
                  {a.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>
              </article>
            )
          })}

          {/* Smooth Collapsible Extra Questions */}
          <div className={`faq-extra-accordion ${showAllFaqs ? 'is-open' : ''}`} aria-hidden={!showAllFaqs}>
            <div className="faq-extra-inner">
              {questions.slice(3).map(([q, a], sliceIdx) => {
                const i = sliceIdx + 3
                const isActive = activeQs.includes(i)
                return (
                  <article className={`faq-item${isActive ? ' active' : ''}`} key={i}>
                    <button
                      onClick={() => setActiveQs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                      id={`faq-${i}`}
                      aria-expanded={isActive}
                    >
                      <span className="faq-q-num">{String(i+1).padStart(2,'0')}</span>
                      <span className="faq-q-text">{q}</span>
                      <span className="faq-toggle">{isActive ? '−' : '+'}</span>
                    </button>
                    <div className={`faq-answer${isActive ? ' open' : ''}`}>
                      {a.split('\n\n').map((paragraph, pIdx) => (
                        <p key={pIdx}>{paragraph}</p>
                      ))}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          {questions.length > 3 && (
            <div className="faq-view-more-wrap">
              <button
                type="button"
                className={`faq-link-btn ${showAllFaqs ? 'is-expanded' : ''}`}
                onClick={handleToggleFaqs}
                aria-expanded={showAllFaqs}
              >
                <span className="faq-link-text">{showAllFaqs ? 'View less' : 'View more'}</span>
                <span className="faq-link-icon" aria-hidden="true">{showAllFaqs ? '↑' : '↓'}</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------- CONTACT ---------------------------------------- */}
      <section className="contact-section" id="contact" data-section="contact">
        {/* Left Column: Heading & Concise Intro */}
        <div className="contact-desk-column reveal-el">
          <div className="contact-desk-intro">
            <p className="section-tag section-tag-emerald"><span className="tag-dot" />10 / GET STARTED</p>
            <h2>Take the first<br /><em>intentional step.</em></h2>
            <p className="contact-desk-lead">
              Submit your details below for batch admission review.
            </p>
          </div>
        </div>

        {/* Right Column: Balanced Form Card OR Success Confirmation */}
        {contactStatus === 'success' ? (
          <div className="contact-receipt-card reveal-el" role="status" aria-live="polite">
            <div className="receipt-icon-core">
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3>Message Sent Successfully</h3>
            <p className="receipt-lead">
              {contactStatusMsg || (
                <>Thank you, <strong>{contactData.name}</strong>. Your message was received and Praveen will get back to you within 24 hours.</>
              )}
            </p>

            <div className="receipt-fasttrack-card">
              <div className="rft-content">
                <strong>Need a Faster Reply?</strong>
                <p>Chat directly with Praveen on WhatsApp with your enquiry.</p>
              </div>
              <a
                href={`https://wa.me/918637478662?text=Hi%20Praveen,%20I%20just%20submitted%20my%20enquiry%20for%20${encodeURIComponent(selectedTopic)}.%20My%20name%20is%20${encodeURIComponent(contactData.name)}.`}
                target="_blank"
                rel="noreferrer"
                className="button button-primary rft-btn"
              >
                <WhatsAppIcon />
                <span>Chat on WhatsApp</span>
                <Arrow />
              </a>
            </div>

            <button
              type="button"
              className="button button-ghost receipt-reset-btn"
              onClick={handleResetForm}
            >
              <span>Send another message</span>
              <Arrow />
            </button>
          </div>
        ) : (
          <div className="contact-form-card reveal-el">
            <div className="contact-card-head">
              <div className="cch-title-wrap">
                <span className="cch-dot" />
                <h3>Mentorship Enquiry</h3>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} noValidate className="contact-actual-form">
              {/* Row 1: Name & Email */}
              <div className="contact-form-row">
                <div className="terminal-input-wrap">
                  <label htmlFor="cn-name">
                    <span>Your Name</span>
                  </label>
                  <div className="input-icon-shell">
                    <input
                      type="text"
                      name="name"
                      id="cn-name"
                      value={contactData.name}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      placeholder="e.g. Praveen"
                      autoComplete="name"
                      disabled={contactStatus === 'submitting'}
                      className={
                        contactTouched.name && contactErrors.name
                          ? 'is-invalid'
                          : ''
                      }
                    />
                  </div>
                  {contactTouched.name && contactErrors.name && (
                    <p className="field-error" role="alert">
                      <span className="field-error-icon">⚠</span>
                      {contactErrors.name}
                    </p>
                  )}
                </div>

                <div className="terminal-input-wrap">
                  <label htmlFor="cn-email">
                    <span>Email Address</span>
                  </label>
                  <div className="input-icon-shell">
                    <input
                      type="email"
                      name="email"
                      id="cn-email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={contactStatus === 'submitting'}
                      className={
                        contactTouched.email && contactErrors.email
                          ? 'is-invalid'
                          : ''
                      }
                    />
                  </div>
                  {contactTouched.email && contactErrors.email && (
                    <p className="field-error" role="alert">
                      <span className="field-error-icon">⚠</span>
                      {contactErrors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Phone & Topic */}
              <div className="contact-form-row">
                <div className="terminal-input-wrap">
                  <label htmlFor="cn-phone">
                    <span>Phone / WhatsApp</span>
                  </label>
                  <div className="input-icon-shell">
                    <input
                      type="tel"
                      name="phone"
                      id="cn-phone"
                      required
                      value={contactData.phone}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      disabled={contactStatus === 'submitting'}
                      className={
                        contactTouched.phone && contactErrors.phone
                          ? 'is-invalid'
                          : ''
                      }
                    />
                  </div>
                  {contactTouched.phone && contactErrors.phone && (
                    <p className="field-error" role="alert">
                      <span className="field-error-icon">⚠</span>
                      {contactErrors.phone}
                    </p>
                  )}
                </div>

                <div className="terminal-input-wrap">
                  <label htmlFor="cn-topic">
                    <span>Interested Programme</span>
                  </label>
                  <div className="input-icon-shell select-shell">
                    <select
                      id="cn-topic"
                      name="topic"
                      value={selectedTopic}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value)
                        handleSelectTopic(e.target.value)
                      }}
                      disabled={contactStatus === 'submitting'}
                      className="contact-select"
                    >
                      {TOPIC_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                      {!TOPIC_OPTIONS.includes(selectedTopic as any) && (
                        <option value={selectedTopic}>{selectedTopic}</option>
                      )}
                    </select>
                    <span className="select-chevron" aria-hidden="true">▾</span>
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="terminal-input-wrap">
                <label htmlFor="cn-msg">
                  <span>Your Message</span>
                </label>
                <div className="input-icon-shell textarea-shell">
                  <textarea
                    name="message"
                    id="cn-msg"
                    rows={3}
                    value={contactData.message}
                    onChange={handleContactChange}
                    onBlur={handleContactBlur}
                    placeholder="Tell us about your trading experience and goals…"
                    disabled={contactStatus === 'submitting'}
                    className={
                      contactTouched.message && contactErrors.message
                        ? 'is-invalid'
                        : ''
                    }
                  />
                </div>
                {contactTouched.message && contactErrors.message && (
                  <p className="field-error" role="alert">
                    <span className="field-error-icon">⚠</span>
                    {contactErrors.message}
                  </p>
                )}
              </div>

              {/* Error Banner */}
              {contactStatus === 'error' && (
                <div className="cn-error-banner" role="alert">
                  <div className="cn-error-header">
                    <span className="cn-error-icon">⚠</span>
                    <span>{contactStatusMsg || 'Network transmission could not be completed.'}</span>
                  </div>
                  <div className="cn-error-actions">
                    <a
                      href={mailtoHref}
                      className="cn-mailto-fallback-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ✉ Open in Mail Client (Direct to pravyntraderweb@gmail.com)
                    </a>
                    <button
                      type="button"
                      className="cn-retry-btn"
                      onClick={handleContactSubmit as any}
                    >
                      Retry Send
                    </button>
                  </div>
                </div>
              )}

              {/* Clean Submit Button - Redesigned compact & matching hero CTA */}
              <button
                className="button button-primary terminal-submit-btn"
                type="submit"
                id="cn-submit"
                disabled={contactStatus === 'submitting'}
              >
                {contactStatus === 'submitting' ? (
                  <>
                    <span className="cn-spinner" aria-hidden />
                    <span className="btn-text">Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-text">Submit</span>
                    <Arrow />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </section>

      {/* ---------------------------------------- FOOTER ---------------------------------------- */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <a className="brand footer-brand" href="#home" aria-label="Pravyn ICT — Trading Leaders Community">
              <img src="/logo/logo.png" alt="Trading Leaders Community Logo" className="brand-logo" />
              <div className="brand-text">
                <span className="brand-name"><span>PRAVYN</span><em>ICT</em></span>
                <span className="brand-sub">TRADING LEADERS COMMUNITY</span>
              </div>
            </a>
          </div>
          <nav className="footer-nav" aria-label="Footer Navigation">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="footer-link">
                <span className="footer-link-dot" aria-hidden="true" />
                <span>{l.label}</span>
              </a>
            ))}
          </nav>
          <div className="footer-bottom">
            <p className="footer-copy">© {new Date().getFullYear()} PRAVYN ICT · Trading Leaders Community. Educational content only.</p>
          </div>
        </div>
      </footer>

      {/* ---------------------------------------- MOBILE STICKY CTA ---------------------------------------- */}
      <div className="mobile-cta" aria-hidden="true">
        <a href="#programmes" className="button button-primary">Enroll in Programmes <Arrow /></a>
      </div>

      {/* ---------------------------------------- PERSISTENT FLOATING CONTACT ORBIT ---------------------------------------- */}
      <FloatingContactOrbit />
    </main>
  )
}

export default App
