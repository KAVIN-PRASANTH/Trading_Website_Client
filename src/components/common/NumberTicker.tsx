import React, { useEffect, useRef, useState } from 'react'

interface NumberTickerProps {
  value: number
  direction?: 'up' | 'down'
  delay?: number // in seconds
  className?: string
  prefix?: string
  suffix?: string
  formatWithCommas?: boolean
  decimalPlaces?: number
  duration?: number // in seconds
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  formatWithCommas = false,
  decimalPlaces = 0,
  duration = 1.6,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(() =>
    direction === 'down' ? value : 0
  )
  const containerRef = useRef<HTMLSpanElement | null>(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true

      const startTime = performance.now() + delay * 1000
      const startVal = direction === 'down' ? value : 0
      const endVal = direction === 'down' ? 0 : value
      const totalDuration = duration * 1000

      const updateCount = (currentTime: number) => {
        if (currentTime < startTime) {
          requestAnimationFrame(updateCount)
          return
        }

        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / totalDuration, 1)

        // Smooth cubic ease-out for realistic decelerating count
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentVal = startVal + (endVal - startVal) * easeOut

        setDisplayValue(currentVal)

        if (progress < 1) {
          requestAnimationFrame(updateCount)
        } else {
          setDisplayValue(endVal)
        }
      }

      requestAnimationFrame(updateCount)
    }

    const checkAndAnimate = () => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        startAnimation()
        return true
      }
      return false
    }

    if (checkAndAnimate()) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          startAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px 0px 50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, direction, delay, duration])

  // Format the number
  let formattedNumber = displayValue.toFixed(decimalPlaces)
  if (formatWithCommas) {
    const parts = formattedNumber.split('.')
    parts[0] = parseInt(parts[0], 10).toLocaleString('en-US')
    formattedNumber = parts.join('.')
  }

  return (
    <span
      ref={containerRef}
      aria-label={`${prefix}${value.toFixed(decimalPlaces)}${suffix}`}
      className={`number-ticker-root ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        fontSize: 'inherit',
        fontWeight: 'inherit',
        lineHeight: 'inherit',
        color: 'inherit',
      }}
    >
      {prefix && (
        <span
          className="number-ticker-prefix"
          style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
        >
          {prefix}
        </span>
      )}
      <span
        className="number-ticker-value"
        style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
      >
        {formattedNumber}
      </span>
      {suffix && (
        <span
          className="number-ticker-suffix"
          style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}
        >
          {suffix}
        </span>
      )}
    </span>
  )
}
