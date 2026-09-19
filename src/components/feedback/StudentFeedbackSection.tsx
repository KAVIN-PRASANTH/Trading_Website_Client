import React from 'react'
import { LivingProofMosaic } from './LivingProofMosaic'
import './feedback.css'

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    style={{
      width: '15px',
      height: '15px',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2.2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    }}
  >
    <path d="M5 12h13M13 6l6 6-6 6" />
  </svg>
)

export const StudentFeedbackSection: React.FC = () => {
  return (
    <section
      className="proof-mosaic-section"
      id="student-stories"
      data-section="student-stories"
      aria-label="Real Student Proof — Living Mosaic"
    >
      {/* Anchor fallback for existing testimonials links */}
      <div
        id="testimonials"
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, pointerEvents: 'none' }}
      />

      {/* Ambient background accents matching dark navy aesthetic */}
      <div className="proof-bg-radial" aria-hidden="true" />
      <div className="proof-bg-grid" aria-hidden="true" />

      {/* Editorial Section Header */}
      <div className="proof-section-header">
        <div className="proof-section-tag">
          <span className="proof-live-pulse" />
          <span>REAL STUDENT PROOF</span>
        </div>

        <h2 className="proof-section-title">
          Don’t Take Our Word For It.
        </h2>

        <p className="proof-section-sub">
          Genuine, unedited WhatsApp messages, discipline shifts, and verified milestones from our live institutional mentorship.
        </p>
      </div>

      {/* Living Proof Mosaic Stage */}
      <LivingProofMosaic />

      {/* Call To Action */}
      <div className="proof-cta-wrap">
        <a className="button button-primary" href="#programmes">
          <span className="btn-text">Join the next batch</span> <ArrowRightIcon />
        </a>
      </div>
    </section>
  )
}
