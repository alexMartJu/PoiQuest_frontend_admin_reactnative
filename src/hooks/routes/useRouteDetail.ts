import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useRouteDetailQuery } from '../queries/routes/useRouteDetailQuery';
import { useDeleteRouteMutation } from '../queries/routes/useRouteMutations';

export function useRouteDetail() {
  const { routeUuid, eventUuid } = useLocalSearchParams<{ routeUuid?: string; eventUuid?: string }>();

  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    data: route,
    isLoading,
    isError,
  } = useRouteDetailQuery(routeUuid);

  const deleteMutation = useDeleteRouteMutation();

  const handleDeleteRoute = async () => {
    if (!route) return;

    try {
      setConfirmVisible(false);

      await deleteMutation.mutateAsync({
        uuid: route.uuid,
        eventUuid: eventUuid || undefined,
      });

      router.back();
    } catch (error) {
      console.error('Error al eliminar ruta:', error);
    }
  };

  return {
    route: route ?? null,
    isLoading,
    isError,
    confirmVisible,
    setConfirmVisible,
    isDeleting: deleteMutation.isPending,
    handleDeleteRoute,
    eventUuid,
  };
}
