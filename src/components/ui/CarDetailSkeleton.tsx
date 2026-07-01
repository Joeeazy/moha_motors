export default function CarDetailSkeleton() {
  return (
    <>
      {/* Breadcrumb bar */}
      <div className="bg-gray-950 pt-20 sm:pt-24 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-3 w-52 rounded" style={{ backgroundColor: '#2a2a2e' }} />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 xl:gap-14">
          {/* Left: gallery */}
          <div className="min-w-0">
            <div className="skeleton rounded-2xl aspect-[4/3] w-full" />
            <div className="mt-3 flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-16 w-20 rounded-lg shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: details */}
          <div className="min-w-0">
            <div className="skeleton h-3 w-24 rounded mb-3" />
            <div className="skeleton h-8 w-4/5 rounded mb-3" />
            <div className="skeleton h-7 w-40 rounded mb-6" />

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-3">
                  <div className="skeleton h-2.5 w-16 rounded mb-2" />
                  <div className="skeleton h-3.5 w-24 rounded" />
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3">
              <div className="skeleton h-12 flex-1 rounded-xl" />
              <div className="skeleton h-12 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
