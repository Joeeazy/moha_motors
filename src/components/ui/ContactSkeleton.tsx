export default function ContactSkeleton() {
  return (
    <>
      {/* Hero bar */}
      <div className="bg-gray-950 pt-20 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-3 w-24 rounded mb-3" style={{ backgroundColor: '#2a2a2e' }} />
          <div className="skeleton h-8 w-52 rounded mb-3" style={{ backgroundColor: '#2a2a2e' }} />
          <div className="skeleton h-4 w-full max-w-xl rounded" style={{ backgroundColor: '#2a2a2e' }} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left: contact cards */}
          <div>
            <div className="skeleton h-6 w-48 rounded mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="skeleton w-11 h-11 rounded-xl mb-4" />
                  <div className="skeleton h-3.5 w-20 rounded mb-2" />
                  <div className="skeleton h-3 w-28 rounded mb-1.5" />
                  <div className="skeleton h-3 w-24 rounded mb-3" />
                  <div className="skeleton h-3 w-20 rounded" />
                </div>
              ))}
            </div>

            {/* Business hours block */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <div className="skeleton h-3.5 w-32 rounded mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="skeleton h-3 w-28 rounded" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: form panel */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="skeleton h-6 w-44 rounded mb-2" />
            <div className="skeleton h-3.5 w-64 rounded mb-6" />
            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-2.5 w-24 rounded mb-2" />
                  <div className="skeleton h-11 w-full rounded-xl" />
                </div>
              ))}
              {/* Message textarea */}
              <div>
                <div className="skeleton h-2.5 w-20 rounded mb-2" />
                <div className="skeleton h-28 w-full rounded-xl" />
              </div>
              {/* Submit */}
              <div className="skeleton h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
