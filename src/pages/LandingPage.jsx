import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import HowItWorks from '../components/HowItWorks'
import Testimonials from '../components/Testimonials'
import Pricing from '../components/Pricing'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
