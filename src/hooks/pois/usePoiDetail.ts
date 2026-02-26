import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { usePoiDetailQuery } from '../queries/pois/usePoiDetailQuery';
import { useDeletePoiMutation } from '../queries/pois/usePoiMutations';

export function usePoiDetail() {
  const { poiUuid, eventUuid } = useLocalSearchParams<{ poiUuid?: string; eventUuid?: string }>();

  const [confirmVisible, setConfirmVisible] = useState(false);

  // Usar React Query para obtener el detalle del POI
  const {
    data: poi,
    isLoading,
    isError,
  } = usePoiDetailQuery(poiUuid);

  // Usar React Query para eliminar POI
  const deleteMutation = useDeletePoiMutation();

  const handleDeletePoi = async () => {
    if (!poi) return;

    try {
      setConfirmVisible(false);

      await deleteMutation.mutateAsync({
        uuid: poi.uuid,
        eventUuid: eventUuid || poi.event?.uuid,
      });

      // Volver al listado
      router.back();
    } catch (error) {
      console.error('Error al eliminar POI:', error);
    }
  };

  return {
    poi: poi ?? null,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDeleting: deleteMutation.isPending,
    handleDeletePoi,
    eventUuid,
  };
}
