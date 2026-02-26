import { useQuery } from '@tanstack/react-query';
import { getPoiDetail } from '@/services/poi.service';
import { poiDetailQueryKey } from '../queryKeys';

/**
 * Hook para obtener el detalle de un POI específico
 *
 * Características:
 * - Solo se ejecuta si el uuid es válido (enabled condicional)
 * - Cachea el resultado por UUID
 * - Reintenta automáticamente en caso de error de red
 * - Los datos son frescos durante 1 minuto
 *
 * @param uuid - UUID del POI (opcional)
 * @param enabled - Si la query debe ejecutarse (por defecto true si hay uuid)
 */
export function usePoiDetailQuery(uuid?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: poiDetailQueryKey(uuid!),
    queryFn: () => getPoiDetail(uuid!),
    enabled: !!uuid && enabled,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      if (failureCount >= 2) return false;
      return true;
    },
  });
}
