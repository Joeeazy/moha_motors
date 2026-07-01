import { toast } from 'sonner'
import { AxiosError } from 'axios'

type BackendDetail = string | { msg?: string }[] | undefined

/** Pull a human-readable message out of a backend error response. */
export function getErrorMessage(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  const ax = err as AxiosError<{ detail?: BackendDetail }>
  const detail = ax?.response?.data?.detail

  if (typeof detail === 'string' && detail.trim()) return detail
  if (Array.isArray(detail) && detail.length) return detail[0]?.msg || fallback
  if (ax?.code === 'ERR_NETWORK' || ax?.message === 'Network Error') {
    return 'Network error — please check your connection and try again.'
  }
  return fallback
}

export const notifySuccess = (message: string) => toast.success(message)

export const notifyError = (err: unknown, fallback?: string) =>
  toast.error(getErrorMessage(err, fallback))
