import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../config/api';

const BASE_URL = API_URL;

async function request(endpoint: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('token');
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = token; // غيّر إلى `Bearer ${token}` إذا لزم الأمر
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  return response.json();
}

export const api = {
  get: (endpoint: string) => request(endpoint, { method: 'GET' }),
  post: (endpoint: string, body: any) => request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  delete: (endpoint: string, body?: any) => request(endpoint, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined }),
  upload: async (endpoint: string, formData: FormData) => {
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'POST', headers: { Authorization: token || '' }, body: formData });
    return res.json();
  },
};