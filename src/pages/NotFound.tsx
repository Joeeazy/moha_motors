import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32">
      <p className="text-7xl font-bold text-maroon-100 mb-4" style={{ fontFamily: 'var(--font-display)' }}>404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist. It may have been moved or removed.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-maroon-800 text-white rounded-xl font-semibold text-sm hover:bg-maroon-900 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
