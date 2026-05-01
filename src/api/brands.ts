import api from './axios'
import type { Brand } from '../types'

export async function fetchBrands(): Promise<Brand[]> {
  const { data } = await api.get<Brand[]>('/brands')
  return data
}
