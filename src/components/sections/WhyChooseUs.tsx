const features = [
  {
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Verified Listings',
    desc: 'Every vehicle on our platform is inspected and verified by our expert team before listing.',
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Transparent Pricing',
    desc: 'No hidden charges. What you see is what you pay — fair market prices with full disclosure.',
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: 'Dedicated Support',
    desc: 'Our team is available via WhatsApp, phone, and email to help you through every step of your purchase.',
  },
  {
    icon: (
      <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Easy Documentation',
    desc: 'We handle all the paperwork — logbook transfers, NTSA checks, and insurance assistance.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-maroon-700 text-sm font-semibold uppercase tracking-wider mb-3">
            Why Moha Motors
          </p>
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Driving Kenya Forward
          </h2>
          <p className="text-gray-500 mt-3 sm:mt-4 max-w-xl mx-auto text-sm sm:text-base leading-relaxed px-2 sm:px-0">
            Over 15 years of trust, quality, and service. We're not just selling cars — we're building lasting relationships on the road.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          {features.map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 sm:text-center p-4 sm:p-0 rounded-2xl sm:rounded-none bg-gray-50 sm:bg-transparent"
            >
              <div className="inline-flex shrink-0 items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-maroon-50 text-maroon-800 sm:mb-5 group-hover:bg-maroon-800 group-hover:text-white transition-colors duration-300">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
