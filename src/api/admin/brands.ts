import adminApi from './axios'
import type { Brand } from '../../types/index'

export async function fetchAdminBrands(): Promise<Brand[]> {
  const { data } = await adminApi.get<Brand[]>('/brands/')
  return data
}

export async function createBrand(name: string): Promise<Brand> {
  const { data } = await adminApi.post<Brand>('/brands/', { name })
  return data
}

export async function updateBrand(id: number, name: string): Promise<Brand> {
  const { data } = await adminApi.patch<Brand>(`/brands/${id}`, { name })
  return data
}

export async function deleteBrand(id: number): Promise<void> {
  await adminApi.delete(`/brands/${id}`)
}

export async function uploadBrandLogo(id: number, file: File): Promise<Brand> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await adminApi.post<Brand>(`/brands/${id}/logo`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
