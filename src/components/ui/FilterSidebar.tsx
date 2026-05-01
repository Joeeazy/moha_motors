import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useBrands } from '../../hooks/useBrands'
import { useCategories } from '../../hooks/useCategories'

interface Props {
  collapsible?: boolean
}

export default function FilterSidebar({ collapsible = false }: Props) {
  const [isOpen, setIsOpen] = useState(!collapsible)
  const [params, setParams] = useSearchParams()
  const { data: brands } = useBrands()
  const { data: categories } = useCategories()

  const get = (key: string) => params.get(key) ?? ''

  const set = (key: string, value: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) {
        next.set(key, value)
      } else {
        next.delete(key)
      }
      next.delete('page')
      return next
    })
  }

  const clearAll = () => setParams({})

  const filterKeys = ['brand_id', 'category_id', 'condition', 'transmission', 'min_price', 'max_price', 'min_year', 'max_year']
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

            {/* Price range */}
            <FilterSection label="Price (KES)">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={get('min_price')}
                  onChange={(e) => set('min_price', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={get('max_price')}
                  onChange={(e) => set('max_price', e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-maroon-700/30 focus:border-maroon-700 text-gray-700"
                />
              </div>
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
