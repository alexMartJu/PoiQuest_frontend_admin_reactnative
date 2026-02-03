import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useEventDetailQuery } from '../queries/events/useEventDetailQuery';
import { useDeleteEventMutation } from '../queries/events/useEventMutations';

export function useEventDetail() {
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();
  const isCreating = uuid === 'new';

  const [confirmVisible, setConfirmVisible] = useState(false);

  // Usar React Query para obtener el detalle del evento
  const {
    data: event,
    isLoading,
    isError,
  } = useEventDetailQuery(uuid, !isCreating);

  // Usar React Query para eliminar evento
  const deleteMutation = useDeleteEventMutation();

  const handleDeleteEvent = async () => {
    if (!event) return;

    try {
      setConfirmVisible(false);

      await deleteMutation.mutateAsync(event.uuid);

      // Volver al listado
      router.back();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  const handleCancelCreate = () => {
    router.back();
  };

  return {
    event: event ?? null,
    isLoading: isCreating ? false : isLoading,
    confirmVisible,
    setConfirmVisible,
    isDeleting: deleteMutation.isPending,
    isCreating,
    handleDeleteEvent,
    handleCancelCreate,
  };
}
