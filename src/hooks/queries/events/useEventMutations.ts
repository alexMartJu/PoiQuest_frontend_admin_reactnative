import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, updateEvent, deleteEvent, activateEvent } from '@/services/event.service';
import { eventsQueryKey, eventDetailQueryKey, adminEventsQueryKey, adminEventDetailQueryKey } from '../queryKeys';
import type { CreateEventDto, UpdateEventDto } from '@/types/Event';

/**
 * Hook para crear un nuevo evento
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - La lista de eventos (para que se recargue)
 *
 * @example
 * const createMutation = useCreateEventMutation();
 * createMutation.mutate(eventData, {
 *   onSuccess: (newEvent) => {
 *     console.log('Evento creado:', newEvent);
 *   }
 * });
 */
export function useCreateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventDto) => createEvent(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: eventsQueryKey() });
      queryClient.invalidateQueries({ queryKey: adminEventsQueryKey('pending') });
    },
  });
}

/**
 * Hook para actualizar un evento existente
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - El detalle del evento específico
 * - La lista de eventos
 *
 * @example
 * const updateMutation = useUpdateEventMutation();
 * updateMutation.mutate({ uuid: '123', data: updates }, {
 *   onSuccess: (updatedEvent) => {
 *     console.log('Evento actualizado:', updatedEvent);
 *   }
 * });
 */
export function useUpdateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateEventDto }) =>
      updateEvent(uuid, data),
    onSuccess: (updatedEvent) => {
      queryClient.invalidateQueries({ queryKey: eventDetailQueryKey(updatedEvent.uuid) });
      queryClient.invalidateQueries({ queryKey: adminEventDetailQueryKey(updatedEvent.uuid) });
      queryClient.invalidateQueries({ queryKey: eventsQueryKey() });
      queryClient.invalidateQueries({ queryKey: adminEventsQueryKey('pending') });
      queryClient.invalidateQueries({ queryKey: adminEventsQueryKey('active') });
    },
  });
}

/**
 * Hook para eliminar un evento
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - La lista de eventos (para que desaparezca el eliminado)
 *
 * @example
 * const deleteMutation = useDeleteEventMutation();
 * deleteMutation.mutate(uuid, {
 *   onSuccess: () => {
 *     console.log('Evento eliminado');
 *     router.back();
 *   }
 * });
 */
export function useDeleteEventMutation() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: (uuid: string) => deleteEvent(uuid),
    onSuccess: (_data: void, uuid: string) => {
      try {
        queryClient.removeQueries({ queryKey: eventDetailQueryKey(uuid), exact: true });
        queryClient.removeQueries({ queryKey: adminEventDetailQueryKey(uuid), exact: true });
      } catch (e) {
        // ignore removal errors silently
      }
      // Remove the deleted event from any cached admin list pages so the UI updates immediately
      const adminFilters = ['pending', 'active', 'finished', 'deleted'] as const;
      adminFilters.forEach((filter) => {
        try {
          queryClient.setQueryData<any>(
            adminEventsQueryKey(filter),
            (old: any) => {
              if (!old || !old.pages) return old;
              const newPages = old.pages.map((page: any) => ({
                ...page,
                data: page.data?.filter((item: any) => item.uuid !== uuid) ?? [],
              }));
              return { ...old, pages: newPages };
            },
          );
        } catch (e) {
          // ignore per-filter update errors
        }
      });

      // Also invalidate to ensure server-state consistency
      queryClient.invalidateQueries({ queryKey: eventsQueryKey(), exact: true });
      adminFilters.forEach((filter) => queryClient.invalidateQueries({ queryKey: adminEventsQueryKey(filter) }));
    },
  });
}

/**
 * Hook para activar un evento pendiente (PENDING → ACTIVE)
 *
 * Al completarse exitosamente, invalida automáticamente:
 * - La lista admin de eventos pendientes
 * - La lista admin de eventos activos
 * - El detalle admin del evento
 */
export function useActivateEventMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => activateEvent(uuid),
    onSuccess: (activatedEvent) => {
      queryClient.invalidateQueries({ queryKey: adminEventsQueryKey('pending') });
      queryClient.invalidateQueries({ queryKey: adminEventsQueryKey('active') });
      queryClient.invalidateQueries({ queryKey: adminEventDetailQueryKey(activatedEvent.uuid) });
    },
  });
}
