import Constants from 'expo-constants';

/**
 * Base URL للخادم (Express على المنفذ 9000 افتراضياً).
 *
 * Uses EXPO_PUBLIC_API_BASE_URL from .env file.
 * Falls back to Constants.expoConfig.extra.apiBaseUrl from app.config.js.
 * Final fallback to localhost for development.
 */
export const API_BASE_URL = 'http://192.168.1.4:9000';
