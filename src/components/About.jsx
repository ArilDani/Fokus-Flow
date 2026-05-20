import ScrollReveal from './ScrollReveal'

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container about__inner">
        {/* Left – Content */}
        <ScrollReveal animation="fadeInUp" className="about__content">
          <div style={{ marginBottom: 14 }}>
            <span className="badge">About Fokus Flow</span>
          </div>
          <h2>About Fokus Flow</h2>
          <p>
            Achieve your goals and stay on track with our powerful platform
            designed to make work fun and efficient. Fokus Flow combines gamification,
            AI assistance, and smart analytics to transform the way you manage tasks
            and build lasting habits.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { 
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>, 
                title: 'Goal Tracking', desc: 'Set and monitor progress toward meaningful milestones.' 
              },
              { 
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"></path></svg>, 
                title: 'AI Powered', desc: 'Smart suggestions that adapt to how you work best.' 
              },
              { 
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8m-4-4v4m-5.2-12.8A3 3 0 0 0 2 11c0 1.6 1.4 3 3 3h1.2M16.8 14H18a3 3 0 0 0 3-3c0-1.6-1.4-3-3-3h-1.2"></path><path d="M7 3h10v6c0 2.8-2.2 5-5 5s-5-2.2-5-5V3z"></path></svg>, 
                title: 'Gamified System', desc: 'Earn rewards and streaks to stay motivated every day.' 
              },
            ].map(item => (
              <div key={item.title} className="feature-row" style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px', borderRadius: '12px', transition: 'all 0.3s ease', cursor: 'pointer' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'var(--primary-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.25rem', flexShrink: 0, transition: 'all 0.3s ease'
                }} className="feature-icon-box">
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: '0.86rem', color: 'var(--text-light)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Right – Dashboard Image */}
        <ScrollReveal animation="zoomIn" delay={0.2} className="about__mockup">
          <img
            src="/about-dashboard.png"
            alt="Fokus Flow dashboard on laptop and tablet"
          />
        </ScrollReveal>
      </div>
    </section>
  )
}
