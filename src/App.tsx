import React, { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StudentPayoutSection } from './components/payout/StudentPayoutSection'
import { StudentFeedbackSection } from './components/feedback/StudentFeedbackSection'
import { StudentVideoSection } from './components/feedback/StudentVideoSection'
import { ProgrammesSection } from './components/programmes/ProgrammesSection'
import { SitePreloader } from './components/common/SitePreloader'

/* ---------------------------------------- Icons ---------------------------------------- */
const Arrow  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h13M13 6l6 6-6 6"/></svg>
const Play   = () => <svg viewBox="0 0 24 24" aria-hidden><path d="m9 6 9 6-9 6V6Z"/></svg>
const Menu   = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7h16M4 12h16M4 17h16"/></svg>
const Close  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18"/></svg>
const Bag    = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M5 8h14l-1 12H6L5 8ZM9 9V6a3 3 0 0 1 6 0v3"/></svg>
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

const questions = [
  ['Who is this mentorship for?',     'For committed traders who want a structured understanding of ICT and Smart Money Concepts—from beginners to traders ready to replace random entries with a process.'],
  ['Will I receive trading signals?', 'No. Pravyn ICT is education-first: we teach the reasoning, execution framework and risk discipline required to make your own decisions.'],
  ['How are sessions conducted?',     'Training is delivered through live, interactive sessions with real-market examples and mentor-led review. Enquire with us for the current batch schedule.'],
]

const courses = [
  { id: 'core',    number: '01', label: 'FOUNDATION',    title: 'ICT Market Structure',      detail: 'Read intent, ranges and directional bias with absolute clarity.',              lessons: '12 lessons', price: 2999,  variant: 'a' },
  { id: 'liq',     number: '02', label: 'DEEP DIVE',     title: 'Liquidity & Inducement',     detail: 'Learn where price reaches first and how smart money creates the trap.',         lessons: '9 lessons',  price: 3499,  variant: 'b' },
  { id: 'entry',   number: '03', label: 'EXECUTION',     title: 'Precision Entry Model',      detail: 'Build a patient, repeatable entry process around high-conviction areas.',        lessons: '10 lessons', price: 3999,  variant: 'c' },
  { id: 'risk',    number: '04', label: 'PSYCHOLOGY',    title: 'Risk & Trading Psychology',  detail: 'Replace emotional reactions with a clear, sustainable risk protocol.',           lessons: '8 lessons',  price: 2499,  variant: 'd' },
  { id: 'journal', number: '05', label: 'SYSTEM',        title: 'Trading Journal Blueprint',  detail: 'Turn your data into better decisions with a journal that reveals your edge.',    lessons: '6 lessons',  price: 1999,  variant: 'e' },
  { id: 'mastery', number: '06', label: 'COMPLETE PATH', title: 'ICT Trader Mastery',         detail: 'The full course collection, sequenced from first principle to live execution.',  lessons: '45 lessons', price: 12999, variant: 'f', featured: true },
]

const mentorPlans = [
  { id: 'starter', tier: 'Starter', duration: '1 Month',  sessions: '4 Live Sessions',  price: 4999,  perks: ['Live chart walk-throughs', 'Trade setup reviews', 'WhatsApp support', 'Study materials'], variant: 'mp-a' },
  { id: 'growth',  tier: 'Growth',  duration: '3 Months', sessions: '12 Live Sessions', price: 12999, perks: ['All Starter benefits', 'Daily pre-market prep', 'Trade journal reviews', 'Session recordings', 'Priority access'], popular: true, variant: 'mp-b' },
  { id: 'elite',   tier: 'Elite',   duration: '6 Months', sessions: '24 Live Sessions', price: 22999, perks: ['All Growth benefits', '1-on-1 strategy calls', 'Custom trading plan', 'Lifetime materials', 'Alumni community', 'Post-batch support'], variant: 'mp-c' },
]

const videos = [
  { id: 'v1', title: 'Understanding Market Structure – ICT Basics',          duration: '18:42', views: '24.3K', desc: 'Learn to identify BOS, CHoCH and market phases like a professional institutional trader.', tag: 'Market Structure', grad: 'a' },
  { id: 'v2', title: 'Liquidity Sweeps Explained – Smart Money Concepts',    duration: '22:15', views: '18.7K', desc: 'Why price hunts your stop and how to position with institutions, not against them.',        tag: 'Liquidity',        grad: 'b' },
  { id: 'v3', title: 'Precision Entry Using Order Blocks – Live Trade Walk', duration: '31:08', views: '42.1K', desc: 'Real-time walkthrough of a precision ICT entry using order blocks in a live session.',     tag: 'Live Trade',       grad: 'c' },
]

/* ---------------------------------------- Dynamic Mentor Images Loop ---------------------------------------- */
// Center portrait is fixed permanently as /MentorPic/IMG_6107.PNG (never changes)
const MAIN_CENTER_IMAGE = '/MentorPic/IMG_6107.PNG'

