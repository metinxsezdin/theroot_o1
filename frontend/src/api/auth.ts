import axios from 'axios';

// API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hata işleme interceptörü
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

// Login fonksiyonu
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // Gerekirse token döndürebiliriz
  } catch (error) {
    console.error('Login error:', error);
    throw error; // Hata üst seviyeye gönderilir
  }
};

// Register fonksiyonu
export const register = async (data: { name: string; email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};
