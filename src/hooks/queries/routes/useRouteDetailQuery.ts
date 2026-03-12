import { useQuery } from '@tanstack/react-query';
import { getRouteDetail } from '@/services/route.service';
import { routeDetailQueryKey } from '../queryKeys';

export function useRouteDetailQuery(uuid?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: routeDetailQueryKey(uuid ?? ''),
    queryFn: () => getRouteDetail(uuid!),
    enabled: !!uuid && enabled,
  });
}
