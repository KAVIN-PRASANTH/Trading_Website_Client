import React, { FormEvent, memo, useCallback, useEffect, useRef, useState } from 'react'
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

/* ---------------------------------------- Countdown ---------------------------------------- */
const BATCH_TARGET = new Date('2026-10-15T09:00:00+05:30')
function useCountdown(target: Date) {
  const calc = () => {
    const d = Math.max(0, target.getTime() - Date.now())
    return { days: Math.floor(d / 86400000), hours: Math.floor((d % 86400000) / 3600000), minutes: Math.floor((d % 3600000) / 60000), seconds: Math.floor((d % 60000) / 1000) }
  }
  const [t, setT] = useState(calc)
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id) }, [])
  return t
}
const pad = (n: number) => String(n).padStart(2, '0')

const BatchCountdown = memo(function BatchCountdown() {
  const countdown = useCountdown(BATCH_TARGET)
  return (
    <div className="countdown-row">
      <div className="cu"><b>{pad(countdown.days)}</b><small>DAYS</small></div>
      <div className="csep">:</div>
      <div className="cu"><b>{pad(countdown.hours)}</b><small>HRS</small></div>
      <div className="csep">:</div>
      <div className="cu"><b>{pad(countdown.minutes)}</b><small>MIN</small></div>
      <div className="csep">:</div>
      <div className="cu"><b>{pad(countdown.seconds)}</b><small>SEC</small></div>
    </div>
  )
})

const NAV_LINKS = [
  { href: '#method',     label: 'Method'     },
  { href: '#programmes', label: 'Programmes' },
  { href: '#student-payout', label: 'Student Payout' },
  { href: '#testimonials', label: 'Reviews'  },
  { href: '#videos',     label: 'Videos'     },
  { href: '#batch',      label: 'Batch'      },
]

/* ---------------------------------------- CoinDCX-Style Slide Button ---------------------------------------- */
interface SlideToEnrollProps {
  label: string
  successLabel?: string
  colorVariant?: 'blue' | 'gold'
  onSuccess: () => void
}

