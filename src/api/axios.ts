import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Log every request in dev
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params ?? '')
  }
  return config
})

// Log every response/error in dev
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ✓ ${response.status} ${response.config.url}`, response.data)
    }
    return response
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(`[API] ✗ ${error.response?.status ?? 'NETWORK'} ${error.config?.url}`, error.response?.data)
    }
    return Promise.reject(error)
  }
)

export default api
