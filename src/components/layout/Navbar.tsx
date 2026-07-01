import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useFavorites } from '../../contexts/FavoritesContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { count } = useFavorites()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const transparent = isHome && !scrolled && !menuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent ? 'bg-transparent' : 'bg-white shadow-md'
      }`}
    >
      <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-maroon-800 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-maroon-900 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <span
                className={`text-lg sm:text-xl font-bold tracking-tight transition-colors ${
                  transparent ? 'text-white' : 'text-maroon-800'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Moha Motors
              </span>
              <p className={`text-xs leading-none transition-colors ${transparent ? 'text-white/70' : 'text-gray-500'}`}>
                Nairobi, Kenya
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {[
              { to: '/', label: 'Home' },
              { to: '/inventory', label: 'Inventory' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-maroon-700 after:transition-all ${
                    isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                  } ${
                    transparent
                      ? isActive ? 'text-white' : 'text-white/80 hover:text-white'
                      : isActive ? 'text-maroon-800' : 'text-gray-600 hover:text-maroon-800'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-maroon-700 after:transition-all ${
                  isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                } ${
                  transparent
                    ? isActive ? 'text-white' : 'text-white/80 hover:text-white'
                    : isActive ? 'text-maroon-800' : 'text-gray-600 hover:text-maroon-800'
                }`
              }
            >
              Contact
            </NavLink>

            {/* Saved vehicles */}
            <NavLink
              to="/favorites"
              aria-label="Saved vehicles"
              className={({ isActive }) =>
                `relative p-2 rounded-lg transition-colors ${
                  transparent
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : isActive ? 'text-maroon-800 bg-maroon-50' : 'text-gray-600 hover:text-maroon-800 hover:bg-gray-100'
                }`
              }
            >
              <svg className="w-5 h-5" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-maroon-700 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
                  {count}
                </span>
              )}
            </NavLink>

            <Link
              to="/inventory"
              className="ml-1 px-4 lg:px-5 py-2 bg-maroon-800 text-white text-sm font-semibold rounded-lg hover:bg-maroon-900 transition-colors shadow-sm"
            >
              Browse Cars
            </Link>
          </div>

          {/* Mobile: favorites + hamburger */}
          <div className="md:hidden flex items-center gap-1">
            <NavLink
              to="/favorites"
              aria-label="Saved vehicles"
              className={`relative p-2 rounded-lg transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-maroon-700 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
                  {count}
                </span>
              )}
            </NavLink>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu — full-height overlay */}
      <div
        className={`md:hidden fixed inset-0 top-16 sm:top-[72px] bg-white z-40 transition-all duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className={`flex flex-col h-full transition-transform duration-300 ${menuOpen ? 'translate-y-0' : '-translate-y-4'}`}>
          <div className="px-4 py-6 space-y-1 border-b border-gray-100">
            {[
              { to: '/', label: 'Home' },
              { to: '/inventory', label: 'Inventory' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                    isActive ? 'bg-maroon-50 text-maroon-800' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `flex items-center px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                  isActive ? 'bg-maroon-50 text-maroon-800' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                  isActive ? 'bg-maroon-50 text-maroon-800' : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill={count > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Saved Vehicles
              </span>
              {count > 0 && (
                <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center bg-maroon-700 text-white text-xs font-bold rounded-full">
                  {count}
                </span>
              )}
            </NavLink>
          </div>
          <div className="px-4 pt-6">
            <Link
              to="/inventory"
              className="block w-full text-center px-5 py-3.5 bg-maroon-800 text-white text-base font-semibold rounded-xl hover:bg-maroon-900 transition-colors shadow-sm"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
