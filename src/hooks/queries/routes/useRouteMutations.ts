import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRoute, updateRoute, deleteRoute } from '@/services/route.service';
import { routesByEventQueryKey, routeDetailQueryKey } from '../queryKeys';
import type { CreateRouteDto, UpdateRouteDto } from '@/types/Route';

/**
 * Hook para crear una nueva ruta
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - La lista de rutas del evento asociado
 */
export function useCreateRouteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRouteDto) => createRoute(data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: routesByEventQueryKey(variables.eventUuid) });
    },
  });
}

/**
 * Hook para actualizar una ruta existente
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - El detalle de la ruta específica
 * - La lista de rutas del evento
 */
export function useUpdateRouteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateRouteDto }) =>
      updateRoute(uuid, data),
    onSuccess: (_updatedRoute, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: routeDetailQueryKey(uuid) });
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}

/**
 * Hook para eliminar una ruta
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - Todas las queries de rutas
 */
export function useDeleteRouteMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, { uuid: string; eventUuid?: string }>({
    mutationFn: ({ uuid }) => deleteRoute(uuid),
    onSuccess: (_data, { uuid, eventUuid }) => {
      try {
        queryClient.removeQueries({ queryKey: routeDetailQueryKey(uuid), exact: true });
      } catch (e) {
        // ignore removal errors silently
      }
      if (eventUuid) {
        queryClient.invalidateQueries({ queryKey: routesByEventQueryKey(eventUuid) });
      }
      queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });
}