// Automatically discovers all image files inside public/MentorPic/ at build & dev time.
const mentorPicGlob = import.meta.glob('/public/MentorPic/*.{png,PNG,jpg,JPG,jpeg,JPEG,webp,WEBP,avif,AVIF,svg,SVG}')

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
  if (name.includes('5651')) return 'Institutional Flow'
  if (name.includes('6056')) return 'Risk Protocol'
  if (name.includes('6057')) return 'Session Analysis'
  if (name.includes('6095')) return 'Precision Entries'
  if (name.includes('8017')) return 'Strategic Growth'
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/* ---------------------------------------- High-Precision Rapid Countdown ---------------------------------------- */
// Aligned with the announced cohort launch date: October 15, 2026 at 09:00 IST
const BATCH_TARGET = new Date('2026-10-15T09:00:00+05:30')

function useRapidCountdown(target: Date) {
  const calc = () => {
    const diff = target.getTime() - Date.now()
    const isLive = diff <= 0
    const clamped = Math.max(0, diff)
    const days = Math.floor(clamped / 86400000)
    const hours = Math.floor((clamped % 86400000) / 3600000)
    const minutes = Math.floor((clamped % 3600000) / 60000)
    const seconds = Math.floor((clamped % 60000) / 1000)
    // 2-digit hundredths of a second (00-99) for precision chronograph display
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

  const [t, setT] = useState(calc)

  useEffect(() => {
    let animId: number
    let lastTick = 0
    const tick = (now: number) => {
      // Rapid ~45fps tick for ultra-fast, smooth millisecond numbers
      if (now - lastTick >= 22) {
        const next = calc()
        setT(next)
        lastTick = now
        if (next.isLive) {
          // Stop RAF loop when countdown reaches zero and batch is live
          return
        }
      }
      animId = requestAnimationFrame(tick)
    }
    if (!calc().isLive) {
      animId = requestAnimationFrame(tick)
    }
    return () => {
      if (animId) cancelAnimationFrame(animId)
    }
  }, [target])

  return t
}
const pad = (n: number) => String(n).padStart(2, '0')

/* ══════════════════════════════════════════════════════════════
   COHORT INVENTORY & ADMISSIONS SEAT CALCULATION
   20 Days rolling admission window · 20 seats capacity
   Decreases by 1 seat per day leading up to class start date
   ══════════════════════════════════════════════════════════════ */
const TOTAL_COHORT_SEATS = 20
const ADMISSION_WINDOW_DAYS = 20

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
    // 20+ days before class start: all 20 seats available (Early Admissions Open)
    availableSeats = totalSeats
    filledSeats = 0
    percentFilled = 0
    urgencyLabel = '20 SEATS AVAILABLE · ADMISSIONS OPEN'
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
  countdown: {
    days: number
    hours: number
    minutes: number
    seconds: number
    milliseconds: number
    isLive: boolean
  }
}

