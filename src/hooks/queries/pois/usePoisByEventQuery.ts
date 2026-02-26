import { useQuery } from '@tanstack/react-query';
import { getPoisByEvent } from '@/services/poi.service';
import { poisByEventQueryKey } from '../queryKeys';

/**
 * Hook para obtener los POIs de un evento específico
 *
 * Características:
 * - Solo se ejecuta si el eventUuid es válido (enabled condicional)
 * - Cachea el resultado por UUID del evento
 * - Reintenta automáticamente en caso de error de red
 * - Los datos son frescos durante 1 minuto
 *
 * @param eventUuid - UUID del evento (opcional)
 * @param enabled - Si la query debe ejecutarse (por defecto true si hay eventUuid)
 */
export function usePoisByEventQuery(eventUuid?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: poisByEventQueryKey(eventUuid!),
    queryFn: () => getPoisByEvent(eventUuid!),
    enabled: !!eventUuid && enabled,
    staleTime: 1000 * 60,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      if (failureCount >= 2) return false;
      return true;
    },
  });
}
