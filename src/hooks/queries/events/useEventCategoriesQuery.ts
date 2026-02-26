import { useQuery } from '@tanstack/react-query';
import { getEventCategories } from '@/services/event.service';
import { eventCategoriesQueryKey } from '../queryKeys';

/**
 * Hook para obtener la lista de categorías de eventos
 *
 * Características:
 * - Cachea las categorías automáticamente
 * - Los datos son frescos durante 5 minutos (las categorías cambian poco)
 * - Reintenta hasta 2 veces en caso de error
 *
 * @example
 * const { data: categories, isLoading } = useEventCategoriesQuery();
 */
export function useEventCategoriesQuery() {
  return useQuery({
    queryKey: eventCategoriesQueryKey,
    queryFn: getEventCategories,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
}
