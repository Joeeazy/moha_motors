import api from './axios'
import type { Options } from '../types'

export async function fetchOptions(): Promise<Options> {
  const { data } = await api.get<Options>('/options/all')
  return data
}