function SlideToEnroll({
  label,
  successLabel = 'Enrolled! Redirecting...',
  colorVariant = 'blue',
  onSuccess,
}: SlideToEnrollProps) {
  const [sliderPos, setSliderPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const isCompletedRef = useRef(false)

  const triggerComplete = useCallback(() => {
    if (isCompletedRef.current) return
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
  }, [onSuccess])

  const handleStart = (clientX: number) => {
    if (isCompletedRef.current) return
    setIsDragging(true)
    startX.current = clientX - sliderPos
  }

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || isCompletedRef.current || !trackRef.current) return
    const maxSlide = Math.max(0, trackRef.current.offsetWidth - 50)
    const newPos = Math.max(0, Math.min(clientX - startX.current, maxSlide))
    setSliderPos(newPos)
    if (newPos >= maxSlide * 0.75) {
      triggerComplete()
    }
  }, [isDragging, triggerComplete])

  const handleEnd = useCallback(() => {
    if (!isDragging || isCompletedRef.current) return
    setIsDragging(false)
    if (!trackRef.current) return
    const maxSlide = Math.max(0, trackRef.current.offsetWidth - 50)
    if (sliderPos >= maxSlide * 0.6) {
      triggerComplete()
    } else {
      setSliderPos(0)
    }
  }, [isDragging, sliderPos, triggerComplete])

  useEffect(() => {
    if (!isDragging) return
    const onWindowMove = (e: MouseEvent) => handleMove(e.clientX)
    const onWindowUp = () => handleEnd()
    window.addEventListener('mousemove', onWindowMove)
    window.addEventListener('mouseup', onWindowUp)
    return () => {
      window.removeEventListener('mousemove', onWindowMove)
      window.removeEventListener('mouseup', onWindowUp)
    }
  }, [isDragging, handleMove, handleEnd])

  const handleTrackClick = () => {
    if (!isCompletedRef.current && !isDragging) {
      triggerComplete()
    }
  }

  return (
    <div
      className={`slide-track slide-${colorVariant} ${isCompleted ? 'is-completed' : ''}`}
      ref={trackRef}
      onClick={handleTrackClick}
      onTouchMove={e => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      <div className="slide-progress" style={{ width: `${sliderPos + 25}px` }} />
      <span className="slide-text">
        {isCompleted ? successLabel : (
          <>
            <span className="slide-label">{label}</span>
            <span className="slide-chevrons" aria-hidden>›››</span>
          </>
        )}
      </span>
      <div
        className={`slide-knob ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform: `translateX(${sliderPos}px)` }}
        onMouseDown={e => {
          e.stopPropagation()
          handleStart(e.clientX)
        }}
        onTouchStart={e => {
          e.stopPropagation()
          handleStart(e.touches[0].clientX)
        }}
      >
        {isCompleted ? (
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
   APP
   ---------------------------------------- */
function App() {
  const handleEnroll = (programmeName: string) => {
    const contactEl = document.getElementById('contact')
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        const msgInput = document.getElementById('cn-msg') as HTMLTextAreaElement | null
        const nameInput = document.getElementById('cn-name') as HTMLInputElement | null
        if (msgInput) {
          msgInput.value = `Enquiring for enrollment in: ${programmeName}`
        }
        nameInput?.focus()
      }, 700)
    }
  }
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [scrolled,      setScrolled]      = useState(false)
  const [activeSection, setActiveSection] = useState('top')
  const [activeQs,      setActiveQs]      = useState<number[]>([0])
  const [submitted,     setSubmitted]     = useState(false)
  const [cartOpen,      setCartOpen]      = useState(false)
  const [cart,          setCart]          = useState<string[]>([])
  const [annDismissed,  setAnnDismissed]  = useState(false)
  const [flippedOnline, setFlippedOnline] = useState(false)
  const [flippedOffline, setFlippedOffline] = useState(false)

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
      if (href === '#top') {
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

  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSubmitted(true) }

  return (
    <main>
      <div className="mesh-bg" aria-hidden />
      <div className="orb orb-1" aria-hidden /><div className="orb orb-2" aria-hidden /><div className="orb orb-3" aria-hidden />

      {/* ---------------------------------------- ANNOUNCEMENT BAR ---------------------------------------- */}
      {!annDismissed && (
        <div className="ann-bar" role="banner">
          <span className="ann-live"><span className="live-dot" />LIVE</span>
          <span className="ann-text">Next Batch Starts <strong>Oct 15, 2026</strong> — Only <strong>12 Seats</strong> Available</span>
          <a href="#contact" className="ann-cta" onClick={() => setAnnDismissed(true)}>Reserve Now</a>
          <button className="ann-close" onClick={() => setAnnDismissed(true)} aria-label="Dismiss"><Close /></button>
        </div>
      )}

      {/* ---------------------------------------- HEADER ---------------------------------------- */}
      <header className={`site-header${scrolled ? ' scrolled' : ''}${annDismissed ? ' no-ann' : ''}`}>
        <a className="brand" href="#top" aria-label="Pravyn ICT home">
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
          <a className="btn-enroll" href="#contact">Enroll</a>
          <button className="menu-button" onClick={() => setMenuOpen(m => !m)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <Close /> : <Menu />}
          </button>
        </div>
      </header>

      {/* ---------------------------------------- HERO ---------------------------------------- */}
      <section className="hero" id="top" data-section="top">
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
              <a className="button button-primary glow-heavy" href="#contact" id="hero-cta">Reserve your seat <Arrow /></a>
              <a className="button button-ghost" href="#courses">
                <span className="play-wrap"><Play /></span>View courses
              </a>
            </div>
            <div className="hero-proof reveal-el dl-4">
              <div className="proof-item"><strong>500+</strong><span>Traders</span></div>
              <div className="proof-sep" />
              <div className="proof-item"><strong>4.9★</strong><span>Avg Rating</span></div>
              <div className="proof-sep" />
              <div className="proof-item"><strong>Live</strong><span>Sessions</span></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="chart-ring ring-1" /><div className="chart-ring ring-2" />
            <div className="hero-chart-card">
              <div className="hcc-header">
                <span className="hcc-pair">NIFTY50 · 5M</span>
                <span className="hcc-live"><span />LIVE</span>
              </div>
              <svg className="hcc-svg" viewBox="0 0 480 220" preserveAspectRatio="none" aria-hidden>
                <defs>
                  <linearGradient id="lg1" x1="0" x2="1"><stop stopColor="#1D4ED8"/><stop offset="1" stopColor="#60A5FA"/></linearGradient>
                  <linearGradient id="lga" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#3B82F6" stopOpacity=".3"/><stop offset="1" stopColor="#3B82F6" stopOpacity="0"/></linearGradient>
                </defs>
                {[55,110,165,220].map(y => <line key={y} x1="0" x2="480" y1={y} y2={y} stroke="rgba(59,130,246,.08)" strokeWidth="1"/>)}
                <path d="M0 200 C40 185 55 205 90 165 S130 195 160 148 S200 168 235 110 S270 142 305 75 S340 105 375 55 S420 82 450 35 S472 55 480 20" fill="none" stroke="url(#lg1)" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M0 200 C40 185 55 205 90 165 S130 195 160 148 S200 168 235 110 S270 142 305 75 S340 105 375 55 S420 82 450 35 S472 55 480 20 V220H0Z" fill="url(#lga)"/>
                <circle cx="305" cy="75" r="5" fill="#60A5FA" stroke="rgba(3,6,15,.6)" strokeWidth="3"/>
                <circle cx="480" cy="20" r="5" fill="#06B6D4" stroke="rgba(3,6,15,.6)" strokeWidth="3"/>
              </svg>
              <div className="hcc-price-tag">
                <small>EXECUTION ZONE</small>
                <strong>19,824.50</strong>
                <span className="hcc-change">↑ +1.84%</span>
              </div>
            </div>
            <div className="hero-float-tl">
              <small>LIQUIDITY</small><strong>Mapped</strong><p>◌ Intent visible</p>
            </div>
          </div>
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
          <div className="mentor-bg-grid" aria-hidden />
          <img src="/trading_leaders_animated_loop.gif" alt="Trading Leaders" className="mentor-img" />
          <div className="mentor-stat-strip">
            <div><strong>500+</strong><span>Students</span></div>
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

                {/* Top Meta Bar */}
                <div className="card-top-bar">
                  <span className="card-tier-pill tier-pill-blue">
                    <span className="tier-dot dot-blue" />
                    ONLINE MENTORSHIP
                  </span>
                  <span className="card-status-badge badge-blue">LIVE 1-ON-1</span>
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
                    successLabel="Enrolled! Opening Form..."
                    colorVariant="blue"
                    onSuccess={() => handleEnroll('Personal Mentorship (Online Mode - ₹24,999)')}
                  />
                </div>
              </article>

              {/* ---------------------------------------- BACK FACE (FLIPPED) ---------------------------------------- */}
              <article className="prog-card-face prog-card-back card-theme-blue">
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

                {/* Top Meta Bar */}
                <div className="card-top-bar">
                  <span className="card-tier-pill tier-pill-gold">
                    <span className="tier-dot dot-gold" />
                    OFFLINE BOOTCAMP
                  </span>
                  <span className="card-status-badge badge-gold">10 SLOTS ONLY</span>
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
                    successLabel="Seat Reserved! Opening Form..."
                    colorVariant="gold"
                    onSuccess={() => handleEnroll('Slingshot Model (Offline Intensive - ₹19,999)')}
                  />
                </div>
              </article>

              {/* ---------------------------------------- BACK FACE (FLIPPED) ---------------------------------------- */}
              <article className="prog-card-face prog-card-back card-theme-gold">
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
                      <li>📅 <strong>Dates:</strong> August 7th – August 14th (8 Full Days)</li>
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
          <a href="https://www.youtube.com/@pravynict" target="_blank" rel="noopener noreferrer" className="button button-ghost" id="yt-btn">Subscribe to channel <Arrow /></a>
        </div>
      </section>

      {/* ---------------------------------------- BATCH COUNTDOWN ---------------------------------------- */}
      <section className="batch-section" id="batch" data-section="batch">
        <div className="batch-bg-text" aria-hidden>OCT</div>
        <div className="batch-content">
          <div className="batch-left reveal-el">
            <p className="section-tag light">08 / UPCOMING BATCH</p>
            <h2>A seat at the<br /><em>right table.</em></h2>
            <p>Live mentorship. Real-market context. A community committed to the work.</p>
            <div className="batch-info-row">
              <div className="bi"><strong>Online</strong><small>MODE</small></div>
              <div className="bi"><strong>Oct 15</strong><small>START</small></div>
              <div className="bi"><strong>12</strong><small>SEATS LEFT</small></div>
            </div>
          </div>
          <div className="batch-right reveal-el">
            <p className="batch-label">BATCH STARTS IN</p>
            <BatchCountdown />
            <a className="button button-white" href="#contact" id="batch-cta">Claim your place <Arrow /></a>
          </div>
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
          <p>Tell us where you are in your trading journey. We'll share the next batch details directly.</p>
          <a href="tel:+918637478662" className="contact-link">+91 86374 78662</a>
          <a href="mailto:Enquiry@pravynict.com" className="contact-link">Enquiry@pravynict.com</a>
        </div>
        <form onSubmit={submit} noValidate className="contact-form reveal-el">
          <label>Your name<input required name="name" id="cn-name" placeholder="Enter your name" /></label>
          <label>Email<input required type="email" name="email" id="cn-email" placeholder="you@example.com" /></label>
          <label>Trading goals<textarea required name="message" id="cn-msg" rows={3} placeholder="Tell us where you are in your trading journey…" /></label>
          <button className="button button-primary" type="submit" id="cn-submit">
            {submitted ? 'We\'ll be in touch shortly ✓' : <><span>Send enquiry</span><Arrow /></>}
          </button>
          <p className="form-note">We respond within 24 hours.</p>
        </form>
      </section>

      {/* ---------------------------------------- FOOTER ---------------------------------------- */}
      <footer>
        <a className="brand" href="#top"><span>PRAVYN</span><em>ICT</em></a>
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
