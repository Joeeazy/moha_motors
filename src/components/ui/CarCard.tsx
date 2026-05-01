import { Link } from 'react-router-dom'
import type { VehicleListItem } from '../../types'
import { formatPrice, getPrimaryImage, capitalize } from '../../utils/format'

interface Props {
  vehicle: VehicleListItem
}

const FALLBACK = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'

export default function CarCard({ vehicle }: Props) {
  const image = getPrimaryImage(vehicle.images) || FALLBACK

  return (
    <Link
      to={`/inventory/${vehicle.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10] bg-gray-100">
        <img
          src={image}
          alt={vehicle.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK }}
          loading="lazy"
        />
        {/* Condition badge */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            vehicle.condition === 'new'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {vehicle.condition}
        </span>
        {/* Availability */}
        {!vehicle.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg tracking-widest uppercase">Sold</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand + Year */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-maroon-700 uppercase tracking-wider">
            {vehicle.brand.name}
          </span>
          <span className="text-xs text-gray-400 font-medium">{vehicle.year}</span>
        </div>

        {/* Title */}
        <h3 className="text-gray-900 font-semibold text-base leading-snug mb-3 line-clamp-2 group-hover:text-maroon-800 transition-colors">
          {vehicle.title}
        </h3>

        {/* Specs */}
        <div className="flex gap-2 flex-wrap mb-4 mt-auto">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            {capitalize(vehicle.transmission)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {vehicle.category.name}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-maroon-800 font-bold text-base">{formatPrice(vehicle.price)}</p>
          <span className="text-xs font-semibold text-maroon-700 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            View Details
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
