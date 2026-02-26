import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPoi, updatePoi, deletePoi } from '@/services/poi.service';
import { poisByEventQueryKey, poiDetailQueryKey } from '../queryKeys';
import type { CreatePoiDto, UpdatePoiDto } from '@/types/PointOfInterest';

/**
 * Hook para crear un nuevo POI
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - La lista de POIs del evento asociado
 */
export function useCreatePoiMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePoiDto) => createPoi(data),
    onSuccess: (_data, variables) => {
      // Invalidar la lista de POIs del evento
      queryClient.invalidateQueries({ queryKey: poisByEventQueryKey(variables.eventUuid) });
    },
  });
}

/**
 * Hook para actualizar un POI existente
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - El detalle del POI específico
 * - La lista de POIs del evento asociado (si se conoce)
 */
export function useUpdatePoiMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdatePoiDto }) =>
      updatePoi(uuid, data),
    onSuccess: (updatedPoi) => {
      // Invalidar el detalle del POI
      queryClient.invalidateQueries({ queryKey: poiDetailQueryKey(updatedPoi.uuid) });
      // Invalidar la lista de POIs del evento asociado si está disponible
      if (updatedPoi.event?.uuid) {
        queryClient.invalidateQueries({ queryKey: poisByEventQueryKey(updatedPoi.event.uuid) });
      }
      // Invalidar todas las queries de pois para asegurar frescura
      queryClient.invalidateQueries({ queryKey: ['pois'] });
    },
  });
}

/**
 * Hook para eliminar un POI
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - Todas las queries de POIs
 */
export function useDeletePoiMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, { uuid: string; eventUuid?: string }>({
    mutationFn: ({ uuid }) => deletePoi(uuid),
    onSuccess: (_data, { uuid, eventUuid }) => {
      // Eliminar la query de detalle de este UUID
      try {
        queryClient.removeQueries({ queryKey: poiDetailQueryKey(uuid), exact: true });
      } catch (e) {
        // ignore removal errors silently
      }
      // Invalidar la lista de POIs del evento si se conoce
      if (eventUuid) {
        queryClient.invalidateQueries({ queryKey: poisByEventQueryKey(eventUuid) });
      }
      // Invalidar todas las queries de pois
      queryClient.invalidateQueries({ queryKey: ['pois'] });
    },
  });
}
