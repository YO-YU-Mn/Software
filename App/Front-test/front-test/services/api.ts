import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from "../config/api";

const BASE_URL = API_URL;

async function request(
  endpoint: string,
  options: RequestInit = {}
) {

  const token = await AsyncStorage.getItem('token');

  const headers: any = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = token;
  }

  const response = await fetch(
    `${BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  return data;
}

export const api = {

  get: (endpoint: string) =>
    request(endpoint),

  post: (
    endpoint: string,
    body: any
  ) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  upload: async (
    endpoint: string,
    formData: FormData
  ) => {

    const token =
      await AsyncStorage.getItem('token');

    const response = await fetch(
      `${BASE_URL}${endpoint}`,
      {
        method: 'POST',
        headers: {
          Authorization: token || '',
        },
        body: formData,
      }
    );

    return response.json();
  },
};