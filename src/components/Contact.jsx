import { useState } from 'react'
import { sendContactMessage } from '../services/api'
import ScrollReveal from './ScrollReveal'

const CONTACT_ITEMS = [
  {
    id: 'email',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <polyline points="2,4 12,13 22,4"/>
      </svg>
    ),
    text: 'arildani60@gmail.com',
    href: 'mailto:arildani60@gmail.com',
  },
  {
    id: 'phone',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012.18 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.08 6.08l1.27-.95a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    text: '+62 822-9278-1754',
    href: 'tel:+6282292781754',
  },
]

const SOCIAL_LINKS = [
  {
    name: 'TikTok',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.34 6.34 0 0 0 6.25-6.36V7.9a8.36 8.36 0 0 0 4.19 1.48V6.15a4.84 4.84 0 0 1-2.12-.46z"/>
      </svg>
    )
  },
  {
    name: 'Instagram',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    )
  }
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    try {
      await sendContactMessage(form)
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container contact__inner">
        {/* Left – Contact Info */}
        <ScrollReveal animation="fadeInUp">
          <span className="badge" style={{ marginBottom: 16, display: 'inline-flex' }}>Contact</span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 10, letterSpacing: '-0.02em' }}>
            Get in Touch
          </h2>
          <p style={{ fontSize: '0.93rem', color: 'var(--text-light)', marginBottom: 36, lineHeight: 1.7 }}>
            Have questions? We're here to help!<br />
            Reach out and we'll get back to you within 24 hours.
          </p>

          {CONTACT_ITEMS.map(item => (
            <div key={item.id} className="contact__detail" style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }}
                 onMouseEnter={e => e.currentTarget.style.transform = 'translateX(5px)'}
                 onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}>
              <div className="contact__detail-icon">{item.icon}</div>
              <a href={item.href} className="contact__detail-text" style={{ color: 'var(--text-mid)', transition: 'color 0.2s' }}
                 onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                 onMouseLeave={e => e.currentTarget.style.color = 'var(--text-mid)'}
              >
                {item.text}
              </a>
            </div>
          ))}

          {/* Social Links */}
          <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
            {SOCIAL_LINKS.map(social => (
              <a
                key={social.name}
                href="#"
                id={`social-${social.name.toLowerCase()}`}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-light)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--primary)'
                  e.currentTarget.style.borderColor = 'var(--primary)'
                  e.currentTarget.style.color = '#fff'
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-light)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </ScrollReveal>

        {/* Right – Contact Form */}
        <ScrollReveal animation="fadeInUp" delay={0.2}>
          <form className="contact__form" id="contact-form" onSubmit={handleSubmit} noValidate>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Your Name"
              className="form-input"
              value={form.name}
              onChange={handleChange}
              required
              disabled={status === 'loading'}
            />
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Your Email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
              disabled={status === 'loading'}
            />
            <textarea
              id="contact-message"
              name="message"
              placeholder="Your Message"
              className="form-input"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
              disabled={status === 'loading'}
            />

            {status === 'success' && (
              <div style={{
                background: '#ECFDF5', color: '#065F46',
                padding: '12px 16px', borderRadius: 8,
                fontSize: '0.88rem', fontWeight: 500,
                border: '1px solid #6EE7B7',
              }}>
                ✅ Message sent! We'll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div style={{
                background: '#FEF2F2', color: '#991B1B',
                padding: '12px 16px', borderRadius: 8,
                fontSize: '0.88rem', fontWeight: 500,
                border: '1px solid #FCA5A5',
              }}>
                ❌ Something went wrong. Please try again.
              </div>
            )}

            <button
              id="contact-submit-btn"
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ alignSelf: 'flex-end', minWidth: 160, justifyContent: 'center' }}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                  Sending…
                </>
              ) : 'Send Message'}
            </button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}
