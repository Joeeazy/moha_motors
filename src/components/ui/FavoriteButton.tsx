import { motion } from 'framer-motion'
import { useFavorites } from '../../contexts/FavoritesContext'
import type { VehicleListItem } from '../../types'

interface Props {
  vehicle: VehicleListItem
  /** 'overlay' sits on the card image; 'solid' is a standalone button (detail page). */
  variant?: 'overlay' | 'solid'
  className?: string
}

export default function FavoriteButton({ vehicle, variant = 'overlay', className = '' }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(vehicle.id)

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger the parent Link / navigation.
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(vehicle)
  }

  if (variant === 'solid') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? 'Remove from saved' : 'Save vehicle'}
        className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold border transition-colors ${
          active
            ? 'bg-maroon-50 border-maroon-200 text-maroon-800'
            : 'bg-white border-gray-200 text-gray-700 hover:border-maroon-300 hover:text-maroon-800'
        } ${className}`}
      >
        <Heart filled={active} className="w-5 h-5" />
        {active ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.8 }}
      aria-pressed={active}
      aria-label={active ? 'Remove from saved' : 'Save vehicle'}
      className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-colors ${
        active
          ? 'bg-maroon-700 text-white'
          : 'bg-white/85 text-gray-600 hover:bg-white hover:text-maroon-700'
      } ${className}`}
      style={{ transform: 'translateZ(45px)' }}
    >
      <Heart filled={active} className="w-[18px] h-[18px]" />
    </motion.button>
  )
}

function Heart({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.9}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  )
}
