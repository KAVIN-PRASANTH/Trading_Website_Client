import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import './floatingContactOrbit.css'

/* ══════════════════════════════════════════════════════════════
   REAL CONTACT DESTINATIONS
   WhatsApp: Mentorship line +91 86374 78662
   Instagram: @pravyn_ict with direct profile query token
   Email: Mentorship team pravyntraderweb@gmail.com
   ══════════════════════════════════════════════════════════════ */
const WHATSAPP_URL = 'https://wa.me/918637478662?text=Hi%20Praveen,%20I%20would%20like%20to%20enquire%20about%20Pravyn%20ICT%20Mentorship.'
const INSTAGRAM_URL = 'https://www.instagram.com/pravyn_ict?stkn=dDQ5ZW5wMWpxNnBu'
const EMAIL_URL = 'mailto:pravyntraderweb@gmail.com?subject=Enquiry%20%E2%80%94%20Pravyn%20ICT%20Mentorship'

/* ══════════════════════════════════════════════════════════════
   CRISP VECTOR BRAND ICONS
   ══════════════════════════════════════════════════════════════ */

/* Pravyn Signature 4-Point Precision Spark / Brand Mark */
const PravynSparkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="fco-hub-mark-spark"
  >
    <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z" />
  </svg>
)

/* Minimal Close Cross Icon */
const CloseCrossIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="fco-hub-mark-close"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

/* WhatsApp Official Brand Vector */
const WhatsAppSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.52 3.48A11.93 11.93 0 0 0 12.06 0C5.45 0 .08 5.37.08 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.93 11.93 0 0 0 5.86 1.53h.01c6.61 0 11.98-5.37 11.98-11.98 0-3.2-.1.25-1.25-6.24-3.54-8.44zM12.07 21.9a9.92 9.92 0 0 1-5.06-1.39l-.36-.21-3.76.99 1-3.66-.23-.38a9.93 9.93 0 0 1-1.52-5.27c0-5.49 4.47-9.96 9.96-9.96 2.66 0 5.16 1.04 7.04 2.92a9.92 9.92 0 0 1 2.92 7.05c0 5.49-4.47 9.91-9.99 9.91zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52-.18-.01-.38-.01-.58-.01-.2 0-.53.08-.8.38-.28.3-1.07 1.05-1.07 2.56 0 1.51 1.1 2.97 1.25 3.17.15.2 2.16 3.3 5.23 4.63.73.32 1.3.51 1.74.65.73.23 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.13-.28-.2-.58-.35z" />
  </svg>
)

/* Instagram Official Brand Vector */
const InstagramSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
  </svg>
)

/* Email / Direct Mail Envelope Vector */
const EmailSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT: FLOATING CONTACT ORBIT
   ══════════════════════════════════════════════════════════════ */
