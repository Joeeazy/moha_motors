import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { VehicleListItem } from '../types'

const STORAGE_KEY = 'moha:favorites:v1'
const TTL = 24 * 60 * 60 * 1000 // 24 hours

interface FavoriteEntry {
  vehicle: VehicleListItem
  savedAt: number
}

interface FavoritesContextValue {
  favorites: VehicleListItem[]
  count: number
  isFavorite: (id: number) => boolean
  toggleFavorite: (vehicle: VehicleListItem) => void
  removeFavorite: (id: number) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

/** Load entries from storage, dropping anything older than the TTL. */
function loadEntries(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as FavoriteEntry[]
    if (!Array.isArray(parsed)) return []
    const now = Date.now()
    return parsed.filter((e) => e?.vehicle && typeof e.savedAt === 'number' && now - e.savedAt < TTL)
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<FavoriteEntry[]>(() => loadEntries())

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      // storage full / unavailable — ignore
    }
  }, [entries])

  // Re-purge expired entries once on mount and schedule a periodic sweep.
  useEffect(() => {
    const purge = () => setEntries((prev) => {
      const now = Date.now()
      const next = prev.filter((e) => now - e.savedAt < TTL)
      return next.length === prev.length ? prev : next
    })
    purge()
    const interval = setInterval(purge, 60 * 1000) // sweep every minute
    return () => clearInterval(interval)
  }, [])

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setEntries(loadEntries())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const isFavorite = useCallback(
    (id: number) => entries.some((e) => e.vehicle.id === id),
    [entries],
  )

  const toggleFavorite = useCallback((vehicle: VehicleListItem) => {
    setEntries((prev) => {
      if (prev.some((e) => e.vehicle.id === vehicle.id)) {
        return prev.filter((e) => e.vehicle.id !== vehicle.id)
      }
      return [{ vehicle, savedAt: Date.now() }, ...prev]
    })
  }, [])

  const removeFavorite = useCallback((id: number) => {
    setEntries((prev) => prev.filter((e) => e.vehicle.id !== id))
  }, [])

  const clearFavorites = useCallback(() => setEntries([]), [])

  const value: FavoritesContextValue = {
    favorites: entries.map((e) => e.vehicle),
    count: entries.length,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider')
  return ctx
}
