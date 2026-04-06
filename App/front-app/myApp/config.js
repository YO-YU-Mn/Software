// config.js
export const API_BASE_URL = "http://192.168.1.15:9000";

// ثم في ملف StudentDashboard.jsx استدعه هكذا:
// import { API_BASE_URL } from './config';
// واستخدمه في fetch:
// const response = await fetch(`${API_BASE_URL}/notifications/get`, ...);