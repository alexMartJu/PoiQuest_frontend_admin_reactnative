import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  getCities,
  getOrganizers,
  getSponsors,
  getCityDetail,
  getOrganizerDetail,
  getSponsorDetail,
} from '@/services/partner.service';
import {
  citiesQueryKey,
  organizersQueryKey,
  sponsorsQueryKey,
  cityDetailQueryKey,
  organizerDetailQueryKey,
  sponsorDetailQueryKey,
  allActiveCitiesQueryKey,
  allActiveOrganizersQueryKey,
  allActiveSponsorsQueryKey,
} from '../queryKeys';
import type { PartnerStatus } from '@/types/Partner';

const PARTNER_LIMIT = 5;

// ================== CITIES ==================

/** Lista paginada (infinita) de ciudades filtrada por estado */
export function useCitiesInfiniteQuery(status?: PartnerStatus) {
  return useInfiniteQuery({
    queryKey: citiesQueryKey(status),
    queryFn: ({ pageParam }) => getCities(pageParam, PARTNER_LIMIT, status),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor ?? undefined : undefined,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}

/** Detalle de una ciudad */
export function useCityDetailQuery(uuid?: string) {
  return useQuery({
    queryKey: cityDetailQueryKey(uuid!),
    queryFn: () => getCityDetail(uuid!),
    enabled: !!uuid,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

/** Todas las ciudades activas (para selects en formularios) */
export function useAllActiveCitiesQuery() {
  return useQuery({
    queryKey: allActiveCitiesQueryKey,
    queryFn: () => getCities(undefined, 100, 'active' as PartnerStatus),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });
}

// ================== ORGANIZERS ==================

/** Lista paginada (infinita) de organizadores filtrada por estado */
export function useOrganizersInfiniteQuery(status?: PartnerStatus) {
  return useInfiniteQuery({
    queryKey: organizersQueryKey(status),
    queryFn: ({ pageParam }) => getOrganizers(pageParam, PARTNER_LIMIT, status),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor ?? undefined : undefined,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}

/** Detalle de un organizador */
export function useOrganizerDetailQuery(uuid?: string) {
  return useQuery({
    queryKey: organizerDetailQueryKey(uuid!),
    queryFn: () => getOrganizerDetail(uuid!),
    enabled: !!uuid,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

/** Todos los organizadores activos (para selects en formularios) */
export function useAllActiveOrganizersQuery() {
  return useQuery({
    queryKey: allActiveOrganizersQueryKey,
    queryFn: () => getOrganizers(undefined, 100, 'active' as PartnerStatus),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });
}

// ================== SPONSORS ==================

/** Lista paginada (infinita) de patrocinadores filtrada por estado */
export function useSponsorsInfiniteQuery(status?: PartnerStatus) {
  return useInfiniteQuery({
    queryKey: sponsorsQueryKey(status),
    queryFn: ({ pageParam }) => getSponsors(pageParam, PARTNER_LIMIT, status),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor ?? undefined : undefined,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60,
  });
}

/** Detalle de un patrocinador */
export function useSponsorDetailQuery(uuid?: string) {
  return useQuery({
    queryKey: sponsorDetailQueryKey(uuid!),
    queryFn: () => getSponsorDetail(uuid!),
    enabled: !!uuid,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
}

/** Todos los patrocinadores activos (para selects en formularios) */
export function useAllActiveSponsorsQuery() {
  return useQuery({
    queryKey: allActiveSponsorsQueryKey,
    queryFn: () => getSponsors(undefined, 100, 'active' as PartnerStatus),
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });
}
