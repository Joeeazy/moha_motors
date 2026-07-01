export default function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
      {/* Image */}
      <div className="skeleton aspect-[16/10] w-full" />

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand + year */}
        <div className="flex items-center justify-between mb-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-10 rounded" />
        </div>

        {/* Title */}
        <div className="skeleton h-4 w-11/12 rounded mb-2" />
        <div className="skeleton h-4 w-2/3 rounded mb-4" />

        {/* Specs */}
        <div className="flex gap-2 mb-4 mt-auto">
          <div className="skeleton h-6 w-24 rounded-md" />
          <div className="skeleton h-6 w-20 rounded-md" />
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="skeleton h-5 w-24 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  )
}

/** A responsive grid of skeleton cards for list loading states. */
export function CarCardSkeletonGrid({
  count = 8,
  className = 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6',
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  )
}
