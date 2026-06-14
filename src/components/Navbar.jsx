import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const NAV_LINKS = [
  { label: 'Home', href: '#home', sectionId: 'home' },
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Process', href: '#features', sectionId: 'features' },
  { label: 'Testimonials', href: '#testimonials', sectionId: 'testimonials' },
  { label: 'Pricing', href: '#pricing', sectionId: 'pricing' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const navigate = useNavigate()
  const user = useStore((state) => state.user)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-40% 0px -60% 0px' }
    )

    NAV_LINKS.forEach(link => {
      const el = document.getElementById(link.sectionId)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container navbar__inner">
        {/* Logo */}
        <a href="#home" className="navbar__logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="14" width="5" height="11" rx="1.5" fill="currentColor" opacity=".45"/>
            <rect x="11.5" y="8" width="5" height="17" rx="1.5" fill="currentColor" opacity=".7"/>
            <rect x="20" y="3" width="5" height="22" rx="1.5" fill="currentColor"/>
          </svg>
          Fokus Flow
        </a>

        {/* Desktop Nav */}
        <nav>
          <ul className="navbar__links">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a 
                  href={link.href} 
                  className={activeSection === link.sectionId ? 'active' : ''}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          {user ? (
            <button 
              className="btn btn-primary" 
              onClick={() => navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard')}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-primary" onClick={() => navigate('/register')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
