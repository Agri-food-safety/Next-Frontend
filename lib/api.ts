import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agriscan.app/v1';

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

interface LoginResponse {
  success: boolean;
  data: {
    userId: string;
    phone: string;
    fullName: string;
    role: string;
  };
  token: string;
}

interface ProfileResponse {
  success: boolean;
  data: {
    userId: string;
    phone: string;
    fullName: string;
    role: string;
    city: string;
    state: string;
    gpsLat: number;
    gpsLng: number;
    createdAt: string;
    lastActive: string;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: { data: any }) => response.data,
  (error: { response?: { data: ApiError } }) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { phone: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', credentials),
  register: (userData: {
    phone: string;
    password: string;
    fullName: string;
    role: string;
    city: string;
    state: string;
    gpsLat: number;
    gpsLng: number;
  }) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData: {
    fullName?: string;
    city?: string;
    state?: string;
    gpsLat?: number;
    gpsLng?: number;
  }) => api.put('/auth/profile', profileData),
};

export const reportsAPI = {
  getReports: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    plantTypeId?: string;
    state?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/reports', { params }),
  getReportDetails: (reportId: string) => api.get(`/reports/${reportId}`),
  submitReport: (formData: FormData) =>
    api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  updateReportStatus: (reportId: string, statusData: {
    status: string;
    reviewNotes: string;
  }) => api.put(`/reports/${reportId}/status`, statusData),
};

export const plantsAPI = {
  getPlantTypes: () => api.get('/plants'),
  getPlantDetails: (plantTypeId: string) => api.get(`/plants/${plantTypeId}`),
};

export const diseasesAPI = {
  getDiseases: (params?: { plantTypeId?: string }) =>
    api.get('/diseases', { params }),
  getDiseaseDetails: (diseaseId: string) => api.get(`/diseases/${diseaseId}`),
};

export const alertsAPI = {
  getAlerts: (params?: { page?: number; limit?: number; severity?: string }) =>
    api.get('/alerts', { params }),
  createAlert: (alertData: {
    title: string;
    description: string;
    severity: string;
    targetState: string;
    targetCity?: string;
    expiresAt: string;
  }) => api.post('/alerts', alertData),
  updateAlert: (alertId: string, alertData: {
    title?: string;
    description?: string;
    severity?: string;
    expiresAt?: string;
  }) => api.put(`/alerts/${alertId}`, alertData),
  deleteAlert: (alertId: string) => api.delete(`/alerts/${alertId}`),
};

export const statsAPI = {
  getOverviewStats: (params?: { period?: string; state?: string }) =>
    api.get('/stats/overview', { params }),
  getGeographicalStats: (params?: {
    period?: string;
    plantTypeId?: string;
    diseaseId?: string;
  }) => api.get('/stats/geographical', { params }),
};

export default api;
