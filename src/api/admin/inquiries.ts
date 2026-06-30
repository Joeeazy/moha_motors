import adminApi from './axios'
import type { AdminInquiry, Paginated } from '../../types/admin'

interface InquiryFilters {
  is_read?: boolean
  is_resolved?: boolean
  skip?: number
  limit?: number
}

export async function fetchAdminInquiries(filters: InquiryFilters = {}): Promise<Paginated<AdminInquiry>> {
  const params: Record<string, string | number | boolean> = {}
  if (filters.skip !== undefined) params.skip = filters.skip
  if (filters.limit !== undefined) params.limit = filters.limit
  if (filters.is_read !== undefined) params.is_read = filters.is_read
  if (filters.is_resolved !== undefined) params.is_resolved = filters.is_resolved
  const { data } = await adminApi.get<Paginated<AdminInquiry>>('/inquiries/', { params })
  return data
}

export async function updateInquiryStatus(
  id: number,
  payload: { is_read?: boolean; is_resolved?: boolean }
): Promise<AdminInquiry> {
  const { data } = await adminApi.patch<AdminInquiry>(`/inquiries/${id}`, payload)
  return data
}

export async function deleteInquiry(id: number): Promise<void> {
  await adminApi.delete(`/inquiries/${id}`)
}
