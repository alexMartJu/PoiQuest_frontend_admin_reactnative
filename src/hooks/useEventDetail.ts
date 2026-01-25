import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Event } from '@/types/Event';
import { getEventDetail, deleteEvent } from '@/services/event.service';

export function useEventDetail() {
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();
  const isCreating = uuid === 'new';

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      setIsLoading(true);
      
      if (isCreating) {
        if (isMounted) {
          setEvent(null);
          setIsLoading(false);
        }
        return;
      }

      if (!uuid) {
        if (isMounted) {
          setEvent(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await getEventDetail(uuid);
        if (isMounted) {
          setEvent(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setEvent(null);
          setIsLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [uuid, isCreating]);

  const handleDeleteEvent = async () => {
    if (!event) return;

    try {
      setIsDeleting(true);
      setConfirmVisible(false);

      await deleteEvent(event.uuid);

      // Volver al listado
      router.back();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelCreate = () => {
    router.back();
  };

  return {
    event,
    setEvent,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDeleting,
    isCreating,
    handleDeleteEvent,
    handleCancelCreate,
  };
}
