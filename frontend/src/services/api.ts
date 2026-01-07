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

// Manufacturer Inspection API
export const manufacturerInspectionApi = {
  list: (params?: { status?: string; inspectorId?: string; page?: number; limit?: number }) =>
    api.get('/manufacturer-inspection', { params }),
  getById: (id: string) => api.get(`/manufacturer-inspection/${id}`),
  getByUnitId: (unitId: string) => api.get(`/manufacturer-inspection/unit/${unitId}`),
  getPendingInspection: () => api.get('/manufacturer-inspection/pending-inspection'),
  getPendingApproval: () => api.get('/manufacturer-inspection/pending-approval'),
  getReadyToShip: () => api.get('/manufacturer-inspection/ready-to-ship'),
  start: (unitId: string, templateId?: string) =>
    api.post('/manufacturer-inspection/start', { unitId, templateId }),
  updateItem: (inspectionId: string, itemId: string, data: { status: string; notes?: string; issueSeverity?: string }) =>
    api.patch(`/manufacturer-inspection/${inspectionId}/items/${itemId}`, data),
  updateItems: (inspectionId: string, items: { itemId: string; status: string; notes?: string }[]) =>
    api.patch(`/manufacturer-inspection/${inspectionId}/items`, { items }),
  complete: (id: string, data: { generalNotes?: string; signatureData?: string }) =>
    api.post(`/manufacturer-inspection/${id}/complete`, data),
  approve: (id: string, data?: { approvalNotes?: string }) =>
    api.post(`/manufacturer-inspection/${id}/approve`, data || {}),
  reject: (id: string, data: { rejectionReason: string }) =>
    api.post(`/manufacturer-inspection/${id}/reject`, data),
  ship: (unitId: string) => api.post(`/manufacturer-inspection/ship/${unitId}`),
}

// Item Notes API
export const itemNotesApi = {
  create: (data: { manufacturerItemId?: string; acceptanceItemId?: string; content: string; visibleToDealer?: boolean }) =>
    api.post('/item-notes', data),
  getForManufacturerItem: (itemId: string) => api.get(`/item-notes/manufacturer-item/${itemId}`),
  getForAcceptanceItem: (itemId: string) => api.get(`/item-notes/acceptance-item/${itemId}`),
  getForUnit: (unitId: string) => api.get(`/item-notes/unit/${unitId}`),
  update: (id: string, data: { content?: string; visibleToDealer?: boolean }) =>
    api.patch(`/item-notes/${id}`, data),
  submit: (id: string, data?: { makeVisibleToDealer?: boolean }) =>
    api.post(`/item-notes/${id}/submit`, data || {}),
  delete: (id: string) => api.delete(`/item-notes/${id}`),
}

// Units API - extended for manufacturer
export const manufacturerUnitsApi = {
  create: (data: {
    vin: string;
    modelYear: number;
    dealerId?: string;
    modelId?: string;
    stockNumber?: string;
    exteriorColor?: string;
    interiorColor?: string;
    chassisType?: string;
    engineType?: string;
    gvwr?: number;
    msrp?: number;
    productionDate?: string;
    plantLocation?: string;
    specialInstructions?: string;
  }) => api.post('/units', data),
  update: (id: string, data: any) => api.put(`/units/${id}`, data),
}

export default api
