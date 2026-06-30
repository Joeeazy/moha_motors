import adminApi from './axios'
import type { AdminVehicle, AdminVehicleListItem, VehicleCreatePayload, Paginated } from '../../types/admin'

interface AdminVehicleFilters {
  brand_id?: number
  category_id?: number
  is_available?: boolean
  skip?: number
  limit?: number
}

export async function fetchAdminVehicles(filters: AdminVehicleFilters = {}): Promise<Paginated<AdminVehicleListItem>> {
  const params: Record<string, string | number | boolean> = {}
  if (filters.skip !== undefined) params.skip = filters.skip
  if (filters.limit !== undefined) params.limit = filters.limit
  if (filters.brand_id !== undefined) params.brand_id = filters.brand_id
  if (filters.category_id !== undefined) params.category_id = filters.category_id
  if (filters.is_available !== undefined) params.is_available = filters.is_available
  const { data } = await adminApi.get<Paginated<AdminVehicleListItem>>('/vehicles/', { params })
  return data
}

export async function fetchAdminVehicle(id: number): Promise<AdminVehicle> {
  const { data } = await adminApi.get<AdminVehicle>(`/vehicles/${id}`)
  return data
}

export async function createVehicle(payload: VehicleCreatePayload): Promise<AdminVehicle> {
  const { data } = await adminApi.post<AdminVehicle>('/vehicles/', payload)
  return data
}

export async function updateVehicle(id: number, payload: Partial<VehicleCreatePayload>): Promise<AdminVehicle> {
  const { data } = await adminApi.patch<AdminVehicle>(`/vehicles/${id}`, payload)
  return data
}

export async function deleteVehicle(id: number): Promise<void> {
  await adminApi.delete(`/vehicles/${id}`)
}

export async function uploadVehicleImage(vehicleId: number, file: File, is_primary: boolean): Promise<AdminVehicle> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await adminApi.post<AdminVehicle>(
    `/vehicles/${vehicleId}/images?is_primary=${is_primary}`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return data
}

export async function deleteVehicleImage(vehicleId: number, imageId: number): Promise<void> {
  await adminApi.delete(`/vehicles/${vehicleId}/images/${imageId}`)
}
