import { useQuery } from '@tanstack/react-query'
import { fetchOptions } from '../api/options'

export function useOptions() {
  return useQuery({
    queryKey: ['options'],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 30,
  })
}
