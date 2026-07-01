import { CarCardSkeletonGrid } from './CarCardSkeleton'

export default function InventorySkeleton() {
  return (
    <>
      {/* Page header */}
      <div className="bg-gray-950 pt-20 sm:pt-28 pb-10 sm:pb-14">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-3 w-28 rounded mb-3" style={{ backgroundColor: '#2a2a2e' }} />
          <div className="skeleton h-8 w-56 rounded mb-3" style={{ backgroundColor: '#2a2a2e' }} />
          <div className="skeleton h-4 w-full max-w-md rounded" style={{ backgroundColor: '#2a2a2e' }} />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex gap-6 lg:gap-8 items-start">
          {/* Sidebar placeholder */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
              <div className="skeleton h-4 w-20 rounded" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="skeleton h-2.5 w-24 rounded mb-2" />
                  <div className="skeleton h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Results grid */}
          <div className="flex-1 min-w-0">
            <div className="skeleton h-4 w-32 rounded mb-6" />
            <CarCardSkeletonGrid count={9} />
          </div>
        </div>
      </div>
    </>
  )
}
