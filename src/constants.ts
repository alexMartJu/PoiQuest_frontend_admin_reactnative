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

// Endpoints de categorías de eventos
export const CATEGORY_ENDPOINTS = {
  LIST: '/event-categories',
} as const;

// Endpoints de analytics
export const ANALYTICS_ENDPOINTS = {
  OVERVIEW: '/analytics/overview',
  EVENTS_BY_CATEGORY: '/analytics/events-by-category',
  USERS_BY_MONTH: '/analytics/users-by-month',
} as const;

// Endpoints de usuarios (gestión admin)
export const USER_ENDPOINTS = {
  ALL: '/users',
  ACTIVE: '/users/active',
  DISABLED: '/users/disabled',
  DISABLE: (profileUuid: string) => `/users/profile/${profileUuid}/disable`,
  ENABLE: (profileUuid: string) => `/users/profile/${profileUuid}/enable`,
  REGISTER_VALIDATOR: '/users/validator',
} as const;

// Endpoints de puntos de interés
export const POI_ENDPOINTS = {
  LIST: '/points-of-interest',
  BY_EVENT: (eventUuid: string) => `/points-of-interest/event/${eventUuid}`,
  DETAIL: (uuid: string) => `/points-of-interest/${uuid}`,
  CREATE: '/points-of-interest',
  UPDATE: (uuid: string) => `/points-of-interest/${uuid}`,
  DELETE: (uuid: string) => `/points-of-interest/${uuid}`,
} as const;

// ================== FILE ENDPOINTS ==================
export const FILE_ENDPOINTS = {
  UPLOAD: (fileType: 'image' | 'model') => `/files/upload/${fileType}`,
  DELETE: (fileType: 'image' | 'model', fileName: string) => `/files/${fileType}/${fileName}`,
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
