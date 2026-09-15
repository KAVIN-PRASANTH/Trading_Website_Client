import React, { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StudentPayoutSection } from './components/payout/StudentPayoutSection'
import { StudentFeedbackSection } from './components/feedback/StudentFeedbackSection'

/* ---------------------------------------- Icons ---------------------------------------- */
const Arrow  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M5 12h13M13 6l6 6-6 6"/></svg>
const Play   = () => <svg viewBox="0 0 24 24" aria-hidden><path d="m9 6 9 6-9 6V6Z"/></svg>
const Menu   = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M4 7h16M4 12h16M4 17h16"/></svg>
const Close  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M6 6l12 12M18 6 6 18"/></svg>
const Bag    = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M5 8h14l-1 12H6L5 8ZM9 9V6a3 3 0 0 1 6 0v3"/></svg>
const Check  = () => <svg viewBox="0 0 24 24" aria-hidden><path d="M20 6 9 17l-5-5"/></svg>
const Star   = () => <svg viewBox="0 0 24 24" aria-hidden className="star-icon"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>

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
  const isLive = countdown.isLive
  // Calculate filled seats dynamically based on remaining countdown hours (84% to 96%)
  const percentFilled = 92

  return (
    <div className={`hero-countdown-wrap reveal-el dl-2 ${isLive ? 'is-batch-live-wrap' : ''}`}>
      <div className="hero-cd-glow" aria-hidden />
      <div className="hero-cd-ring ring-outer" aria-hidden />
      <div className="hero-cd-ring ring-inner" aria-hidden />

      <div className={`hero-countdown-card ${isLive ? 'is-batch-live-card' : ''}`}>
        {/* Terminal Header */}
        <div className="hcd-header">
          <div className="hcd-live-badge">
            <span className={`hcd-pulse-dot ${isLive ? 'dot-live-active' : ''}`} />
            <span>{isLive ? 'COHORT IN SESSION · LIVE' : 'LIVE BATCH COHORT'}</span>
          </div>
          <div className="hcd-status-tag">
            <span className={`hcd-tag-dot ${isLive ? 'tag-dot-live' : ''}`} />
            <span>{isLive ? '● SESSIONS ACTIVE' : 'ADMISSIONS OPEN'}</span>
          </div>
        </div>

        {isLive ? (
          /* ---------------------------------------- LIVE BROADCAST SCREEN ---------------------------------------- */
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
                  Live market execution and private Zoom mentorship rooms are currently underway for active traders.
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
        ) : (
          /* ---------------------------------------- RUNNING RAPID CHRONOGRAPH ---------------------------------------- */
          <>
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

            {/* Institutional Urgency Meter Footer */}
            <div className="hcd-footer">
              <div className="hcd-urgency-strip">
                <div className="hcd-urgency-info">
                  <span className="hcd-urgency-text">LIMITED MENTORSHIP SEATS</span>
                  <span className="hcd-urgency-val">{percentFilled}% FILLED</span>
                </div>
                <div className="hcd-urgency-meter">
                  <div className="hcd-urgency-fill" style={{ width: `${percentFilled}%` }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
})

const NAV_LINKS = [
  { href: '#home',           label: 'Home'           },
  { href: '#programmes',     label: 'Programmes'     },
  { href: '#student-payout', label: 'Student Payout' },
  { href: '#student-stories', label: 'Student Stories' },
  { href: '#videos',         label: 'Videos'         },
]

/* ---------------------------------------- CoinDCX-Style Slide Button ---------------------------------------- */
interface SlideToEnrollProps {
  label: string
  successLabel?: string
  colorVariant?: 'blue' | 'gold'
  disabled?: boolean
  disabledLabel?: string
  onSuccess: () => void
}

function SlideToEnroll({
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

  const handleTrackClick = () => {
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
            <span className="slide-chevrons" aria-hidden>›››</span>
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

/* ---------------------------------------- Drag & Wheel Scrollable Container for Back Face ---------------------------------------- */
function ScrollableCurriculum({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDown = useRef(false)
  const startY = useRef(0)
  const scrollTop = useRef(0)

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click initiates drag
    if (e.button !== 0) return
    isDown.current = true
    const el = containerRef.current
    if (!el) return
    startY.current = e.clientY
    scrollTop.current = el.scrollTop
    el.classList.add('is-dragging-scroll')
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return
    const el = containerRef.current
    if (!el) return
    e.preventDefault()
    const walk = (e.clientY - startY.current) * 1.4
    el.scrollTop = scrollTop.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDown.current = false
    containerRef.current?.classList.remove('is-dragging-scroll')
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation()
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY
    }
  }

  return (
    <div
      ref={containerRef}
      className={`back-scroll-area ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
      onWheel={handleWheel}
      tabIndex={0}
      role="region"
      aria-label="Scrollable syllabus"
    >
      {children}
    </div>
  )
}

/* ----------------------------------------
   CONTACT FORM TYPES & CONSTANTS
   ---------------------------------------- */
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
  const [contactErrors, setContactErrors] = useState<ContactErrors>({})
  const [contactTouched, setContactTouched] = useState<Record<keyof ContactFormState, boolean>>({
    name: false,
    email: false,
    phone: false,
    message: false,
  })
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [contactStatusMsg, setContactStatusMsg] = useState('')

  const handleEnroll = (programmeName: string) => {
    const enrollMsg = `Enquiring for enrollment in: ${programmeName}`
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
  const [flippedOnline, setFlippedOnline] = useState(false)
  const [flippedOffline, setFlippedOffline] = useState(false)

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
      if (trimmed && !/^[+0-9\s-]{7,18}$/.test(trimmed)) {
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
    setContactStatus('idle')
    setContactStatusMsg('')
  }

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Mentorship Enquiry: ${contactData.name || 'Trader'}`)
    const body = encodeURIComponent(
      `Name: ${contactData.name || ''}\nEmail: ${contactData.email || ''}\nPhone: ${contactData.phone || 'N/A'}\n\nTrading Goals / Message:\n${contactData.message || ''}\n\n---\nSent via Pravyn ICT Mentorship Portal`
    )
    return `mailto:pravyntraderweb@gmail.com?subject=${subject}&body=${body}`
  }, [contactData])

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
        message: contactData.message.trim(),
        _subject: `New Mentorship Enquiry from ${contactData.name.trim()}`,
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
        <a className="brand" href="#home" aria-label="Pravyn ICT home">
          <span>PRAVYN</span><em>ICT</em>
        </a>

        <nav className={`nav${menuOpen ? ' nav-open' : ''}`} role="navigation" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <a key={href} href={href}
               className={activeSection === href.slice(1) ? 'nav-active' : ''}
               onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
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
      <section className="prog-section" id="programmes" data-section="programmes">
        <div className="prog-header reveal-el">
          <p className="section-tag">03 / PROGRAMMES</p>
          <h2>Choose your<br /><em>trading path.</em></h2>
          <p className="prog-header-sub">Engineered for institutional precision. Master ICT concepts, our proprietary XAUUSD Slingshot model, and disciplined execution.</p>
        </div>

        <div className="prog-cards-wrap">

          {/* ---------------------------------------- 1. ONLINE CARD (CYBER SAPPHIRE) ---------------------------------------- */}
          <div className="prog-card-container reveal-el">
            <div className={`prog-card-flipper ${flippedOnline ? 'is-flipped' : ''}`}>

              {/* Circulating Glowing Border Beam */}
              <div className="card-border-beam beam-blue" aria-hidden />

              {/* ---------------------------------------- FRONT FACE ---------------------------------------- */}
              <article className="prog-card-face prog-card-front card-theme-blue">
                {/* Corner-to-Corner Diagonal Shine Sweep on Hover */}
                <div className="card-shine-sweep sweep-blue" aria-hidden />

                {/* Ambient Top Glow */}
                <div className="card-ambient-glow glow-blue" aria-hidden />

                {/* Technical Corner Precision Studs */}
                <span className="card-corner-stud stud-tl" aria-hidden="true" />
                <span className="card-corner-stud stud-tr" aria-hidden="true" />
                <span className="card-corner-stud stud-bl" aria-hidden="true" />
                <span className="card-corner-stud stud-br" aria-hidden="true" />

                {/* Ambient Micro-Dot Constellation Mesh */}
                <div className="card-ambient-mesh" aria-hidden="true" />

                {/* Top Meta Bar */}
                <div className="card-top-bar">
                  <span className="card-tier-pill tier-pill-blue">
                    <span className="tier-dot dot-blue" />
                    ONLINE MENTORSHIP
                  </span>
                  <span className="card-status-badge badge-blue">
                    {isBatchLive ? '● COHORT ACTIVE · CLOSED' : 'LIVE 1-ON-1'}
                  </span>
                </div>

                {/* Integrated Title & Price Hero */}
                <div className="card-header-main">
                  <div className="card-title-group">
                    <h3 className="card-main-title title-blue">Personal Mentorship</h3>
                    <p className="card-main-desc">Private 1-on-1 Zoom sessions with zero limits · Direct mentor access</p>
                  </div>

                  <div className="card-price-ribbon ribbon-blue">
                    <div className="price-primary">
                      <span className="price-curr">₹</span>
                      <span className="price-digits">24,999</span>
                      <span className="price-suffix">/-</span>
                    </div>
                    <div className="price-divider" />
                    <div className="price-meta">
                      <strong>One-Time Investment</strong>
                      <span>Unlimited Sessions · No Subscription</span>
                    </div>
                  </div>
                </div>

                {/* Trading Specifications Matrix */}
                <div className="card-matrix">
                  <div className="matrix-row">
                    <span className="matrix-icon icon-blue">🏹</span>
                    <div className="matrix-text">
                      <strong>XAUUSD Slingshot Strategy</strong>
                      <span>Our own proven model — check PNL reports</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-blue">📊</span>
                    <div className="matrix-text">
                      <strong>2 to 3R Trades · 5-7 Entries/Week</strong>
                      <span>Consistent, high-probability institutional setups</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-blue">👨‍💻</span>
                    <div className="matrix-text">
                      <strong>Live Trading Sessions</strong>
                      <span>Execute and plan real-market trades live with mentor</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-blue">📈</span>
                    <div className="matrix-text">
                      <strong>Full HD Recordings & Custom Model</strong>
                      <span>Permanent replay archive + personalized setup plan</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-blue">💬</span>
                    <div className="matrix-text">
                      <strong>WhatsApp VIP Plan Sharing Group</strong>
                      <span>Direct mentor follow-up & community discussion</span>
                    </div>
                  </div>
                </div>

                {/* Syllabus Flip Action */}
                <div className="card-flip-wrap">
                  <button
                    type="button"
                    className="card-flip-btn flip-btn-blue"
                    onClick={() => setFlippedOnline(true)}
                  >
                    <span>Explore Full 13-Topic Syllabus</span>
                    <span className="flip-rot-icon">⟳</span>
                  </button>
                </div>

                {/* CoinDCX Slide Button */}
                <div className="card-slider-wrap">
                  <SlideToEnroll
                    label="Slide to Enroll"
                    disabled={isBatchLive}
                    disabledLabel="Enrollment Closed · Cohort is Live"
                    successLabel="Enrolled! Opening Form..."
                    colorVariant="blue"
                    onSuccess={() => handleEnroll('Personal Mentorship (Online Mode - ₹24,999)')}
                  />
                </div>
              </article>

              {/* ---------------------------------------- BACK FACE (FLIPPED) ---------------------------------------- */}
              <article className="prog-card-face prog-card-back card-theme-blue">
                {/* Technical Corner Precision Studs */}
                <span className="card-corner-stud stud-tl" aria-hidden="true" />
                <span className="card-corner-stud stud-tr" aria-hidden="true" />
                <span className="card-corner-stud stud-bl" aria-hidden="true" />
                <span className="card-corner-stud stud-br" aria-hidden="true" />

                {/* Ambient Micro-Dot Constellation Mesh */}
                <div className="card-ambient-mesh" aria-hidden="true" />

                <div className="back-top-bar">
                  <div>
                    <span className="card-tier-pill tier-pill-blue">01 / ONLINE CURRICULUM</span>
                    <h4 className="back-title">Complete Mentorship Scope</h4>
                  </div>
                  <button
                    type="button"
                    className="back-close-btn"
                    onClick={() => setFlippedOnline(false)}
                    aria-label="Back to card overview"
                  >
                    ✕ Flip Back
                  </button>
                </div>

                <ScrollableCurriculum className="scroll-blue">
                  <div className="back-section-block">
                    <span className="back-block-heading">CORE ICT & INSTITUTIONAL CONCEPTS</span>
                    <ul className="back-syllabus-list">
                      <li>⚜️ Basics Of Forex Market</li>
                      <li>⚜️ Propfirms & Their Rules</li>
                      <li>⚜️ What is Basics Price Action & Intro to ICT</li>
                      <li>⚜️ Market Structure Understanding</li>
                      <li>⚜️ Orderblocks & Types</li>
                      <li>⚜️ Liquidity & Its Illustrations</li>
                      <li>⚜️ Premium & Discount Equilibrium</li>
                      <li>⚜️ SMT Divergence</li>
                      <li>⚜️ Timeframe Alignment & Analysis</li>
                      <li>⚜️ What is Sessions & It's Behaviour</li>
                      <li>⚜️ Precision Models For EURUSD, NAS100, XAUUSD, AUDUSD, USDJPY</li>
                      <li>⚜️ Institutional Risk Management & Trader Psychology</li>
                      <li className="back-special-chapter chapter-blue">💠 New Chapter: Characters Understanding of Currency Pairs</li>
                    </ul>
                  </div>

                  <div className="back-section-block">
                    <span className="back-block-heading">DELIVERY & POST-BATCH ACCESS</span>
                    <ul className="back-syllabus-list">
                      <li>👨‍💻 <strong>Live Trading Access:</strong> Real-time session access to plan trades together</li>
                      <li>📈 <strong>Class Recordings:</strong> Permanent replay access for every session</li>
                      <li>🤝 <strong>Personalised Model:</strong> Tailored setup tailored to your schedule & psychology</li>
                      <li>📱 <strong>WhatsApp VIP:</strong> Direct Slingshot model plan sharing community</li>
                    </ul>
                  </div>
                </ScrollableCurriculum>

                <div className="back-bottom-bar">
                  <SlideToEnroll
                    label="Slide to Enroll Now"
                    disabled={isBatchLive}
                    disabledLabel="Enrollment Closed · Cohort is Live"
                    successLabel="Confirmed! Opening..."
                    colorVariant="blue"
                    onSuccess={() => handleEnroll('Personal Mentorship (Online Mode - ₹24,999)')}
                  />
                </div>
              </article>

            </div>
          </div>


          {/* ---------------------------------------- 2. OFFLINE CARD (IMPERIAL GOLD) ---------------------------------------- */}
          <div className="prog-card-container reveal-el">
            <div className={`prog-card-flipper ${flippedOffline ? 'is-flipped' : ''}`}>

              {/* Circulating Glowing Border Beam */}
              <div className="card-border-beam beam-gold" aria-hidden />

              {/* ---------------------------------------- FRONT FACE ---------------------------------------- */}
              <article className="prog-card-face prog-card-front card-theme-gold">
                {/* Corner-to-Corner Diagonal Shine Sweep on Hover */}
                <div className="card-shine-sweep sweep-gold" aria-hidden />

                {/* Ambient Top Glow */}
                <div className="card-ambient-glow glow-gold" aria-hidden />

                {/* Technical Corner Precision Studs */}
                <span className="card-corner-stud stud-tl" aria-hidden="true" />
                <span className="card-corner-stud stud-tr" aria-hidden="true" />
                <span className="card-corner-stud stud-bl" aria-hidden="true" />
                <span className="card-corner-stud stud-br" aria-hidden="true" />

                {/* Ambient Micro-Dot Constellation Mesh */}
                <div className="card-ambient-mesh" aria-hidden="true" />

                {/* Top Meta Bar */}
                <div className="card-top-bar">
                  <span className="card-tier-pill tier-pill-gold">
                    <span className="tier-dot dot-gold" />
                    OFFLINE BOOTCAMP
                  </span>
                  <span className="card-status-badge badge-gold">
                    {isBatchLive ? '● BATCH IN SESSION · CLOSED' : '10 SLOTS ONLY'}
                  </span>
                </div>

                {/* Integrated Title & Price Hero */}
                <div className="card-header-main">
                  <div className="card-title-group">
                    <h3 className="card-main-title title-gold">Slingshot Model</h3>
                    <p className="card-main-desc">8-Day in-person intensive bootcamp in Singanallur, Coimbatore</p>
                  </div>

                  <div className="card-price-ribbon ribbon-gold">
                    <div className="price-primary">
                      <span className="price-curr curr-gold">₹</span>
                      <span className="price-digits digits-gold">19,999</span>
                      <span className="price-suffix suffix-gold">/-</span>
                    </div>
                    <div className="price-divider" />
                    <div className="price-meta">
                      <strong>One-Time Fee</strong>
                      <span>Lunch Included · Aug 7th–14th</span>
                    </div>
                  </div>
                </div>

                {/* Trading Specifications Matrix */}
                <div className="card-matrix">
                  <div className="matrix-row">
                    <span className="matrix-icon icon-gold">📅</span>
                    <div className="matrix-text">
                      <strong>Aug 7th — Aug 14th</strong>
                      <span>8 full immersion days · 10:00 AM to 6:00 PM IST daily</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-gold">📍</span>
                    <div className="matrix-text">
                      <strong>Singanallur, Coimbatore</strong>
                      <span>Physical classroom environment & live chart execution</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-gold">🍽️</span>
                    <div className="matrix-text">
                      <strong>Complimentary Lunch</strong>
                      <span>Fresh meals provided daily for all 8 days</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-gold">🏹</span>
                    <div className="matrix-text">
                      <strong>Proprietary Slingshot Framework</strong>
                      <span>Step-by-step institutional XAUUSD execution system</span>
                    </div>
                  </div>
                  <div className="matrix-row">
                    <span className="matrix-icon icon-gold">👥</span>
                    <div className="matrix-text">
                      <strong>Strict 10-Trader Cohort</strong>
                      <span>Capped for maximum personal attention & 1-on-1 review</span>
                    </div>
                  </div>
                </div>

                {/* Syllabus Flip Action */}
                <div className="card-flip-wrap">
                  <button
                    type="button"
                    className="card-flip-btn flip-btn-gold"
                    onClick={() => setFlippedOffline(true)}
                  >
                    <span>Explore Bootcamp Schedule & Topics</span>
                    <span className="flip-rot-icon">⟳</span>
                  </button>
                </div>

                {/* CoinDCX Slide Button */}
                <div className="card-slider-wrap">
                  <SlideToEnroll
                    label="Slide to Reserve Seat"
                    disabled={isBatchLive}
                    disabledLabel="Enrollment Closed · Cohort is Live"
                    successLabel="Seat Reserved! Opening Form..."
                    colorVariant="gold"
                    onSuccess={() => handleEnroll('Slingshot Model (Offline Intensive - ₹19,999)')}
                  />
                </div>
              </article>

              {/* ---------------------------------------- BACK FACE (FLIPPED) ---------------------------------------- */}
              <article className="prog-card-face prog-card-back card-theme-gold">
                {/* Technical Corner Precision Studs */}
                <span className="card-corner-stud stud-tl" aria-hidden="true" />
                <span className="card-corner-stud stud-tr" aria-hidden="true" />
                <span className="card-corner-stud stud-bl" aria-hidden="true" />
                <span className="card-corner-stud stud-br" aria-hidden="true" />

                {/* Ambient Micro-Dot Constellation Mesh */}
                <div className="card-ambient-mesh" aria-hidden="true" />

                <div className="back-top-bar">
                  <div>
                    <span className="card-tier-pill tier-pill-gold">02 / OFFLINE BOOTCAMP</span>
                    <h4 className="back-title">Bootcamp Logistics & Topics</h4>
                  </div>
                  <button
                    type="button"
                    className="back-close-btn"
                    onClick={() => setFlippedOffline(false)}
                    aria-label="Back to card overview"
                  >
                    ✕ Flip Back
                  </button>
                </div>

                <ScrollableCurriculum className="scroll-gold">
                  <div className="back-section-block">
                    <span className="back-block-heading">EVENT SCHEDULE & LOGISTICS</span>
                    <ul className="back-syllabus-list">
                      <li>📅 <strong>Dates:</strong> October 15th – October 22nd, 2026 (8 Full Days)</li>
                      <li>⏰ <strong>Timings:</strong> 10:00 AM – 6:00 PM IST</li>
                      <li>📍 <strong>Venue:</strong> Singanallur, Coimbatore</li>
                      <li>🍽️ <strong>Food:</strong> Complimentary lunch provided daily</li>
                      <li>🔥 <strong>Capacity:</strong> Strict limit of 10 attendees for dedicated mentorship</li>
                    </ul>
                  </div>

                  <div className="back-section-block">
                    <span className="back-block-heading">INTENSIVE CURRICULUM COVERED</span>
                    <ul className="back-syllabus-list">
                      <li>🏹 <strong>XAUUSD - SLINGSHOT:</strong> Introducing our proprietary strategy</li>
                      <li>⚜️ Basics Of Forex Market & Propfirm Rules</li>
                      <li>⚜️ Price Action & ICT Market Structure</li>
                      <li>⚜️ Orderblocks, Liquidity & Illustrations</li>
                      <li>⚜️ Premium & Discount Equilibrium</li>
                      <li>⚜️ SMT Divergence across correlated pairs</li>
                      <li>⚜️ Multi-Timeframe Alignment & Session Behaviors</li>
                      <li>⚜️ Concrete Models for EURUSD, NAS100, XAUUSD, AUDUSD, USDJPY</li>
                      <li>⚜️ Institutional Risk Management & Trader Psychology</li>
                      <li className="back-special-chapter chapter-gold">💠 New Chapter: Characters Understanding of Currency Pairs</li>
                      <li>📱 Slingshot Model Plan Sharing WhatsApp group access</li>
                    </ul>
                  </div>
                </ScrollableCurriculum>

                <div className="back-bottom-bar">
                  <SlideToEnroll
                    label="Slide to Reserve Slot"
                    disabled={isBatchLive}
                    disabledLabel="Enrollment Closed · Cohort is Live"
                    successLabel="Confirmed! Opening..."
                    colorVariant="gold"
                    onSuccess={() => handleEnroll('Slingshot Model (Offline Intensive - ₹19,999)')}
                  />
                </div>
              </article>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------------------------------- STUDENT PAYOUT 3D SPHERE SHOWCASE ---------------------------------------- */}
      <StudentPayoutSection />

      {/* ---------------------------------------- STUDENT FEEDBACK 3D CARD DECK ---------------------------------------- */}
      <StudentFeedbackSection />

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
        <div className="contact-copy reveal-el">
          <p className="section-tag">10 / GET STARTED</p>
          <h2>Take the first<br /><em>intentional step.</em></h2>
          <p>Tell us where you are in your trading journey. We'll review your background and share the next batch schedule directly.</p>
          <a href="tel:+918637478662" className="contact-link">
            <span className="cn-link-glyph">📞</span> +91 86374 78662
          </a>
          <a href="https://wa.me/918637478662?text=Hi%20Praveen,%20I'm%20interested%20in%20the%20Pravyn%20ICT%20Mentorship" target="_blank" rel="noreferrer" className="contact-link">
            <span className="cn-link-glyph">💬</span> WhatsApp: +91 86374 78662
          </a>
          <a href="mailto:pravyntraderweb@gmail.com" className="contact-link">
            <span className="cn-link-glyph">✉</span> pravyntraderweb@gmail.com
          </a>

          <div className="cn-routing-box">
            <div className="cn-routing-head">
              <span className="cn-routing-dot" />
              <span className="cn-routing-title">VERIFIED DIRECT RECIPIENT</span>
            </div>
            <p className="cn-routing-desc">
              All messages transmit exclusively to Mentor Praveen:
              <strong className="cn-routing-email">pravyntraderweb@gmail.com</strong>
            </p>
          </div>
        </div>

        {contactStatus === 'success' ? (
          <div className="contact-success-card reveal-el" role="status" aria-live="polite">
            <div className="cn-success-icon-wrap">
              <svg className="cn-check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="cn-success-badge">ENQUIRY DELIVERED</span>
            <h3>Message Sent Successfully!</h3>
            <p className="cn-success-note">
              {contactStatusMsg || (
                <>Your inquiry was transmitted directly to <strong>pravyntraderweb@gmail.com</strong>. Mentor Praveen will review your background and reach out within 24 hours.</>
              )}
            </p>

            <div className="cn-success-summary">
              <div className="cn-summary-row">
                <span>Sender:</span>
                <strong>{contactData.name} ({contactData.email})</strong>
              </div>
              {contactData.phone && (
                <div className="cn-summary-row">
                  <span>Phone / WA:</span>
                  <strong>{contactData.phone}</strong>
                </div>
              )}
              <div className="cn-summary-row">
                <span>Destination:</span>
                <strong className="cn-dest-pill">pravyntraderweb@gmail.com</strong>
              </div>
            </div>

            <button
              type="button"
              className="button button-ghost cn-reset-btn"
              onClick={handleResetForm}
            >
              <span>Send another message</span>
              <Arrow />
            </button>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} noValidate className="contact-form reveal-el">
            <div className="cn-field-group">
              <label htmlFor="cn-name">
                <span>YOUR NAME</span>
                <span className="cn-req">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="cn-name"
                value={contactData.name}
                onChange={handleContactChange}
                onBlur={handleContactBlur}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={contactStatus === 'submitting'}
                className={contactTouched.name && contactErrors.name ? 'is-invalid' : (contactTouched.name && !contactErrors.name && contactData.name ? 'is-valid' : '')}
              />
              {contactTouched.name && contactErrors.name && (
                <p className="field-error" role="alert">
                  <span className="field-error-icon">⚠</span>
                  {contactErrors.name}
                </p>
              )}
            </div>

            <div className="cn-field-group">
              <label htmlFor="cn-email">
                <span>EMAIL ADDRESS</span>
                <span className="cn-req">*</span>
              </label>
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
                className={contactTouched.email && contactErrors.email ? 'is-invalid' : (contactTouched.email && !contactErrors.email && contactData.email ? 'is-valid' : '')}
              />
              {contactTouched.email && contactErrors.email && (
                <p className="field-error" role="alert">
                  <span className="field-error-icon">⚠</span>
                  {contactErrors.email}
                </p>
              )}
            </div>

            <div className="cn-field-group">
              <label htmlFor="cn-phone">
                <span>PHONE / WHATSAPP</span>
                <span className="cn-opt">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="cn-phone"
                value={contactData.phone}
                onChange={handleContactChange}
                onBlur={handleContactBlur}
                placeholder="+91 86374 78662"
                autoComplete="tel"
                disabled={contactStatus === 'submitting'}
                className={contactTouched.phone && contactErrors.phone ? 'is-invalid' : ''}
              />
              {contactTouched.phone && contactErrors.phone && (
                <p className="field-error" role="alert">
                  <span className="field-error-icon">⚠</span>
                  {contactErrors.phone}
                </p>
              )}
            </div>

            <div className="cn-field-group">
              <label htmlFor="cn-msg">
                <span>TRADING GOALS & MESSAGE</span>
                <span className="cn-req">*</span>
              </label>
              <textarea
                name="message"
                id="cn-msg"
                rows={3}
                value={contactData.message}
                onChange={handleContactChange}
                onBlur={handleContactBlur}
                placeholder="Tell us where you are in your trading journey…"
                disabled={contactStatus === 'submitting'}
                className={contactTouched.message && contactErrors.message ? 'is-invalid' : (contactTouched.message && !contactErrors.message && contactData.message ? 'is-valid' : '')}
              />
              {contactTouched.message && contactErrors.message && (
                <p className="field-error" role="alert">
                  <span className="field-error-icon">⚠</span>
                  {contactErrors.message}
                </p>
              )}
            </div>

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

            <button
              className="button button-primary glow-heavy"
              type="submit"
              id="cn-submit"
              disabled={contactStatus === 'submitting'}
            >
              {contactStatus === 'submitting' ? (
                <>
                  <span className="cn-spinner" aria-hidden />
                  <span>Transmitting to pravyntraderweb@gmail.com...</span>
                </>
              ) : (
                <>
                  <span>Send enquiry to pravyntraderweb@gmail.com</span>
                  <Arrow />
                </>
              )}
            </button>

            <div className="cn-form-footer">
              <span className="cn-secure-lock">🔒 Direct SSL Delivery to <strong>pravyntraderweb@gmail.com</strong></span>
              <p className="form-note">We respond within 24 hours.</p>
            </div>
          </form>
        )}
      </section>

      {/* ---------------------------------------- FOOTER ---------------------------------------- */}
      <footer>
        <a className="brand" href="#home"><span>PRAVYN</span><em>ICT</em></a>
        <nav>{NAV_LINKS.map(l => <a key={l.href} href={l.href}>{l.label}</a>)}</nav>
        <p>© {new Date().getFullYear()} PRAVYN ICT. Educational content only.</p>
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
              <Bag />
              <h4>Your cart is empty</h4>
              <p>Add a course to get started on your edge.</p>
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
