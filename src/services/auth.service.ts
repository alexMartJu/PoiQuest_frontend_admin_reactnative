import apiClient from './api.client';
import { AUTH_ENDPOINTS } from '@/constants';
import type { AuthResponse, LoginCredentials } from '@/types/User';

// ================== AUTH SERVICE ==================

/**
 * Inicia sesión con email y contraseña
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
  return response.data;
};

/**
 * Refresca el access token usando el refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.REFRESH, {
    refreshToken,
  });
  return response.data;
};

/**
 * Cierra sesión en el dispositivo actual
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT, { refreshToken });
};

/**
 * Cierra sesión en todos los dispositivos
 */
export const logoutAll = async (): Promise<void> => {
  await apiClient.post(AUTH_ENDPOINTS.LOGOUT_ALL);
};

/**
 * Obtiene el perfil del usuario autenticado
 */
export const getMe = async (): Promise<AuthResponse> => {
  const response = await apiClient.get<AuthResponse>(AUTH_ENDPOINTS.ME);
  return response.data;
};
