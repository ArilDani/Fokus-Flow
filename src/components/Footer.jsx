export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.9)' }}>
          <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="14" width="5" height="11" rx="1.5" fill="currentColor" opacity=".45"/>
            <rect x="11.5" y="8" width="5" height="17" rx="1.5" fill="currentColor" opacity=".7"/>
            <rect x="20" y="3" width="5" height="22" rx="1.5" fill="currentColor"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>Fokus Flow</span>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Home', href: '#home' },
            { label: 'Features', href: '#about' },
            { label: 'Pricing', href: '#pricing' },
            { label: 'Testimonials', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ].map(link => (
            <a key={link.href} href={link.href} style={{ fontSize: '0.83rem' }}>
              {link.label}
            </a>
          ))}
        </nav>

        <p style={{ fontSize: '0.8rem', marginTop: 4 }}>
          © {year} Fokus Flow. All rights reserved. &nbsp;·&nbsp;
          <a href="#">Privacy Policy</a> &nbsp;·&nbsp;
          <a href="#">Terms of Service</a>
        </p>
      </div>
    </footer>
  )
}