export const FloatingContactOrbit: React.FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const hubButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear pending timer helper
  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  // Toggle Hub Open/Close (Click / Tap)
  const handleToggleHub = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    clearCloseTimer()
    setIsOpen((prev) => !prev)
  }, [clearCloseTimer])

  // Desktop Hover Enter — Graceful expansion
  const handleMouseEnter = useCallback(() => {
    clearCloseTimer()
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setIsOpen(true)
    }
  }, [clearCloseTimer])

  // Desktop Hover Leave — Delayed collapse with comfortable safety buffer
  const handleMouseLeave = useCallback(() => {
    clearCloseTimer()
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      closeTimerRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 450)
    }
  }, [clearCloseTimer])

  // Direct Click Handler for destinations (ensures immediate reliable opening)
  const handleActionClick = useCallback((url: string, isExternal = true) => {
    if (!isOpen) return
    clearCloseTimer()
    if (isExternal) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = url
    }
    // Collapse smoothly after interaction
    setTimeout(() => {
      setIsOpen(false)
    }, 280)
  }, [clearCloseTimer, isOpen])

  // Click / Tap Outside Listener
  useEffect(() => {
    if (!isOpen) return

    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        hubButtonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDownOutside)
    document.addEventListener('touchstart', handlePointerDownOutside, { passive: true })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDownOutside)
      document.removeEventListener('touchstart', handlePointerDownOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearCloseTimer()
  }, [clearCloseTimer])

  return (
    <aside
      ref={rootRef}
      className={`fco-root ${isOpen ? 'is-open' : ''}`}
      aria-label="Pravyn ICT Direct Contact Orbit"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="fco-ambient-float">
        {/* ── 3D Orbit Stage ───────────────────────────────── */}
        <div className="fco-orbit-stage" aria-hidden={!isOpen}>
          {/* Faint Subtle Dashed Circular Orbit Arc Guide */}
          <svg className="fco-orbit-wire" viewBox="0 0 170 170" fill="none" aria-hidden="true">
            {/* Circular arc centered at bottom-right corner (170, 170) with R=88 */}
            <path
              d="M 82 170 A 88 88 0 0 1 170 82"
              stroke="rgba(56, 189, 248, 0.14)"
              strokeWidth="1.2"
              strokeDasharray="2 4"
            />
            {/* Guide micro-dots at node positions */}
            <circle cx="85" cy="152" r="1.5" fill="rgba(34, 197, 94, 0.45)" />
            <circle cx="110" cy="106" r="1.5" fill="rgba(244, 114, 182, 0.45)" />
            <circle cx="160" cy="84" r="1.5" fill="rgba(56, 189, 248, 0.45)" />
          </svg>

          {/* 1. WhatsApp Contact Node (Flank Left) */}
          <div className="fco-node fco-node-whatsapp">
            <div className="fco-orbit-drifter">
              <a
                href={isOpen ? WHATSAPP_URL : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="fco-action-link fco-link-whatsapp"
                aria-label="WhatsApp — Chat with Praveen (+91 86374 78662)"
                title="WhatsApp"
                tabIndex={isOpen ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault()
                  if (!isOpen) return
                  handleActionClick(WHATSAPP_URL, true)
                }}
              >
                <span className="fco-icon-shell">
                  <WhatsAppSvg />
                </span>
              </a>
            </div>
          </div>

          {/* 2. Instagram Contact Node (Center Apex) */}
          <div className="fco-node fco-node-instagram">
            <div className="fco-orbit-drifter">
              <a
                href={isOpen ? INSTAGRAM_URL : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="fco-action-link fco-link-instagram"
                aria-label="Instagram — @pravyn_ict"
                title="Instagram"
                tabIndex={isOpen ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault()
                  if (!isOpen) return
                  handleActionClick(INSTAGRAM_URL, true)
                }}
              >
                <span className="fco-icon-shell">
                  <InstagramSvg />
                </span>
              </a>
            </div>
          </div>

          {/* 3. Email Contact Node (Top Flank) */}
          <div className="fco-node fco-node-email">
            <div className="fco-orbit-drifter">
              <a
                href={isOpen ? EMAIL_URL : undefined}
                className="fco-action-link fco-link-email"
                aria-label="Email — pravyntraderweb@gmail.com"
                title="Email"
                tabIndex={isOpen ? 0 : -1}
                onClick={(e) => {
                  e.preventDefault()
                  if (!isOpen) return
                  handleActionClick(EMAIL_URL, false)
                }}
              >
                <span className="fco-icon-shell">
                  <EmailSvg />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Central Anchor Hub ────────────────────────────── */}
        <button
          ref={hubButtonRef}
          type="button"
          className="fco-hub"
          onClick={handleToggleHub}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label={
            isOpen
              ? 'Close contact orbit'
              : 'Open contact options: WhatsApp, Instagram, and Email'
          }
        >
          {/* Subtle Ambient Radar Ping Indicator */}
          <span className="fco-hub-ping" aria-hidden="true" />

          {/* Central Rotating Icon Mark */}
          <div className="fco-hub-icon-wrap" aria-hidden="true">
            <span className="fco-hub-mark">
              <PravynSparkIcon />
              <CloseCrossIcon />
            </span>
          </div>
        </button>
      </div>
    </aside>
  )
})

FloatingContactOrbit.displayName = 'FloatingContactOrbit'
