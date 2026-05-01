import { useQuery } from '@tanstack/react-query'
import { fetchVehicles } from '../api/vehicles'
import type { VehicleFilters } from '../types'

export function useVehicles(filters: VehicleFilters) {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: () => fetchVehicles(filters),
    staleTime: 1000 * 60 * 2,
  })
}
