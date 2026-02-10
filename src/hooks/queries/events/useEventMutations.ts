import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, updateEvent, deleteEvent } from '@/services/event.service';
import { eventsQueryKey, eventDetailQueryKey } from '../queryKeys';
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
      // Resetear la infinite query para volver a la primera página
      // Esto es necesario porque los eventos se ordenan ASC por createdAt,
      // y el nuevo evento tendría un createdAt reciente (estaría en páginas posteriores).
      // resetQueries elimina el caché y fuerza un refetch completo desde la primera página.
      queryClient.resetQueries({ queryKey: eventsQueryKey() });
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
      // Invalidar el detalle del evento
      queryClient.invalidateQueries({ queryKey: eventDetailQueryKey(updatedEvent.uuid) });
      // Para updates, invalidateQueries es suficiente porque el evento ya existe en la lista
      // y solo cambian sus datos, no su posición (createdAt no cambia)
      queryClient.invalidateQueries({ queryKey: eventsQueryKey() });
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
      // Eliminar la query de detalle de este UUID para evitar refetch que cause 404
      try {
        queryClient.removeQueries({ queryKey: eventDetailQueryKey(uuid), exact: true });
      } catch (e) {
        // ignore removal errors silently in dev
      }
      // Invalidar la lista de eventos (solo la lista)
      queryClient.invalidateQueries({ queryKey: eventsQueryKey(), exact: true });
    },
  });
}
