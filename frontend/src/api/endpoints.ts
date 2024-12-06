import axios from 'axios';
import { handleApiError } from '../utils/errorHandling';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => handleApiError(error)
);

// Personnel endpoints
export const personnelApi = {
  getAll: () => api.get('/personnel'),
  getById: (id: string) => api.get(`/personnel/${id}`),
  create: (data: any) => api.post('/personnel', data),
  update: (id: string, data: any) => api.put(`/personnel/${id}`, data),
  delete: (id: string) => api.delete(`/personnel/${id}`)
};

// Department endpoints
export const departmentApi = {
  getAll: () => api.get('/departments'),
  getById: (id: string) => api.get(`/departments/${id}`),
  create: (data: any) => api.post('/departments', data),
  update: (id: string, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: string) => api.delete(`/departments/${id}`)
};

// Project endpoints
export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`)
};

// Client endpoints
export const clientApi = {
  getAll: () => api.get('/clients'),
  getById: (id: string) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients', data),
  update: (id: string, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`)
};

// Booking endpoints
export const bookingApi = {
  getAll: () => api.get('/bookings'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  create: (data: any) => api.post('/bookings', data),
  update: (id: string, data: any) => api.put(`/bookings/${id}`, data),
  delete: (id: string) => api.delete(`/bookings/${id}`),
  getByResource: (resourceId: string) => api.get(`/bookings/resource/${resourceId}`)
};

// Activity types endpoints
export const activityApi = {
  getAll: () => api.get<string[]>('/activities'),
  create: (name: string) => api.post<string>('/activities', { name }),
  delete: (name: string) => api.delete(`/activities/${name}`),
  
  // Project specific activities
  getByProject: (projectId: string) => api.get<string[]>(`/activities/project/${projectId}`),
  addToProject: (projectId: string, activities: string[]) => 
    api.post<string[]>(`/activities/project/${projectId}`, { activities }),
  removeFromProject: (projectId: string, activity: string) =>
    api.delete(`/activities/project/${projectId}/${activity}`)
};

export default api;