import { useQuery } from '@tanstack/react-query';
import { getEventDetail } from '@/services/event.service';
import { eventDetailQueryKey } from '../queryKeys';

/**
 * Hook para obtener el detalle de un evento específico
 *
 * Características:
 * - Solo se ejecuta si el uuid es válido (enabled condicional)
 * - Cachea el resultado por UUID
 * - Reintenta automáticamente en caso de error de red
 * - Los datos son frescos durante 1 minuto
 *
 * @param uuid - UUID del evento (opcional)
 * @param enabled - Si la query debe ejecutarse (por defecto true si hay uuid)
 *
 * @example
 * const { data: event, isLoading, error } = useEventDetailQuery(uuid);
 */
export function useEventDetailQuery(uuid?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: eventDetailQueryKey(uuid!),
    queryFn: () => getEventDetail(uuid!),
    // Solo ejecutar si hay uuid válido y enabled es true
    enabled: !!uuid && enabled,
    // En caso de error 404, no reintentar (el evento no existe)
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      if (failureCount >= 2) return false;
      return true;
    },
  });
}
