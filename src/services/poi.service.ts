import apiClient from './api.client';
import { POI_ENDPOINTS } from '@/constants';
import type {
  PointOfInterest,
  CreatePoiDto,
  UpdatePoiDto,
} from '@/types/PointOfInterest';

// ================== POI SERVICE ==================

/**
 * Obtiene los POIs de un evento por UUID del evento
 */
export const getPoisByEvent = async (eventUuid: string): Promise<PointOfInterest[]> => {
  const response = await apiClient.get<PointOfInterest[]>(POI_ENDPOINTS.BY_EVENT(eventUuid));
  return response.data;
};

/**
 * Obtiene detalle de un POI por UUID
 */
export const getPoiDetail = async (uuid: string): Promise<PointOfInterest> => {
  const response = await apiClient.get<PointOfInterest>(POI_ENDPOINTS.DETAIL(uuid));
  return response.data;
};

/**
 * Crea un nuevo POI
 */
export const createPoi = async (data: CreatePoiDto): Promise<PointOfInterest> => {
  const response = await apiClient.post<PointOfInterest>(POI_ENDPOINTS.CREATE, data);
  return response.data;
};

/**
 * Actualiza un POI existente
 */
export const updatePoi = async (uuid: string, data: UpdatePoiDto): Promise<PointOfInterest> => {
  const response = await apiClient.patch<PointOfInterest>(POI_ENDPOINTS.UPDATE(uuid), data);
  return response.data;
};

/**
 * Elimina un POI (soft delete)
 */
export const deletePoi = async (uuid: string): Promise<void> => {
  await apiClient.delete(POI_ENDPOINTS.DELETE(uuid));
};
