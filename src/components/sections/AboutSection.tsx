export default function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-20 bg-gray-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Image mosaic */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 h-64 sm:h-80 lg:h-[480px]">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80"
                alt="Luxury car"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="rounded-2xl overflow-hidden flex-1">
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80"
                  alt="Sports car"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden flex-1">
                <img
                  src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80"
                  alt="SUV"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Floating badge — tucked inside on mobile, overflowing on lg+ */}
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 lg:-bottom-4 lg:-right-4 bg-maroon-800 text-white rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-xl">
              <p className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>15+</p>
              <p className="text-xs text-maroon-200 mt-0.5 uppercase tracking-wider">Years in Business</p>
            </div>
          </div>

          {/* Text content */}
          <div className="lg:pt-4">
            <p className="text-maroon-400 text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4">
              Our Story
            </p>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-5 sm:mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Kenya's Most Trusted<br />
              <span className="text-maroon-400">Car Dealership</span>
            </h2>

            <div className="space-y-3 sm:space-y-4 text-gray-400 text-sm sm:text-base leading-relaxed">
              <p>
                Founded in 2010 in the heart of Nairobi, Moha Motors started with a simple mission: make buying a quality car accessible to every Kenyan. What began as a small lot in Westlands has grown into one of East Africa's most respected automotive dealerships.
              </p>
              <p>
                We stock everything from fuel-efficient daily drivers to powerful 4x4s built for Kenya's diverse terrain — whether you're navigating Nairobi's CBD or heading upcountry. Every car in our inventory is carefully sourced, inspected, and priced fairly.
              </p>
              <p>
                At Moha Motors, we believe trust is built one car at a time. That's why over 1,000 Kenyan families have chosen us as their automotive partner.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-gray-800">
              {[
                { value: '1,000+', label: 'Cars Sold' },
                { value: '50+', label: 'Brands' },
                { value: '4.9★', label: 'Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