const HeroCountdownModule = memo(function HeroCountdownModule({
  countdown,
}: HeroCountdownProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const stats = computeCohortSeatStats(countdown.days, countdown.isLive)
  const isLive = stats.isLive

  // Handle mobile card tap to toggle flip (disabled in live mode)
  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('a') || target.closest('button')) return
    if (!isLive) {
      setIsFlipped((prev) => !prev)
    }
  }

  return (
    <div
      className={`hero-countdown-wrap reveal-el dl-2 ${isLive ? 'is-batch-live-wrap' : ''} ${isFlipped ? 'has-flipped' : ''}`}
      onMouseLeave={() => {
        // Reset manual flip on mouse leave so hover remains natural on desktop
        setIsFlipped(false)
      }}
    >
      <div className="hero-cd-glow" aria-hidden />
      <div className="hero-cd-ring ring-outer" aria-hidden />
      <div className="hero-cd-ring ring-inner" aria-hidden />

      <div
        className={`hero-countdown-card ${isLive ? 'is-batch-live-card' : ''} ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleCardClick}
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
                <a href="#contact" className="hcd-live-waitlist-btn">
                  <span>Inquire for Next Batch Waitlist</span>
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* ---------------------------------------- FRONT FACE: CHRONOGRAPH ---------------------------------------- */}
            <div className="hcd-face hcd-face-front">
              {/* Terminal Header */}
              <div className="hcd-header">
                <div className="hcd-live-badge">
                  <span className="hcd-pulse-dot" />
                  <span>LIVE BATCH COHORT</span>
                </div>
                <div className="hcd-header-actions">
                  <div className="hcd-status-tag">
                    <span className="hcd-tag-dot" />
                    <span>ADMISSIONS OPEN</span>
                  </div>
                  <button
                    type="button"
                    className="hcd-flip-trigger-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFlipped(true)
                    }}
                    title="Inspect seat matrix details"
                    aria-label="Flip card to view seat details"
                  >
                    <span>Seat Matrix ↻</span>
                  </button>
                </div>
              </div>

              {/* 5-Pillar Chronograph Display */}
              <div className="hcd-chronograph">
                {/* Days Pillar */}
                {countdown.days > 0 && (
                  <>
                    <div className="hcd-chrono-unit">
                      <div className="hcd-digit-box">
                        <span className="hcd-val">{pad(countdown.days)}</span>
                      </div>
                      <span className="hcd-lbl">DAYS</span>
                    </div>

                    <div className="hcd-chrono-sep" aria-hidden="true">:</div>
                  </>
                )}

                {/* Hours Pillar */}
                <div className="hcd-chrono-unit">
                  <div className="hcd-digit-box">
                    <span className="hcd-val">{pad(countdown.hours)}</span>
                  </div>
                  <span className="hcd-lbl">HOURS</span>
                </div>

                <div className="hcd-chrono-sep" aria-hidden="true">:</div>

                {/* Minutes Pillar */}
                <div className="hcd-chrono-unit">
                  <div className="hcd-digit-box">
                    <span className="hcd-val">{pad(countdown.minutes)}</span>
                  </div>
                  <span className="hcd-lbl">MIN</span>
                </div>

                <div className="hcd-chrono-sep" aria-hidden="true">:</div>

                {/* Seconds Pillar */}
                <div className="hcd-chrono-unit">
                  <div className="hcd-digit-box">
                    <span className="hcd-val">{pad(countdown.seconds)}</span>
                  </div>
                  <span className="hcd-lbl">SEC</span>
                </div>

                <div className="hcd-chrono-sep hcd-sep-ms" aria-hidden="true">.</div>

                {/* Rapid Milliseconds Pillar */}
                <div className="hcd-chrono-unit hcd-unit-ms">
                  <div className="hcd-digit-box hcd-box-ms">
                    <span className="hcd-val hcd-val-ms">{pad(countdown.milliseconds)}</span>
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
                        {stats.availableSeats} of 20 LEFT
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
                  <div className="hcd-flip-hint-row">
                    <span className="hcd-flip-hint-text">
                      <span className="hcd-flip-icon">↺</span> Hover or click to inspect seat allocation matrix
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------------------------------- BACK FACE: SEAT ALLOCATION MATRIX ---------------------------------------- */}
            <div className="hcd-face hcd-face-back">
              <div className="hcd-back-header">
                <div className="hcd-live-badge">
                  <span className="hcd-pulse-dot" />
                  <span>SEAT ALLOCATION MATRIX</span>
                </div>
                <div className="hcd-back-header-right">
                  <span className="hcd-status-tag">20-SLOT CAP</span>
                  <button
                    type="button"
                    className="hcd-back-flip-pill"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsFlipped(false)
                    }}
                    title="Flip back to timer"
                  >
                    <span>↻ Timer</span>
                  </button>
                </div>
              </div>

              {/* Top Metrics Row */}
              <div className="hcd-back-metrics">
                <div className="hcd-back-metric-main">
                  <div className="hcd-back-num-wrap">
                    <span className="hcd-back-big-num">{stats.availableSeats}</span>
                    <span className="hcd-back-num-sub">/ 20</span>
                  </div>
                  <div className="hcd-back-metric-label">
                    <strong>AVAILABLE SEATS</strong>
                    <span>{stats.filledSeats} Reserved · {stats.percentFilled}% Capacity</span>
                  </div>
                </div>
                <div className={`hcd-back-status-pill pill-${stats.urgencyLevel}`}>
                  <span className="hcd-pill-dot" />
                  <span>{stats.urgencyLabel}</span>
                </div>
              </div>

              {/* 20-Seat Visual Grid */}
              <div className="hcd-seat-grid-container">
                <div className="hcd-seat-grid-header">
                  <span>SEAT ALLOCATION INVENTORY</span>
                  <span>CAP: 20 TRADERS</span>
                </div>
                <div className="hcd-seat-grid">
                  {Array.from({ length: 20 }, (_, idx) => {
                    const seatNum = idx + 1
                    const isBooked = seatNum <= stats.filledSeats
                    const isNext = seatNum === stats.filledSeats + 1 && !isBooked
                    return (
                      <div
                        key={seatNum}
                        className={`hcd-seat-pill ${isBooked ? 'is-booked' : isNext ? 'is-next' : 'is-open'}`}
                        title={`Seat #${seatNum}: ${isBooked ? 'Reserved' : isNext ? 'Next Available' : 'Available'}`}
                      >
                        <span className="hcd-seat-num">{pad(seatNum)}</span>
                        <span className="hcd-seat-status-dot" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Institutional Specs Strip */}
              <div className="hcd-back-specs-grid">
                <div className="hcd-spec-card">
                  <span className="hcd-spec-k">CLASS START</span>
                  <span className="hcd-spec-v">15 OCT 2026 · 10:00 AM</span>
                </div>
                <div className="hcd-spec-card">
                  <span className="hcd-spec-k">FORMAT</span>
                  <span className="hcd-spec-v">Offline · Classroom</span>
                </div>
                <div className="hcd-spec-card">
                  <span className="hcd-spec-k">LOCATION</span>
                  <span className="hcd-spec-v">Coimbatore Desk</span>
                </div>
              </div>

              {/* Back Footer with Direct CTA */}
              <div className="hcd-back-footer">
                <div className="hcd-back-cta-row">
                  <a
                    href="#contact"
                    className="hcd-back-claim-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{stats.availableSeats > 0 ? `Reserve Seat #${Math.min(20, stats.filledSeats + 1)} Now` : 'Inquire for Waitlist'}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </>
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
  { href: '#contact',         label: 'Contact' },
]

