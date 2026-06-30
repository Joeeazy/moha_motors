import adminApi from './axios'
import type { Stats } from '../../types/admin'

export async function fetchStats(): Promise<Stats> {
  const { data } = await adminApi.get<Stats>('/stats/')
  return data
}
