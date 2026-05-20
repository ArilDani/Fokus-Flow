import ScrollReveal from './ScrollReveal'

const TESTIMONIALS = [
  {
    id: 'sarah',
    quote: 'Fokus Flow has transformed how I manage my day! I feel more organized and productive than ever before.',
    author: 'Sarah L.',
    role: 'Freelance Designer',
    stars: 5,
  },
  {
    id: 'david',
    quote: 'The gamification makes productivity fun and rewarding. I actually look forward to completing my tasks now!',
    author: 'David W.',
    role: 'Software Engineer',
    stars: 5,
  },
  {
    id: 'michael',
    quote: "The best productivity tool I've ever used. The AI assistant understands exactly what I need to stay focused.",
    author: 'Michael T.',
    role: 'Product Manager',
    stars: 5,
  },
]

function TestimonialCard({ testimonial, delay }) {
  return (
    <ScrollReveal animation="fadeInUp" delay={delay} className="testimonial-card" id={`testimonial-${testimonial.id}`}>
      <div className="testimonial-card__stars">
        {Array.from({ length: testimonial.stars }).map((_, i) => (
          <span key={i} className="testimonial-card__star">★</span>
        ))}
      </div>
      <p className="testimonial-card__quote">"{testimonial.quote}"</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Avatar */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: '0.9rem',
          flexShrink: 0,
        }}>
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <div className="testimonial-card__author">— {testimonial.author}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{testimonial.role}</div>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <ScrollReveal animation="fadeInUp" className="section-header">
          <span className="badge" style={{ marginBottom: 14, display: 'inline-flex' }}>Reviews</span>
          <h2>What Our Users Are Saying</h2>
          <p>Join thousands of professionals who boosted their productivity with Fokus Flow</p>
        </ScrollReveal>

        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} delay={i * 0.15} />
          ))}
        </div>

        {/* Stats bar */}
        <ScrollReveal animation="fadeInUp" delay={0.4}>
          <div style={{
            marginTop: 56,
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '92%', label: 'Retention Rate' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem', fontWeight: 800,
                  color: 'var(--primary)', letterSpacing: '-0.03em',
                }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: 4 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
