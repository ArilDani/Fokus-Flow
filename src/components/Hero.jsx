import { useEffect, useRef, useState } from 'react'

function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const step = target / (duration / 16)
          const timer = setInterval(() => {
            start += step
            if (start >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(start))
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

export default function Hero() {
  const { count: effCount, ref: effRef } = useCounter(82)

  return (
    <section className="hero-full" id="home" ref={effRef}>
      {/* ── Full-width background image ── */}
      <div className="hero-full__bg" />

      {/* ── Left white-blur overlay ── */}
      <div className="hero-full__overlay" />

      {/* ── Content layer ── */}
      <div className="container hero-full__inner">

        {/* LEFT – Text content (sits on top of white overlay) */}
        <div className="hero-full__content">
          <div className="hero-full__eyebrow">
            <span className="badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              Gamified Productivity
            </span>
          </div>

          <h1 className="hero-full__title">
            Boost Your Productivity<br />
            with <span>Fokus Flow</span>
          </h1>

          <p className="hero-full__subtitle">
            Gamified To-Do List &amp; Smart Productivity Dashboard.<br />
            Make work fun, track your growth, and stay in flow.
          </p>

          <div className="hero-full__cta">
            <button className="btn btn-primary btn-lg" id="hero-signup-btn" onClick={() => alert('🚀 COMING SOON')}>
              Sign Up
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn btn-outline btn-lg" id="hero-learnmore-btn" onClick={() => alert('🚀 COMING SOON')}>
              Learn More
            </button>
          </div>
        </div>

        {/* CENTER – Floating stat card + pills (overlaid on the photo) */}
        <div className="hero-full__floats">

          {/* Productivity Stats Card */}
          <div className="hero-full__stat-card" id="hero-stat-card">
            <div className="hero-full__stat-label">Productivity Stats</div>
            <div className="hero-full__stat-row">
              <div className="hero-full__stat-number">{effCount}%</div>
              <div className="hero-full__stat-info">
                <span className="hero-full__stat-sub">Efficiency</span>
                {/* Mini bar chart */}
                <div className="hero-full__bars">
                  {[30, 45, 55, 70, 82, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      className="hero-full__bar"
                      style={{
                        height: `${h}%`,
                        background: h >= 80 ? 'var(--primary)' : h >= 55 ? '#60A5FA' : '#93C5FD',
                        transitionDelay: `${i * 0.07}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            {/* Arrow trend */}
            <div className="hero-full__stat-trend">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span style={{ color: '#10B981', fontSize: '0.78rem', fontWeight: 600 }}>+12% this week</span>
            </div>
          </div>

          {/* Pill – Discipline */}
          <div className="hero-full__pill hero-full__pill--discipline" id="hero-pill-discipline">
            <div className="hero-full__pill-icon" style={{ background: '#EFF6FF' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            Discipline
          </div>

          {/* Pill – Growth */}
          <div className="hero-full__pill hero-full__pill--growth" id="hero-pill-growth">
            <div className="hero-full__pill-icon" style={{ background: '#ECFDF5' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              </svg>
            </div>
            Growth
          </div>

        </div>
      </div>
    </section>
  )
}
