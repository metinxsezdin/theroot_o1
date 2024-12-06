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

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { name, email, password });
  const { token } = response.data;
  localStorage.setItem('token', token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};