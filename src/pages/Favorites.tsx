import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavorites } from '../contexts/FavoritesContext'
import CarCard from '../components/ui/CarCard'
import WhatsAppButton from '../components/ui/WhatsAppButton'

export default function Favorites() {
  const { favorites, count, clearFavorites } = useFavorites()

  return (
    <>
      {/* Page header */}
      <div className="bg-gray-950 pt-20 sm:pt-28 pb-10 sm:pb-14">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-maroon-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-2">
            Your Shortlist
          </p>
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Saved Vehicles
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {count > 0
              ? `${count} vehicle${count !== 1 ? 's' : ''} saved · kept for 24 hours on this device`
              : 'Tap the heart on any vehicle to save it here for later.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {count === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="w-16 h-16 bg-maroon-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-maroon-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold text-lg">No saved vehicles yet</p>
            <p className="text-gray-400 text-sm mt-1.5 max-w-sm mx-auto">
              Browse the inventory and tap the heart on any car to build your shortlist.
            </p>
            <Link
              to="/inventory"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-maroon-800 text-white rounded-xl text-sm font-semibold hover:bg-maroon-900 transition-colors"
            >
              Browse Inventory
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <p className="text-sm text-gray-500">
                Showing your <span className="font-semibold text-gray-900">{count}</span> saved
                vehicle{count !== 1 ? 's' : ''}
              </p>
              <button
                onClick={clearFavorites}
                className="text-sm font-medium text-gray-500 hover:text-maroon-700 transition-colors"
              >
                Clear all
              </button>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            >
              {favorites.map((vehicle) => (
                <motion.div
                  key={vehicle.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                  }}
                >
                  <CarCard vehicle={vehicle} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>

      <WhatsAppButton />
    </>
  )
}
