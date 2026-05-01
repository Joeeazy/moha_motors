import { useSearchParams } from 'react-router-dom'
import { useVehicles } from '../hooks/useVehicles'
import CarCard from '../components/ui/CarCard'
import FilterSidebar from '../components/ui/FilterSidebar'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import WhatsAppButton from '../components/ui/WhatsAppButton'

const PAGE_SIZE = 12

export default function Inventory() {
  const [params, setParams] = useSearchParams()

  const filters = {
    brand_id: params.get('brand_id') ?? undefined,
    category_id: params.get('category_id') ?? undefined,
    condition: params.get('condition') ?? undefined,
    transmission: params.get('transmission') ?? undefined,
    min_price: params.get('min_price') ?? undefined,
    max_price: params.get('max_price') ?? undefined,
    min_year: params.get('min_year') ?? undefined,
    max_year: params.get('max_year') ?? undefined,
    page: params.get('page') ?? '1',
  }

  const currentPage = Number(filters.page)
  const { data, isLoading, isError, isFetching } = useVehicles(filters)

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

  const goToPage = (page: number) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(page))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeFilterCount = ['brand_id', 'category_id', 'condition', 'transmission', 'min_price', 'max_price', 'min_year', 'max_year']
    .filter((k) => params.has(k)).length

  return (
    <>
      {/* Page header */}
      <div className="bg-gray-950 pt-20 sm:pt-28 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-maroon-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            Our Collection
          </p>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Browse Inventory
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Filter and find your perfect vehicle from our curated selection
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex gap-6 lg:gap-8 items-start">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar collapsible={false} />
          </div>

          {/* Results area */}
          <div className="flex-1 min-w-0">
            {/* Top bar: count + mobile filter toggle */}
            <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
              <p className="text-sm text-gray-500">
                {isLoading ? (
                  'Loading...'
                ) : data ? (
                  <>
                    <span className="font-semibold text-gray-900">{data.items.length}</span> vehicles found
                    {isFetching && !isLoading && (
                      <span className="ml-2 text-maroon-600 text-xs">• Updating...</span>
                    )}
                  </>
                ) : null}
              </p>

              {/* Mobile filter toggle button */}
              <button
                className="lg:hidden inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:border-maroon-300 hover:text-maroon-700 transition-colors bg-white shadow-sm"
                onClick={() => {
                  const el = document.getElementById('mobile-filters')
                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-maroon-800 text-white text-xs font-bold rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile filters (collapsible) */}
            <div id="mobile-filters" className="lg:hidden mb-5 sm:mb-6">
              <FilterSidebar collapsible={true} />
            </div>

            {isLoading && <LoadingSpinner size="lg" label="Fetching vehicles..." />}

            {isError && (
              <div className="text-center py-16 sm:py-20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Failed to load vehicles</p>
                <p className="text-gray-400 text-sm mt-1">Please check your connection and try again.</p>
              </div>
            )}

            {data && data.items.length === 0 && !isLoading && (
              <div className="text-center py-16 sm:py-20">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No vehicles found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
              </div>
            )}

            {data && data.items.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {data.items.map((vehicle) => (
                    <CarCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </>
  )
}