const REVIEW_SUB_LINKS = [
  {
    href: '#student-payout',
    title: 'Payout Proofs',
    badge: '3D Sphere',
    icon: '✦',
    desc: '$1.4M+ verified student payouts & certs',
  },
  {
    href: '#student-stories',
    title: 'Written Feedback',
    badge: '3D Deck',
    icon: '★',
    desc: 'Real WhatsApp & Discord community reviews',
  },
  {
    href: '#student-videos',
    title: 'Video Testimonials',
    badge: 'Watch',
    icon: '▶',
    desc: 'Recorded video feedback from real students',
  },
]



/* ----------------------------------------
   CONTACT FORM TYPES & CONSTANTS
   ---------------------------------------- */
const TOPIC_OPTIONS = [
  'Complete ICT Mastery',
  '1-on-1 Mentorship',
  'Structure & Liquidity',
  'Next Batch Schedule',
  'Trading Assessment',
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
  const [selectedTopic, setSelectedTopic] = useState<string>('Complete ICT Mastery')
  const [selectedExp, setSelectedExp] = useState<string>('Intermediate (6M - 2 Yrs)')
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false)

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

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('pravyntraderweb@gmail.com').catch(() => {})
    }
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2400)
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
  const [activeQs,      setActiveQs]      = useState<number[]>([0])
  const [cartOpen,      setCartOpen]      = useState(false)
  const [cart,          setCart]          = useState<string[]>([])
  const [annDismissed,  setAnnDismissed]  = useState(false)
  const [reviewsDropdownOpen, setReviewsDropdownOpen] = useState(false)

  /* ---------------------------------------- Live Batch Countdown & State ---------------------------------------- */
  const countdown = useRapidCountdown(BATCH_TARGET)
  const isBatchLive = countdown.isLive

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

  /* ---------------------------------------- Body scroll lock when cart open ---------------------------------------- */
  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [cartOpen])

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

  /* ---------------------------------------- Cart ---------------------------------------- */
  const cartCourses  = courses.filter(c => cart.includes(c.id))
  const cartTotal    = cartCourses.reduce((s, c) => s + c.price, 0)
  const addCourse    = useCallback((id: string) => { if (!cart.includes(id)) setCart(c => [...c, id]); setCartOpen(true) }, [cart])
  const removeCourse = useCallback((id: string) => setCart(c => c.filter(x => x !== id)), [])
  const closeCart    = useCallback(() => setCartOpen(false), [])

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
    setSelectedTopic('Complete ICT Mastery')
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
                    Next Batch Starts <strong>October 15, 2026</strong>
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
                    onClick={() => setReviewsDropdownOpen((prev) => !prev)}
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
                        <span className="ndi-icon" aria-hidden="true">{sub.icon}</span>
                        <div className="ndi-content">
                          <div className="ndi-row">
                            <span className="ndi-title">{sub.title}</span>
                            <span className="ndi-badge">{sub.badge}</span>
                          </div>
                          <span className="ndi-desc">{sub.desc}</span>
                        </div>
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
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Open cart — ${cart.length} items`}>
            <Bag /><span className="cart-label">Cart</span>
            {cart.length > 0 && <b className="cart-count">{cart.length}</b>}
          </button>
          <a className="btn-enroll" href="#contact">{isBatchLive ? 'Waitlist' : 'Enroll'}</a>
          <button className="menu-button" onClick={() => setMenuOpen(m => !m)} aria-label="Toggle menu" aria-expanded={menuOpen}>
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
              Trade with<br /><em className="h1-em">precision.</em><br />Not with luck.
            </h1>
            <p className="hero-sub reveal-el dl-2">
              A live, structured ICT mentorship for traders committed to understanding market structure, liquidity and disciplined execution.
            </p>
            <div className="hero-actions reveal-el dl-3">
              <a className={`button button-primary glow-heavy ${isBatchLive ? 'is-waitlist-mode' : ''}`} href="#contact" id="hero-cta">
                {isBatchLive ? 'Join Next Batch Waitlist' : 'Reserve your seat'} <Arrow />
              </a>
            </div>
            <div className="hero-proof reveal-el dl-4">
              <div className="proof-item"><strong>1000+</strong><span>Traders</span></div>
              <div className="proof-sep" />
              <div className="proof-item"><strong>4.9★</strong><span>Avg Rating</span></div>
              <div className="proof-sep" />
              <div className="proof-item"><strong>Live</strong><span>Sessions</span></div>
            </div>
          </div>

          <HeroCountdownModule countdown={countdown} />
        </div>
        <div className="hero-scroll-hint" aria-hidden>
          <div className="scroll-track"><div className="scroll-thumb" /></div>
          <span>SCROLL</span>
        </div>
      </section>

      {/* ---------------------------------------- TICKER RIBBON ---------------------------------------- */}
      <div className="ticker" aria-label="Course topics">
        <div className="ticker-track">
          {['MARKET STRUCTURE','LIQUIDITY CONCEPTS','ICT METHODOLOGY','SMART MONEY','RISK DISCIPLINE','ORDER BLOCKS','REAL MARKET CONTEXT','FVG & IMBALANCE'].map((t,i) => (
            <span key={i}><b>◆</b>{t}</span>
          ))}
          {['MARKET STRUCTURE','LIQUIDITY CONCEPTS','ICT METHODOLOGY','SMART MONEY','RISK DISCIPLINE','ORDER BLOCKS','REAL MARKET CONTEXT','FVG & IMBALANCE'].map((t,i) => (
            <span key={`d${i}`} aria-hidden><b>◆</b>{t}</span>
          ))}
        </div>
      </div>

      {/* ---------------------------------------- METHOD ---------------------------------------- */}
      <section className="method-section" id="method" data-section="method">
        <div className="method-header reveal-el">
          <p className="section-tag">01 / THE DIFFERENCE</p>
          <h2>Trading is not a<br /><em>prediction game.</em></h2>
        </div>
        <div className="principles-grid">
          {[
            ['01','Structure before setups.','Know where price is in its larger narrative, then work down to the trade — never the reverse.'],
            ['02','Process over impulse.','A repeatable framework gives you something more reliable than intuition or pattern-matching.'],
            ['03','Risk before reward.','Protect capital first. Let high-quality decisions compound over time into an actual edge.'],
          ].map(([num, heading, body]) => (
            <article className="principle-card reveal-el" key={num}>
              <div className="pc-num" aria-hidden>{num}</div>
              <div className="pc-body">
                <h3>{heading}</h3>
                <p>{body}</p>
              </div>
              <div className="pc-corner tl" /><div className="pc-corner tr" />
              <div className="pc-corner bl" /><div className="pc-corner br" />
            </article>
          ))}
        </div>
      </section>

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
            <div><strong>1000+</strong><span>Students</span></div>
            <div><strong>4.9</strong><span>Rating</span></div>
            <div><strong>3+</strong><span>Years</span></div>
          </div>
        </div>

        <div className="mentor-content">

          <p className="section-tag reveal-el">02 / YOUR MENTOR</p>
          <h2 className="reveal-el">Built for the trader<br />you intend <em>to become.</em></h2>
          <p className="reveal-el">Pravyn ICT is guided by an experienced practitioner focused on market structure, liquidity and institutional price action. Every session is grounded in real execution logic, clear frameworks and accountability—not predictions.</p>
          <blockquote className="reveal-el">"No signals. No jackpots. No false promises."</blockquote>
          <a className="text-link reveal-el" href="#contact">Start your journey <Arrow /></a>
        </div>
      </section>
      {/* ---------------------------------------- PROGRAMMES ---------------------------------------- */}
      <ProgrammesSection isBatchLive={isBatchLive} onEnroll={handleEnroll} />

      {/* ---------------------------------------- UNIFIED STUDENT REVIEWS & PROOF HUB ---------------------------------------- */}
      <div id="student-reviews" className="student-reviews-hub" data-section="student-reviews">
        <div className="proof-hub-sticky-bar reveal-el">
          <div className="proof-hub-bar-inner">
            <div className="proof-hub-title-group">
              <div className="proof-hub-badge">
                <span className="phb-dot" />
                <span>VERIFIED ALUMNI PROOF &amp; HONEST REVIEWS</span>
              </div>
              <span className="proof-hub-stats-badge">100% UNFILTERED STUDENT EVIDENCE</span>
            </div>
            <div className="proof-subcategories-pill-bar" role="navigation" aria-label="Student Review Subcategories">
              <a href="#student-payout" className="proof-subcat-pill">
                <span className="psc-icon">✦</span>
                <span className="psc-num">01.</span>
                <span>Payout Proofs</span>
                <span className="psc-badge">3D Sphere</span>
              </a>
              <a href="#student-stories" className="proof-subcat-pill">
                <span className="psc-icon">★</span>
                <span className="psc-num">02.</span>
                <span>Written Reviews</span>
                <span className="psc-badge">3D Deck</span>
              </a>
              <a href="#student-videos" className="proof-subcat-pill">
                <span className="psc-icon">▶</span>
                <span className="psc-num">03.</span>
                <span>Video Testimonials</span>
                <span className="psc-badge">Watch Stories</span>
              </a>
            </div>
          </div>
        </div>

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
          <p className="section-tag">07 / FREE RESOURCES</p>
          <h2>Watch before<br />you <em>commit.</em></h2>
          <p>Our free content lets you experience the depth and quality of what we teach.</p>
        </div>
        <div className="video-grid">
          {videos.map(v => (
            <div className="vid-card reveal-el" key={v.id}>
              <div className="vid-thumb">
                <div className={`vid-art vid-${v.grad}`} />
                <div className="vid-overlay" />
                <a className="vid-play" href="https://www.youtube.com/@pravynict" target="_blank" rel="noopener noreferrer" aria-label={`Watch: ${v.title}`}>
                  <Play />
                </a>
                <span className="vid-dur">{v.duration}</span>
                <span className="vid-tag">{v.tag}</span>
              </div>
              <div className="vid-info">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
                <div className="vid-foot">
                  <span>{v.views} views</span>
                  <a href="https://www.youtube.com/@pravynict" target="_blank" rel="noopener noreferrer" className="vid-link">Watch on YouTube <Arrow /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="videos-yt-cta reveal-el">
          <a
            href="https://www.youtube.com/@pravynict"
            target="_blank"
            rel="noopener noreferrer"
            className="yt-subscribe-btn"
            id="yt-btn"
            aria-label="Subscribe to Pravyn ICT YouTube channel"
          >
            <span className="yt-btn-icon-pill" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="yt-play-triangle">
                <path d="M9.5 7.5v9l7-4.5-7-4.5z" />
              </svg>
            </span>
            <span className="yt-btn-text">Subscribe to channel</span>
            <Arrow />
          </a>
        </div>
      </section>

      {/* ---------------------------------------- FAQ ---------------------------------------- */}
      <section className="faq-section" id="faq" data-section="faq">
        <div className="faq-head reveal-el">
          <p className="section-tag">09 / GOOD TO KNOW</p>
          <h2>Common<br /><em>questions.</em></h2>
        </div>
        <div className="faq-list">
          {questions.map(([q, a], i) => {
            const isActive = activeQs.includes(i)
            return (
              <article className={`faq-item${isActive ? ' active' : ''} reveal-el`} key={i}>
                <button onClick={() => setActiveQs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])} id={`faq-${i}`} aria-expanded={isActive}>
                  <span className="faq-q-num">{String(i+1).padStart(2,'0')}</span>
                  <span className="faq-q-text">{q}</span>
                  <span className="faq-toggle">{isActive ? '-' : '+'}</span>
                </button>
                <div className={`faq-answer${isActive ? ' open' : ''}`}><p>{a}</p></div>
              </article>
            )
          })}
        </div>
      </section>

      {/* ---------------------------------------- CONTACT ---------------------------------------- */}
      <section className="contact-section" id="contact" data-section="contact">
        {/* Left Column: Direct Communication Channels */}
        <div className="contact-desk-column reveal-el">
          <div className="contact-desk-intro">
            <p className="section-tag">10 / GET STARTED</p>
            <h2>Take the first<br /><em>intentional step.</em></h2>
            <p className="contact-desk-lead">
              Tell us where you are in your trading journey. We'll review your background and share the next batch schedule directly.
            </p>
          </div>

          {/* 3 Balanced Channel Cards */}
          <div className="contact-channels-list">
            {/* WhatsApp Direct */}
            <a
              href="https://wa.me/918637478662?text=Hi%20Praveen,%20I'm%20interested%20in%20the%20Pravyn%20ICT%20Mentorship%20Batch"
              target="_blank"
              rel="noreferrer"
              className="channel-card card-whatsapp"
              aria-label="Direct WhatsApp Message to Praveen"
            >
              <div className="channel-icon-box">
                <WhatsAppIcon />
              </div>
              <div className="channel-info">
                <div className="channel-meta">
                  <span className="channel-badge badge-emerald">RECOMMENDED · FASTEST</span>
                  <span className="channel-title">WhatsApp Direct Concierge</span>
                </div>
                <span className="channel-value">+91 86374 78662</span>
                <span className="channel-subtext">Instant batch queries, fee schedules & fast-track enrollment</span>
              </div>
              <div className="channel-arrow" aria-hidden="true">
                <Arrow />
              </div>
            </a>


            {/* Mentor Inbox Email */}
            <div className="channel-card card-email">
              <div className="channel-icon-box">
                <MailIcon />
              </div>
              <div className="channel-info">
                <div className="channel-meta">
                  <span className="channel-badge badge-indigo">PRIVATE INBOX</span>
                  <span className="channel-title">Mentor Evaluation Inbox</span>
                </div>
                <a href="mailto:pravyntraderweb@gmail.com" className="channel-value email-link">
                  pravyntraderweb@gmail.com
                </a>
                <span className="channel-subtext">Submit trading journals, chart breakdowns & detailed queries</span>
              </div>
              <div className="channel-action-group">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`channel-copy-btn ${copiedEmail ? 'copied' : ''}`}
                  aria-label="Copy mentor email address"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon />
                      <span>Copy</span>
                    </>
                  )}
                </button>
                <a
                  href="mailto:pravyntraderweb@gmail.com"
                  className="channel-mail-arrow"
                  aria-label="Open mail client"
                  title="Open mail client"
                >
                  <ExternalLinkIcon />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Balanced Form Card OR Success Receipt */}
        {contactStatus === 'success' ? (
          <div className="contact-receipt-card reveal-el" role="status" aria-live="polite">
            <div className="receipt-header">
              <div className="receipt-badge-pill">
                <span className="receipt-pulse-dot" />
                <span>ADMISSION ENQUIRY DISPATCHED</span>
              </div>
              <span className="receipt-hash">#ICT-VERIFIED</span>
            </div>

            <div className="receipt-icon-wrap">
              <div className="receipt-icon-ring" />
              <div className="receipt-icon-core">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            <h3>Enquiry Successfully Received</h3>
            <p className="receipt-lead">
              {contactStatusMsg || (
                <>Your application was transmitted directly to <strong>pravyntraderweb@gmail.com</strong>. Mentor Praveen will review your background and reach out within 24 hours.</>
              )}
            </p>

            {/* Receipt Summary Grid */}
            <div className="receipt-table">
              <div className="receipt-row">
                <span className="r-label">Applicant</span>
                <span className="r-val"><strong>{contactData.name}</strong></span>
              </div>
              <div className="receipt-row">
                <span className="r-label">Email</span>
                <span className="r-val">{contactData.email}</span>
              </div>
              {contactData.phone && (
                <div className="receipt-row">
                  <span className="r-label">Phone / WA</span>
                  <span className="r-val">{contactData.phone}</span>
                </div>
              )}
              <div className="receipt-row">
                <span className="r-label">Selected Programme</span>
                <span className="r-val highlight-topic">{selectedTopic}</span>
              </div>
              <div className="receipt-row receipt-dest-row">
                <span className="r-label">Destination</span>
                <span className="r-val r-dest-badge">pravyntraderweb@gmail.com</span>
              </div>
            </div>

            {/* Fast-Track WhatsApp CTA */}
            <div className="receipt-fasttrack-card">
              <div className="rft-content">
                <strong>Need an Instant Response?</strong>
                <p>Skip the email queue. Ping Praveen directly on WhatsApp with your enquiry.</p>
              </div>
              <a
                href={`https://wa.me/918637478662?text=Hi%20Praveen,%20I%20just%20submitted%20my%20enquiry%20for%20${encodeURIComponent(selectedTopic)}.%20My%20name%20is%20${encodeURIComponent(contactData.name)}.`}
                target="_blank"
                rel="noreferrer"
                className="button button-primary rft-btn"
              >
                <WhatsAppIcon />
                <span>Open WhatsApp</span>
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
                <h3>Direct Mentorship Enquiry</h3>
              </div>
              <span className="cch-badge">
                <ShieldIcon />
                <span>256-Bit Encrypted</span>
              </span>
            </div>

            <form onSubmit={handleContactSubmit} noValidate className="contact-actual-form">
              {/* Row 1: Name & Email */}
              <div className="contact-form-row">
                <div className="terminal-input-wrap">
                  <label htmlFor="cn-name">
                    <span>YOUR NAME</span>
                    <span className="cn-req">*</span>
                  </label>
                  <div className="input-icon-shell">
                    <span className="input-glyph" aria-hidden="true">
                      <UserIcon />
                    </span>
                    <input
                      type="text"
                      name="name"
                      id="cn-name"
                      value={contactData.name}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      placeholder="Your full name"
                      autoComplete="name"
                      disabled={contactStatus === 'submitting'}
                      className={
                        contactTouched.name && contactErrors.name
                          ? 'is-invalid'
                          : contactTouched.name && !contactErrors.name && contactData.name
                          ? 'is-valid'
                          : ''
                      }
                    />
                    {contactTouched.name && !contactErrors.name && contactData.name && (
                      <span className="input-valid-check" aria-hidden="true">✓</span>
                    )}
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
                    <span>EMAIL ADDRESS</span>
                    <span className="cn-req">*</span>
                  </label>
                  <div className="input-icon-shell">
                    <span className="input-glyph" aria-hidden="true">
                      <MailIcon />
                    </span>
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
                          : contactTouched.email && !contactErrors.email && contactData.email
                          ? 'is-valid'
                          : ''
                      }
                    />
                    {contactTouched.email && !contactErrors.email && contactData.email && (
                      <span className="input-valid-check" aria-hidden="true">✓</span>
                    )}
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
                    <span>PHONE / WHATSAPP</span>
                    <span className="cn-req">*</span>
                  </label>
                  <div className="input-icon-shell">
                    <span className="input-glyph" aria-hidden="true">
                      <PhoneIcon />
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      id="cn-phone"
                      required
                      value={contactData.phone}
                      onChange={handleContactChange}
                      onBlur={handleContactBlur}
                      placeholder="+91 86374 78662"
                      autoComplete="tel"
                      disabled={contactStatus === 'submitting'}
                      className={
                        contactTouched.phone && contactErrors.phone
                          ? 'is-invalid'
                          : contactTouched.phone && !contactErrors.phone && contactData.phone
                          ? 'is-valid'
                          : ''
                      }
                    />
                    {contactTouched.phone && !contactErrors.phone && contactData.phone && (
                      <span className="input-valid-check" aria-hidden="true">✓</span>
                    )}
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
                    <span>INTERESTED PROGRAMME</span>
                    <span className="cn-req">*</span>
                  </label>
                  <div className="input-icon-shell select-shell">
                    <span className="input-glyph" aria-hidden="true">
                      <ProgramIcon />
                    </span>
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
                  <span>TRADING GOALS & MESSAGE</span>
                  <span className="cn-req">*</span>
                </label>
                <div className="input-icon-shell textarea-shell">
                  <span className="input-glyph textarea-glyph" aria-hidden="true">
                    <MessageIcon />
                  </span>
                  <textarea
                    name="message"
                    id="cn-msg"
                    rows={3}
                    value={contactData.message}
                    onChange={handleContactChange}
                    onBlur={handleContactBlur}
                    placeholder="Tell us where you are in your trading journey…"
                    disabled={contactStatus === 'submitting'}
                    className={
                      contactTouched.message && contactErrors.message
                        ? 'is-invalid'
                        : contactTouched.message && !contactErrors.message && contactData.message
                        ? 'is-valid'
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

              {/* High-Conversion Submit Button */}
              <button
                className="button button-primary glow-heavy terminal-submit-btn"
                type="submit"
                id="cn-submit"
                disabled={contactStatus === 'submitting'}
              >
                {contactStatus === 'submitting' ? (
                  <>
                    <span className="cn-spinner" aria-hidden />
                    <span>Sending Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Mentorship Enquiry</span>
                    <Arrow />
                  </>
                )}
              </button>

              <div className="contact-form-footer">
                <div className="cff-note">
                  <span className="cff-dot" />
                  <span>Direct transmission to <strong>pravyntraderweb@gmail.com</strong>. We respond within 24 hours.</span>
                </div>
              </div>
            </form>
          </div>
        )}
      </section>

      {/* ---------------------------------------- FOOTER ---------------------------------------- */}
      <footer>
        <a className="brand" href="#home" aria-label="Pravyn ICT — Trading Leaders Community">
          <img src="/logo/logo.png" alt="Trading Leaders Community Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-name"><span>PRAVYN</span><em>ICT</em></span>
            <span className="brand-sub">TRADING LEADERS COMMUNITY</span>
          </div>
        </a>
        <nav>{NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
        <p>© {new Date().getFullYear()} PRAVYN ICT · Trading Leaders Community. Educational content only.</p>
      </footer>

      {/* ---------------------------------------- MOBILE STICKY CTA ---------------------------------------- */}
      <div className="mobile-cta" aria-hidden="true">
        <a href="#courses" className="button button-primary">Explore Courses <Arrow /></a>
      </div>

      {/* ---------------------------------------- CART ---------------------------------------- */}
      {/* Overlay — clicking closes cart */}
      <div
        className={`cart-overlay${cartOpen ? ' open' : ''}`}
        onClick={closeCart}
        onTouchEnd={closeCart}
        role="presentation"
        aria-hidden="true"
      />
      <aside className={`cart-drawer${cartOpen ? ' open' : ''}`} aria-label="Shopping cart" role="dialog">
        <div className="cart-head">
          <div>
            <p className="section-tag">YOUR SELECTION</p>
            <h3>Cart <sup>{cart.length}</sup></h3>
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart"><Close /></button>
        </div>

        <div className="cart-items-scroll">
          {cartCourses.length > 0 ? (
            <>
              <div className="cart-items">
                {cartCourses.map(c => (
                  <div className="cart-item" key={c.id}>
                    <div className={`cart-chip var-${c.variant}`}>{c.number}</div>
                    <div className="cart-item-info">
                      <strong>{c.title}</strong>
                      <span>{c.lessons}</span>
                    </div>
                    <div className="cart-item-right">
                      <b>₹{c.price.toLocaleString('en-IN')}</b>
                      <button onClick={() => removeCourse(c.id)} className="cart-remove">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total</span><strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
              </div>
              <button className="button button-primary cart-checkout">
                Checkout — Coming Soon <Arrow />
              </button>
              <p className="cart-note">Secure payment will be enabled before launch.</p>
            </>
          ) : (
            <div className="cart-empty">
              <div className="cart-empty-badge">
                <img src="/logo/logo.png" alt="Trading Leaders Community" className="cart-empty-logo" />
              </div>
              <h4>Your cart is empty</h4>
              <p>Add a mentorship course to start trading with precision.</p>
              <button onClick={closeCart} className="button button-ghost">
                Browse courses <Arrow />
              </button>
            </div>
          )}

          {/* Always-visible close button at bottom on mobile */}
          <button className="cart-close-mobile" onClick={closeCart} aria-label="Close cart">
            ✕ Close Cart
          </button>
        </div>
      </aside>
    </main>
  )
}

export default App
