import apiClient from './api.client';
import { EVENT_ENDPOINTS, CATEGORY_ENDPOINTS, PAGINATION } from '@/constants';
import type {
  Event,
  PaginatedEventsResponse,
  CreateEventDto,
  UpdateEventDto,
  EventCategory,
} from '@/types/Event';

// ================== EVENT SERVICE ==================

/**
 * Obtiene eventos activos con paginación por cursor
 */
export const getEvents = async (cursor?: string, limit?: number): Promise<PaginatedEventsResponse> => {
  const params: any = {
    limit: limit || PAGINATION.DEFAULT_LIMIT,
  };
  if (cursor) {
    params.cursor = cursor;
  }

  const response = await apiClient.get<PaginatedEventsResponse>(EVENT_ENDPOINTS.LIST, { params });
  return response.data;
};

/**
 * Obtiene eventos activos de una categoría con paginación por cursor
 */
export const getEventsByCategory = async (
  categoryUuid: string,
  cursor?: string,
  limit?: number,
): Promise<PaginatedEventsResponse> => {
  const params: any = {
    limit: limit || PAGINATION.DEFAULT_LIMIT,
  };
  if (cursor) {
    params.cursor = cursor;
  }

  const response = await apiClient.get<PaginatedEventsResponse>(
    EVENT_ENDPOINTS.BY_CATEGORY(categoryUuid),
    { params },
  );
  return response.data;
};

/**
 * Obtiene detalle de un evento activo por UUID
 */
export const getEventDetail = async (uuid: string): Promise<Event> => {
  const response = await apiClient.get<Event>(EVENT_ENDPOINTS.DETAIL(uuid));
  return response.data;
};

/**
 * Crea un nuevo evento
 */
export const createEvent = async (data: CreateEventDto): Promise<Event> => {
  const response = await apiClient.post<Event>(EVENT_ENDPOINTS.CREATE, data);
  return response.data;
};

/**
 * Actualiza un evento existente
 */
export const updateEvent = async (uuid: string, data: UpdateEventDto): Promise<Event> => {
  const response = await apiClient.patch<Event>(EVENT_ENDPOINTS.UPDATE(uuid), data);
  return response.data;
};

/**
 * Elimina un evento (soft delete)
 */
export const deleteEvent = async (uuid: string): Promise<void> => {
  await apiClient.delete(EVENT_ENDPOINTS.DELETE(uuid));
};

/**
 * Obtiene todos los eventos finalizados (solo admin)
 */
export const getFinishedEvents = async (): Promise<Event[]> => {
  const response = await apiClient.get<Event[]>(EVENT_ENDPOINTS.FINISHED);
  return response.data;
};

/**
 * Obtiene detalle de un evento finalizado por UUID (solo admin)
 */
export const getFinishedEventDetail = async (uuid: string): Promise<Event> => {
  const response = await apiClient.get<Event>(EVENT_ENDPOINTS.FINISHED_DETAIL(uuid));
  return response.data;
};

// ================== CATEGORY SERVICE ==================

/**
 * Obtiene todas las categorías de eventos
 */
export const getEventCategories = async (): Promise<EventCategory[]> => {
  const response = await apiClient.get<EventCategory[]>(CATEGORY_ENDPOINTS.LIST);
  return response.data;
};
