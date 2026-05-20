import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({ children, animation = 'fadeInUp', delay = 0, duration = 0.6, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'is-visible' : ''}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : (animation === 'fadeInUp' ? 'translateY(40px)' : animation === 'zoomIn' ? 'scale(0.95)' : 'none'),
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
