import { Link } from 'react-router-dom'
import { useVehicles } from '../../hooks/useVehicles'
import CarCard from '../ui/CarCard'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function FeaturedCars() {
  const { data, isLoading, isError } = useVehicles({ limit: '8' } as any)

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-maroon-700 text-sm font-semibold uppercase tracking-wider mb-2">
              Hand-picked selection
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Featured Vehicles
            </h2>
          </div>
          <Link
            to="/inventory"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-maroon-800 hover:text-maroon-900 transition-colors group"
          >
            View all cars
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {isLoading && <LoadingSpinner size="lg" label="Loading featured cars..." />}

        {isError && (
          <div className="text-center py-12 text-gray-500">
            <p>Could not load featured vehicles. Please try again.</p>
          </div>
        )}

        {data && data.items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.items.slice(0, 8).map((vehicle) => (
              <CarCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
