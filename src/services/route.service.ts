import apiClient from './api.client';
import { ROUTE_ENDPOINTS } from '@/constants';
import type { Route, CreateRouteDto, UpdateRouteDto } from '@/types/Route';

// ================== ROUTE SERVICE ==================

/**
 * Obtiene las rutas de un evento por UUID del evento
 */
export const getRoutesByEvent = async (eventUuid: string): Promise<Route[]> => {
  const response = await apiClient.get<Route[]>(ROUTE_ENDPOINTS.BY_EVENT(eventUuid));
  return response.data;
};

/**
 * Obtiene el detalle de una ruta por UUID
 */
export const getRouteDetail = async (uuid: string): Promise<Route> => {
  const response = await apiClient.get<Route>(ROUTE_ENDPOINTS.DETAIL(uuid));
  return response.data;
};

/**
 * Crea una nueva ruta
 */
export const createRoute = async (data: CreateRouteDto): Promise<Route> => {
  const response = await apiClient.post<Route>(ROUTE_ENDPOINTS.CREATE, data);
  return response.data;
};

/**
 * Actualiza una ruta existente
 */
export const updateRoute = async (uuid: string, data: UpdateRouteDto): Promise<Route> => {
  const response = await apiClient.patch<Route>(ROUTE_ENDPOINTS.UPDATE(uuid), data);
  return response.data;
};

/**
 * Elimina una ruta (soft delete)
 */
export const deleteRoute = async (uuid: string): Promise<void> => {
  await apiClient.delete(ROUTE_ENDPOINTS.DELETE(uuid));
};
