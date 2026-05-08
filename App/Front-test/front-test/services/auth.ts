import { api } from './api';
export async function loginStudent(code: string, password: string) {
  return api.post('/login', { code, password });
}