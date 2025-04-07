import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.agriscan.app/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  // token?: string;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

interface LoginResponseData {
  userId: string;
  phone: string;
  fullName: string;
  role: string;
  access_token: string;
}

interface ProfileResponseData {
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
  (response) => response,
  (error) => {
    if (error.response) {
      // If unauthorized, clear token
      if (error.response.status === 401) {
        localStorage.removeItem('authToken');
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: { phone: string; password: string }) => {
    const response = await api.post<ApiResponse<LoginResponseData>>('/auth/login/', credentials);
    // Store token in localStorage if it exists in the response
    if (response.data) {
      localStorage.setItem('authToken', response.data.data.access_token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },
  register: (userData: {
    phone: string; password: string; fullName: string; role: string;
    city: string; state: string; gpsLat: number; gpsLng: number;
  }) => api.post('/auth/register/', userData),
  getProfile: (userId?: string) => api.get<ApiResponse<ProfileResponseData>>(`/auth/profile/`),
  updateProfile: (profileData: Partial<ProfileResponseData>) => 
    api.put<ApiResponse<ProfileResponseData>>('/auth/profile', profileData),
};

export const reportsAPI = {
  getReports: (params?: any) => api.get('/reports', { params }),
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
