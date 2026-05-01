import Hero from '../components/sections/Hero'
import FeaturedCars from '../components/sections/FeaturedCars'
import WhyChooseUs from '../components/sections/WhyChooseUs'
import AboutSection from '../components/sections/AboutSection'
import WhatsAppButton from '../components/ui/WhatsAppButton'

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturedCars />
      <WhyChooseUs />
      <AboutSection />
      <WhatsAppButton />
    </main>
  )
}
