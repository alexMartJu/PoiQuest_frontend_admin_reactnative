import apiClient from './api.client';
import { USER_ENDPOINTS } from '@/constants';
import type { BackendUser, RegisterValidatorDto } from '@/types/User';

// ================== USER SERVICE ==================

/**
 * Obtiene todos los usuarios con estado activo (solo admin)
 */
export const getActiveUsers = async (): Promise<BackendUser[]> => {
  const response = await apiClient.get<BackendUser[]>(USER_ENDPOINTS.ACTIVE);
  return response.data;
};

/**
 * Obtiene todos los usuarios con estado deshabilitado (solo admin)
 */
export const getDisabledUsers = async (): Promise<BackendUser[]> => {
  const response = await apiClient.get<BackendUser[]>(USER_ENDPOINTS.DISABLED);
  return response.data;
};

/**
 * Deshabilita la cuenta de un usuario por UUID de perfil
 */
export const disableUser = async (profileUuid: string): Promise<BackendUser> => {
  const response = await apiClient.patch<BackendUser>(USER_ENDPOINTS.DISABLE(profileUuid));
  return response.data;
};

/**
 * Habilita la cuenta de un usuario por UUID de perfil
 */
export const enableUser = async (profileUuid: string): Promise<BackendUser> => {
  const response = await apiClient.patch<BackendUser>(USER_ENDPOINTS.ENABLE(profileUuid));
  return response.data;
};

/**
 * Registra un nuevo usuario con rol ticket_validator (solo admin)
 */
export const registerValidator = async (dto: RegisterValidatorDto): Promise<BackendUser> => {
  const response = await apiClient.post<BackendUser>(USER_ENDPOINTS.REGISTER_VALIDATOR, dto);
  return response.data;
};
