import { useQuery } from '@tanstack/react-query';
import {
  getOverviewStats,
  getEventsByCategory,
  getUsersByMonth,
} from '@/services/analytics.service';

// ================== QUERY KEYS ==================

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  eventsByCategory: () => [...analyticsKeys.all, 'eventsByCategory'] as const,
  usersByMonth: () => [...analyticsKeys.all, 'usersByMonth'] as const,
};

// ================== HOOKS ==================

/**
 * Hook para obtener las estadísticas generales del dashboard
 *
 * Características:
 * - Cachea los resultados automáticamente
 * - Reintenta hasta 2 veces en caso de error
 * - Los datos son frescos durante 5 minutos
 * - Recarga automáticamente al volver a la pantalla
 *
 * @example
 * const { data: stats, isLoading, error } = useOverviewStats();
 */
export function useOverviewStats() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: getOverviewStats,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener el número de eventos por categoría
 *
 * @example
 * const { data, isLoading } = useEventsByCategory();
 * const categories = data?.data ?? [];
 */
export function useEventsByCategory() {
  return useQuery({
    queryKey: analyticsKeys.eventsByCategory(),
    queryFn: getEventsByCategory,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener el número de usuarios registrados por mes
 *
 * @example
 * const { data, isLoading } = useUsersByMonth();
 * const months = data?.data ?? [];
 */
export function useUsersByMonth() {
  return useQuery({
    queryKey: analyticsKeys.usersByMonth(),
    queryFn: getUsersByMonth,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
