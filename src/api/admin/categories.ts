import adminApi from './axios'
import type { Category } from '../../types/index'

export async function fetchAdminCategories(): Promise<Category[]> {
  const { data } = await adminApi.get<Category[]>('/categories/')
  return data
}

export async function createCategory(name: string): Promise<Category> {
  const { data } = await adminApi.post<Category>('/categories/', { name })
  return data
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const { data } = await adminApi.patch<Category>(`/categories/${id}`, { name })
  return data
}

export async function deleteCategory(id: number): Promise<void> {
  await adminApi.delete(`/categories/${id}`)
}
