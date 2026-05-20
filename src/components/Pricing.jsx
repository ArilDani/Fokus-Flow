import ScrollReveal from './ScrollReveal'

const CHECK_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PLANS = [
  {
    id: 'free',
    label: 'Free Plan',
    currency: 'Rp',
    amount: '0',
    period: '/ bulan',
    features: [
      'Basic To-Do List',
      'Habit Tracker',
      'Standard Reminders',
    ],
    cta: 'Get Started Free',
    featured: false,
  },
  {
    id: 'premium',
    label: 'Premium Plan',
    currency: 'Rp',
    amount: '99K',
    period: '/ bulan',
    features: [
      'AI Productivity Assistant',
      'Customizable Dashboards',
      'Focus Music & Alerts',
      'Advanced Analytics',
      'Priority Support',
    ],
    cta: 'Get Started',
    featured: true,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="pricing">
      <div className="container">
        <ScrollReveal animation="fadeInUp" className="section-header">
          <span className="badge" style={{ marginBottom: 14, display: 'inline-flex' }}>Pricing</span>
          <h2>Choose Your Plan</h2>
          <p>Start free and upgrade when you're ready to unlock your full potential</p>
        </ScrollReveal>

        <div className="pricing__grid">
          {PLANS.map((plan, index) => (
            <ScrollReveal
              key={plan.id}
              animation="fadeInUp"
              delay={index * 0.15}
              className={`pricing-card${plan.featured ? ' featured' : ''}`}
            >
              <div id={`pricing-card-${plan.id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="pricing-card__label">{plan.label}</div>

                <div className="pricing-card__price">
                  <span className="currency">{plan.currency}</span>
                  <span className="amount">{plan.amount}</span>
                  <span className="period">{plan.period}</span>
                </div>

                <div className="pricing-card__divider" />

                <ul className="pricing-card__features" style={{ flexGrow: 1 }}>
                  {plan.features.map(feature => (
                    <li key={feature} className="pricing-card__feature">
                      <span className="pricing-card__feature-icon">{CHECK_ICON}</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn btn-lg btn-cta${plan.featured ? ' btn-white' : ' btn-primary'}`}
                  id={`pricing-cta-${plan.id}`}
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                  }}
                  onClick={() => alert('🚀 COMING SOON')}
                >
                  {plan.cta}
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Guarantee badge */}
        <ScrollReveal animation="fadeInUp" delay={0.3}>
          <div style={{ textAlign: 'center', marginTop: 36, color: 'var(--text-light)', fontSize: '0.86rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              30-day money-back guarantee · No credit card required for Free plan
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
