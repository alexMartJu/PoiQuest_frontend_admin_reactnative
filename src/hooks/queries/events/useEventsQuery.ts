import { useInfiniteQuery } from '@tanstack/react-query';
import { getEvents } from '@/services/event.service';
import { eventsQueryKey } from '../queryKeys';

/**
 * Hook para obtener la lista de eventos con paginación infinita (scroll)
 *
 * Características:
 * - Paginación infinita por cursor (scroll para cargar más)
 * - Cachea los resultados automáticamente
 * - Reintenta hasta 2 veces en caso de error
 * - Los datos son frescos durante 1 minuto
 * - Recarga automáticamente al volver a la pantalla
 *
 * @param limit - Número de eventos por página (por defecto 10)
 *
 * @example
 * const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useEventsInfiniteQuery();
 *
 * // Concatenar todas las páginas:
 * const allEvents = data?.pages.flatMap(page => page.data) ?? [];
 *
 * // Al llegar al final del scroll:
 * if (hasNextPage && !isFetchingNextPage) {
 *   fetchNextPage();
 * }
 */
export function useEventsInfiniteQuery(limit: number = 5) {
  return useInfiniteQuery({
    queryKey: eventsQueryKey(),
    queryFn: ({ pageParam }) => getEvents(pageParam, limit),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      // Si hay más páginas, devolver el cursor; si no, undefined (detiene paginación)
      return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
    },
    // Mantener datos previos mientras se carga la siguiente página
    placeholderData: (previousData) => previousData,
    // Los datos son frescos durante 1 minuto (evita refetches innecesarios)
    staleTime: 1000 * 60,
    // Refrescar automáticamente cuando la app vuelve al primer plano
    refetchOnWindowFocus: true,
  });
}
