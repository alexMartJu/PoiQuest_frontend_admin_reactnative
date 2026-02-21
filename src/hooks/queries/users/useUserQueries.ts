import { useQuery } from '@tanstack/react-query';
import { getActiveUsers, getDisabledUsers } from '@/services/user.service';
import { usersQueryKey } from '../queryKeys';

// ================== USER QUERY HOOKS ==================

/**
 * Hook para obtener la lista de usuarios activos (solo admin)
 *
 * Características:
 * - Cachea los resultados automáticamente
 * - Los datos son frescos durante 2 minutos
 * - Recarga al volver a la pantalla
 *
 * @example
 * const { data: users, isLoading, error, refetch } = useActiveUsersQuery();
 */
export function useActiveUsersQuery() {
  return useQuery({
    queryKey: usersQueryKey('active'),
    queryFn: getActiveUsers,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook para obtener la lista de usuarios deshabilitados (solo admin)
 *
 * @example
 * const { data: users, isLoading, error, refetch } = useDisabledUsersQuery();
 */
export function useDisabledUsersQuery() {
  return useQuery({
    queryKey: usersQueryKey('disabled'),
    queryFn: getDisabledUsers,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  });
}
