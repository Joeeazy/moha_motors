export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gray-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Image grid */}
          <div className="relative grid grid-cols-2 gap-4 h-[480px]">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80"
                alt="Luxury car"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
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

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-maroon-800 text-white rounded-2xl p-5 shadow-xl">
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>15+</p>
              <p className="text-xs text-maroon-200 mt-1 uppercase tracking-wider">Years in Business</p>
            </div>
          </div>

          {/* Text content */}
          <div>
            <p className="text-maroon-400 text-sm font-semibold uppercase tracking-wider mb-4">
              Our Story
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Kenya's Most Trusted<br />
              <span className="text-maroon-400">Car Dealership</span>
            </h2>

            <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
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

            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-800">
              {[
                { value: '1,000+', label: 'Cars Sold' },
                { value: '50+', label: 'Brands' },
                { value: '4.9★', label: 'Rating' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
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
