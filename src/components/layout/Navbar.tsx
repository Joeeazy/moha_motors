import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location])

  const transparent = isHome && !scrolled && !menuOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent
          ? 'bg-transparent'
          : 'bg-white shadow-md'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-maroon-800 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-maroon-900 transition-colors">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <span
                className={`text-xl font-bold tracking-tight transition-colors ${
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
          <div className="hidden md:flex items-center gap-8">
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
                    isActive
                      ? 'after:w-full'
                      : 'after:w-0 hover:after:w-full'
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

            <a
              href="/#about"
              className={`text-sm font-medium transition-colors ${
                transparent ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-maroon-800'
              }`}
            >
              About
            </a>

            <Link
              to="/inventory"
              className="ml-2 px-5 py-2 bg-maroon-800 text-white text-sm font-semibold rounded-lg hover:bg-maroon-900 transition-colors shadow-sm"
            >
              Browse Cars
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-md transition-colors ${
              transparent ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
            }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 pb-4">
            <div className="flex flex-col gap-1 pt-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/inventory', label: 'Inventory' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium rounded-md mx-2 transition-colors ${
                      isActive
                        ? 'bg-maroon-50 text-maroon-800'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              <a
                href="/#about"
                className="px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md mx-2"
              >
                About
              </a>
              <div className="px-4 pt-2">
                <Link
                  to="/inventory"
                  className="block w-full text-center px-5 py-2.5 bg-maroon-800 text-white text-sm font-semibold rounded-lg hover:bg-maroon-900 transition-colors"
                >
                  Browse Cars
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
