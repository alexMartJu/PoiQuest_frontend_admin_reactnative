// ================== API CONFIGURATION ==================

import { Platform } from 'react-native';

// Ajusta esta URL según tu backend
export const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:8000' // Android emulator -> host machine
    : 'http://localhost:8000' // Desarrollo en iOS simulator / web
  : 'https://your-production-api.com'; // Producción

// Endpoints de autenticación
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  LOGOUT_ALL: '/auth/logout-all',
  ME: '/auth/me',
} as const;

// Endpoints de eventos
export const EVENT_ENDPOINTS = {
  LIST: '/events',
  BY_CATEGORY: (categoryUuid: string) => `/events/category/${categoryUuid}`,
  DETAIL: (uuid: string) => `/events/${uuid}`,
  CREATE: '/events',
  UPDATE: (uuid: string) => `/events/${uuid}`,
  DELETE: (uuid: string) => `/events/${uuid}`,
  FINISHED: '/events/finished',
  FINISHED_DETAIL: (uuid: string) => `/events/finished/${uuid}`,
} as const;

// Claves de almacenamiento
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME_MODE: 'theme_mode',
} as const;

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_LIMIT: 5,
  MAX_LIMIT: 5,
} as const;
