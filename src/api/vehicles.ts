import api from './axios'
import type { Vehicle, VehicleListItem, VehicleFilters } from '../types'

interface VehiclesResponse {
  items: VehicleListItem[]
  total: number
}

export async function fetchVehicles(filters: VehicleFilters): Promise<VehiclesResponse> {
  const page = Number(filters.page ?? 1)
  const limit = 12
  const skip = (page - 1) * limit

  const params: Record<string, string | number> = { skip, limit }
  if (filters.brand_id) params.brand_id = filters.brand_id
  if (filters.category_id) params.category_id = filters.category_id
  if (filters.condition) params.condition = filters.condition
  if (filters.transmission) params.transmission = filters.transmission
  if (filters.min_price) params.min_price = filters.min_price
  if (filters.max_price) params.max_price = filters.max_price
  if (filters.min_year) params.min_year = filters.min_year
  if (filters.max_year) params.max_year = filters.max_year

  const { data } = await api.get<VehicleListItem[]>('/vehicles', { params })
  // Backend returns array; wrap with pagination metadata
  return { items: data, total: data.length < limit ? skip + data.length : skip + limit + 1 }
}

export async function fetchVehicle(id: number): Promise<Vehicle> {
  const { data } = await api.get<Vehicle>(`/vehicles/${id}`)
  return data
}
