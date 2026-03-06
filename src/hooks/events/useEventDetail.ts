import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAdminEventDetailQuery } from '../queries/events/useEventDetailQuery';
import { useDeleteEventMutation, useActivateEventMutation } from '../queries/events/useEventMutations';
import { useSnackbarStore } from '@/stores/snackbar.store';

export function useEventDetail() {
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [activateConfirmVisible, setActivateConfirmVisible] = useState(false);

  const { data: event, isLoading } = useAdminEventDetailQuery(uuid);
  const deleteMutation = useDeleteEventMutation();
  const activateMutation = useActivateEventMutation();
  const showSnackbar = useSnackbarStore((state) => state.show);

  const handleDeleteEvent = async () => {
    if (!event) return;
    try {
      setConfirmVisible(false);
      await deleteMutation.mutateAsync(event.uuid);
      router.back();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo eliminar el evento';
      showSnackbar({ message, variant: 'error' });
    }
  };

  const handleActivateEvent = async () => {
    if (!event) return;
    try {
      setActivateConfirmVisible(false);
      await activateMutation.mutateAsync(event.uuid);
      showSnackbar({ message: 'Evento activado correctamente', variant: 'success' });
      router.back();
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo activar el evento';
      showSnackbar({ message, variant: 'error' });
    }
  };

  return {
    event: event ?? null,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    activateConfirmVisible,
    setActivateConfirmVisible,
    isDeleting: deleteMutation.isPending,
    isActivating: activateMutation.isPending,
    handleDeleteEvent,
    handleActivateEvent,
  };
}

