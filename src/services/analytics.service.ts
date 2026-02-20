import apiClient from './api.client';
import { ANALYTICS_ENDPOINTS } from '@/constants';
import type {
  OverviewStats,
  EventsByCategoryResponse,
  UsersByMonthResponse,
} from '@/types/Analytics';

// ================== ANALYTICS SERVICE ==================

/**
 * Obtiene las estadísticas generales del dashboard
 */
export const getOverviewStats = async (): Promise<OverviewStats> => {
  const response = await apiClient.get<OverviewStats>(ANALYTICS_ENDPOINTS.OVERVIEW);
  return response.data;
};

/**
 * Obtiene el número de eventos por categoría
 */
export const getEventsByCategory = async (): Promise<EventsByCategoryResponse> => {
  const response = await apiClient.get<EventsByCategoryResponse>(
    ANALYTICS_ENDPOINTS.EVENTS_BY_CATEGORY
  );
  return response.data;
};

/**
 * Obtiene el número de usuarios registrados por mes
 */
export const getUsersByMonth = async (): Promise<UsersByMonthResponse> => {
  const response = await apiClient.get<UsersByMonthResponse>(
    ANALYTICS_ENDPOINTS.USERS_BY_MONTH
  );
  return response.data;
};
