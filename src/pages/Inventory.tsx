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

  return (
    <>
      {/* Page header */}
      <div className="bg-gray-950 pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-maroon-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Our Collection
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 items-start">
          {/* Sidebar — hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block w-64 shrink-0">
            <FilterSidebar />
          </div>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results count + mobile filter toggle */}
            <div className="flex items-center justify-between mb-6">
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
            </div>

            {/* Mobile filters */}
            <div className="lg:hidden mb-6">
              <FilterSidebar />
            </div>

            {isLoading && <LoadingSpinner size="lg" label="Fetching vehicles..." />}

            {isError && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">Failed to load vehicles</p>
                <p className="text-gray-400 text-sm mt-1">Please check your connection and try again.</p>
              </div>
            )}

            {data && data.items.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">No vehicles found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters to see more results.</p>
              </div>
            )}

            {data && data.items.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
