import { useQuery } from '@tanstack/react-query'
import { fetchBrands } from '../api/brands'

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 10,
  })
}
