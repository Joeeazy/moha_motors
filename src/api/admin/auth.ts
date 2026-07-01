import adminApi from './axios'
import type { AdminUser } from '../../types/admin'

export async function login(email: string, password: string): Promise<{ access_token: string }> {
  const { data } = await adminApi.post<{ access_token: string }>('/auth/login', { email, password })
  return data
}

export async function getMe(): Promise<AdminUser> {
  const { data } = await adminApi.get<AdminUser>('/auth/me')
  return data
}

export async function updateMe(payload: { name?: string; email?: string }): Promise<AdminUser> {
  const { data } = await adminApi.patch<AdminUser>('/auth/me', payload)
  return data
}

export async function changePassword(current_password: string, new_password: string): Promise<void> {
  await adminApi.patch('/auth/me/password', { current_password, new_password })
}

export async function listAdmins(): Promise<AdminUser[]> {
  const { data } = await adminApi.get<AdminUser[]>('/auth/admins')
  return data
}

export async function createAdmin(payload: { name: string; email: string; password: string }): Promise<AdminUser> {
  const { data } = await adminApi.post<AdminUser>('/auth/admins', payload)
  return data
}

export async function deleteAdmin(id: number): Promise<void> {
  await adminApi.delete(`/auth/admins/${id}`)
}
