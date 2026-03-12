import { useQuery } from '@tanstack/react-query';
import { getRoutesByEvent } from '@/services/route.service';
import { routesByEventQueryKey } from '../queryKeys';

export function useRoutesByEventQuery(eventUuid?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: routesByEventQueryKey(eventUuid ?? ''),
    queryFn: () => getRoutesByEvent(eventUuid!),
    enabled: !!eventUuid && enabled,
  });
}
