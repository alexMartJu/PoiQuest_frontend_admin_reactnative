import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '@/constants';
import { useUserStore } from '@/stores/user.store';
import type { AuthResponse } from '@/types/User';

// ================== AXIOS INSTANCE ==================

// Crea instancia de axios con configuración base
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ================== REQUEST INTERCEPTOR ==================
// Agrega el access token a cada petición

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useUserStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// ================== RESPONSE INTERCEPTOR ==================
// Maneja errores 401 y refresca el token automáticamente

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no es el endpoint de refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(AUTH_ENDPOINTS.REFRESH)
    ) {
      if (isRefreshing) {
        // Si ya hay un refresh en proceso, esperamos
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useUserStore.getState().refreshToken;

      if (!refreshToken) {
        // No hay refresh token, logout
        useUserStore.getState().clearUser();
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Intenta refrescar el token
        const response = await axios.post<AuthResponse>(
          `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH}`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) {
          throw new Error('No se recibió access token');
        }

        // Actualiza el access token en el store
        useUserStore.getState().setAccessToken(newAccessToken);

        // Procesa las peticiones en cola
        processQueue(null, newAccessToken);

        // Reintenta la petición original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        isRefreshing = false;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, limpia el store y redirige a login
        processQueue(refreshError, null);
        useUserStore.getState().clearUser();
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
