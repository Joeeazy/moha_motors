import { useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useBrands } from '../../hooks/useBrands'
import { useCategories } from '../../hooks/useCategories'

interface Props {
  collapsible?: boolean
}

const BUDGET_RANGES = [
  { label: '0 - 500K',    min: null,      max: 500000    },
  { label: '500K - 1M',   min: 500000,    max: 1000000   },
  { label: '1M - 2M',     min: 1000000,   max: 2000000   },
  { label: '2M - 3M',     min: 2000000,   max: 3000000   },
  { label: '3M - 5M',     min: 3000000,   max: 5000000   },
  { label: '5M - 10M',    min: 5000000,   max: 10000000  },
  { label: 'Above 10M',   min: 10000000,  max: null      },
] as const

export default function FilterSidebar({ collapsible = false }: Props) {
  const [isOpen, setIsOpen] = useState(!collapsible)
  const [searchInput, setSearchInput] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [params, setParams] = useSearchParams()
  const { data: brands } = useBrands()
  const { data: categories } = useCategories()

  const get = (key: string) => params.get(key) ?? ''

  const set = (key: string, value: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete('page')
      return next
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value.trim()) next.set('search', value.trim())
        else next.delete('search')
        next.delete('page')
        return next
      })
    }, 400)
  }

  const isRangeActive = (range: typeof BUDGET_RANGES[number]) => {
    const min = get('min_price')
    const max = get('max_price')
    const minMatch = range.min === null ? !min : min === String(range.min)
    const maxMatch = range.max === null ? !max : max === String(range.max)
    return minMatch && maxMatch
  }

  const setBudget = (range: typeof BUDGET_RANGES[number]) => {
    const active = isRangeActive(range)
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (active) {
        next.delete('min_price')
        next.delete('max_price')
      } else {
        if (range.min !== null) next.set('min_price', String(range.min))
        else next.delete('min_price')
        if (range.max !== null) next.set('max_price', String(range.max))
        else next.delete('max_price')
      }
      next.delete('page')
      return next
    })
  }

  const clearAll = () => {
    setSearchInput('')
    setParams({})
  }

  const filterKeys = ['search', 'brand_id', 'category_id', 'condition', 'transmission', 'min_price', 'max_price', 'min_year', 'max_year']
  const hasFilters = filterKeys.some((k) => params.has(k))
  const activeCount = filterKeys.filter((k) => params.has(k)).length

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i)

  return (
    <aside className="w-full">
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${collapsible ? 'p-0' : 'p-5 sticky top-24'}`}>
        {/* Header / toggle */}
        <div
          className={`flex items-center justify-between ${collapsible ? 'p-4 cursor-pointer select-none' : 'mb-5'}`}
          onClick={collapsible ? () => setIsOpen(!isOpen) : undefined}
        >
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Filters</h3>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-maroon-800 text-white text-xs font-bold rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={(e) => { e.stopPropagation(); clearAll() }}
                className="text-xs text-maroon-700 font-medium hover:text-maroon-900 transition-colors"
              >
                Clear all
              </button>
            )}
            {collapsible && (
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>

        {/* Filter fields */}
        {isOpen && (
          <div className={`space-y-4 sm:space-y-5 ${collapsible ? 'px-4 pb-4' : ''}`}>

            {/* Search by name or brand */}
            <FilterSection label="Search by name or brand">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={searchInput || params.get('search') || ''}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="e.g., Toyota, Prado, Vitz"
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700 placeholder-gray-400"
                />
              </div>
            </FilterSection>

            {/* Budget range */}
            <FilterSection label="Budget range">
              <div className="space-y-1.5">
                {BUDGET_RANGES.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => setBudget(range)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl border transition-colors ${
                      isRangeActive(range)
                        ? 'bg-maroon-800 text-white border-maroon-800 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-maroon-300 hover:text-maroon-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Brand */}
            <FilterSection label="Brand">
              <select
                value={get('brand_id')}
                onChange={(e) => set('brand_id', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700 bg-white"
              >
                <option value="">All Brands</option>
                {brands?.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </FilterSection>

            {/* Category */}
            <FilterSection label="Category">
              <select
                value={get('category_id')}
                onChange={(e) => set('category_id', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700 bg-white"
              >
                <option value="">All Categories</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FilterSection>

            {/* Condition */}
            <FilterSection label="Condition">
              <div className="flex gap-2">
                {['', 'new', 'used'].map((val) => (
                  <button
                    key={val || 'all'}
                    onClick={() => set('condition', val)}
                    className={`flex-1 text-xs font-semibold py-2 rounded-xl border transition-colors ${
                      get('condition') === val
                        ? 'bg-maroon-800 text-white border-maroon-800'
                        : 'border-gray-200 text-gray-600 hover:border-maroon-300 hover:text-maroon-700'
                    }`}
                  >
                    {val ? val.charAt(0).toUpperCase() + val.slice(1) : 'All'}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* Transmission */}
            <FilterSection label="Transmission">
              <select
                value={get('transmission')}
                onChange={(e) => set('transmission', e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700 bg-white"
              >
                <option value="">Any</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
                <option value="semi-automatic">Semi-Automatic</option>
              </select>
            </FilterSection>

            {/* Year range */}
            <FilterSection label="Year">
              <div className="flex gap-2">
                <select
                  value={get('min_year')}
                  onChange={(e) => set('min_year', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700 bg-white"
                >
                  <option value="">From</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
                <select
                  value={get('max_year')}
                  onChange={(e) => set('max_year', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700 bg-white"
                >
                  <option value="">To</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </FilterSection>

          </div>
        )}
      </div>
    </aside>
  )
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}
