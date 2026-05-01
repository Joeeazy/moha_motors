import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85)',
        }}
      />

      {/* Gradient overlay — deep maroon to black */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-950/90 via-maroon-900/80 to-gray-950/90" />

      {/* Decorative grain texture overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-maroon-300 text-sm font-semibold uppercase tracking-[0.25em] mb-5">
          Nairobi's Premier Car Dealership
        </p>

        <h1
          className="text-white text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Find Your
          <span className="block text-maroon-300">Dream Car</span>
          in Kenya
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          From sleek sedans to rugged 4x4s — Moha Motors brings you Kenya's finest selection of quality vehicles at transparent prices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/inventory"
            className="px-8 py-4 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold rounded-xl text-base shadow-lg shadow-maroon-900/50 hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            Browse Inventory
          </Link>
          <a
            href="#about"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-base border border-white/20 backdrop-blur-sm transition-all duration-200"
          >
            Learn More
          </a>
        </div>

        {/* Quick stats */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '500+', label: 'Cars Listed' },
            { value: '15+', label: 'Years Experience' },
            { value: '50+', label: 'Car Brands' },
            { value: '1000+', label: 'Happy Clients' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}
