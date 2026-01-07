import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = useAuthStore.getState().refreshToken
      if (refreshToken) {
        try {
          const response = await axios.post('/api/v1/auth/refresh', {
            refreshToken,
          })
          const { accessToken } = response.data
          useAuthStore.getState().updateToken(accessToken)
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        } catch {
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
      } else {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string; role: string; dealerId?: string }) =>
    api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
}

// Units API
export const unitsApi = {
  list: (params?: { dealerId?: string; status?: string; search?: string; page?: number; limit?: number }) =>
    api.get('/units', { params }),
  getByVin: (vin: string) => api.get(`/units/${vin}`),
  getHistory: (vin: string) => api.get(`/units/${vin}/history`),
  getPending: () => api.get('/units/pending'),
  getInProgress: () => api.get('/units/in-progress'),
  markReceived: (id: string) => api.post(`/units/${id}/receive`),
}

// PDI API
export const pdiApi = {
  getByVin: (vin: string) => api.get(`/pdi/unit/${vin}`),
  getById: (id: string) => api.get(`/pdi/${id}`),
  getSummary: (id: string) => api.get(`/pdi/${id}/summary`),
}

// Acceptance API
export const acceptanceApi = {
  list: (params?: { dealerId?: string; status?: string; page?: number; limit?: number }) =>
    api.get('/acceptances', { params }),
  getById: (id: string) => api.get(`/acceptances/${id}`),
  getByVin: (vin: string) => api.get(`/acceptances/unit/${vin}`),
  getProgress: (id: string) => api.get(`/acceptances/${id}/progress`),
  getSummary: (id: string) => api.get(`/acceptances/${id}/summary`),
  start: (vin: string, deviceInfo?: any, locationData?: any) =>
    api.post('/acceptances', { vin, deviceInfo, locationData }),
  updateItem: (acceptanceId: string, itemId: string, data: { status: string; notes?: string }) =>
    api.patch(`/acceptances/${acceptanceId}/items/${itemId}`, data),
  updateItems: (acceptanceId: string, items: { id: string; status: string; notes?: string }[]) =>
    api.patch(`/acceptances/${acceptanceId}/items`, items),
  submit: (id: string, data: { decision: string; conditions?: any[]; generalNotes?: string; signatureData: string }) =>
    api.post(`/acceptances/${id}/submit`, data),
  cancel: (id: string) => api.post(`/acceptances/${id}/cancel`),
}

// Checklists API
export const checklistApi = {
  list: (active?: boolean) => api.get('/checklists', { params: { active } }),
  getById: (id: string) => api.get(`/checklists/${id}`),
  getForModel: (modelId: string) => api.get(`/checklists/for-model/${modelId}`),
}

export default api
