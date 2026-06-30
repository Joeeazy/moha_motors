import axios from 'axios'

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default adminApi
