import Hero from '../components/sections/Hero'
import FeaturedCars from '../components/sections/FeaturedCars'
import AboutSection from '../components/sections/AboutSection'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import WhatsAppButton from '../components/ui/WhatsAppButton'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCars />
      <AboutSection />
      <WhyChooseUs />
      <WhatsAppButton />
    </main>
  )
}
