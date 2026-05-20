import ScrollReveal from './ScrollReveal'

const STEPS = [
  {
    num: 1,
    title: 'Track Your Tasks',
    img: '/step1-tasks.png',
    imgAlt: 'Task tracking interface',
    desc: 'Manage your to-dos and set goals easily.',
  },
  {
    num: 2,
    title: 'Build Healthy Habits',
    img: '/step2-habits.png',
    imgAlt: 'Habit tracking charts',
    desc: 'Monitor your habits and build better routines.',
  },
  {
    num: 3,
    title: 'Get Smart Assistance',
    img: '/step3-ai.png',
    imgAlt: 'AI assistant',
    desc: 'AI Agent helps you stay focused & motivated.',
  },
]

function StepCard({ step, delay }) {
  return (
    <ScrollReveal animation="fadeInUp" delay={delay} className="how__step-container" id={`how-step-${step.num}`}>
      <div className="how__step-card">
        <div className="how__step-header">
          <div className="how__step-num">{step.num}</div>
          <h3>{step.title}</h3>
        </div>
        <div className="how__step-divider" />
        <div className="how__step-img-wrapper">
          <img src={step.img} alt={step.imgAlt} className="how__step-img" />
        </div>
      </div>
      <p className="how__step-desc">{step.desc}</p>
    </ScrollReveal>
  )
}

export default function HowItWorks() {
  return (
    <section id="features" className="how">
      <div className="container">
        <ScrollReveal animation="fadeInUp" className="section-header">
          <span className="badge" style={{ marginBottom: 14, display: 'inline-flex' }}>Process</span>
          <h2>How Fokus Flow Works</h2>
          <p>Three simple steps to transform your productivity</p>
        </ScrollReveal>

        <div className="how__steps">
          {STEPS.map((step, i) => (
            <StepCard key={step.num} step={step} delay={i * 0.15} />
          ))}
        </div>
      </div>
    </section>
  )
}
