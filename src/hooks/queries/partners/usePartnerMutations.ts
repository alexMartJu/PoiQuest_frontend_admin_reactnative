import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCity,
  updateCity,
  disableCity,
  createOrganizer,
  updateOrganizer,
  disableOrganizer,
  createSponsor,
  updateSponsor,
  disableSponsor,
} from '@/services/partner.service';
import {
  citiesQueryKey,
  cityDetailQueryKey,
  organizersQueryKey,
  organizerDetailQueryKey,
  sponsorsQueryKey,
  sponsorDetailQueryKey,
} from '../queryKeys';
import type { CreateCityDto, UpdateCityDto, CreateOrganizerDto, UpdateOrganizerDto, CreateSponsorDto, UpdateSponsorDto } from '@/types/Partner';

// ================== CITIES ==================

export function useCreateCityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCityDto) => createCity(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: citiesQueryKey() });
    },
  });
}

export function useUpdateCityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateCityDto }) => updateCity(uuid, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: cityDetailQueryKey(updated.uuid) });
      queryClient.invalidateQueries({ queryKey: citiesQueryKey() });
    },
  });
}

export function useDisableCityMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: (uuid: string) => disableCity(uuid),
    onSuccess: (_data, uuid) => {
      try { queryClient.removeQueries({ queryKey: cityDetailQueryKey(uuid), exact: true }); } catch {}
      queryClient.invalidateQueries({ queryKey: citiesQueryKey() });
    },
  });
}

// ================== ORGANIZERS ==================

export function useCreateOrganizerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrganizerDto) => createOrganizer(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: organizersQueryKey() });
    },
  });
}

export function useUpdateOrganizerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateOrganizerDto }) =>
      updateOrganizer(uuid, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: organizerDetailQueryKey(updated.uuid) });
      queryClient.invalidateQueries({ queryKey: organizersQueryKey() });
    },
  });
}

export function useDisableOrganizerMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: (uuid: string) => disableOrganizer(uuid),
    onSuccess: (_data, uuid) => {
      try { queryClient.removeQueries({ queryKey: organizerDetailQueryKey(uuid), exact: true }); } catch {}
      queryClient.invalidateQueries({ queryKey: organizersQueryKey() });
    },
  });
}

// ================== SPONSORS ==================

export function useCreateSponsorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSponsorDto) => createSponsor(data),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: sponsorsQueryKey() });
    },
  });
}

export function useUpdateSponsorMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateSponsorDto }) =>
      updateSponsor(uuid, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: sponsorDetailQueryKey(updated.uuid) });
      queryClient.invalidateQueries({ queryKey: sponsorsQueryKey() });
    },
  });
}

export function useDisableSponsorMutation() {
  const queryClient = useQueryClient();
  return useMutation<void, unknown, string>({
    mutationFn: (uuid: string) => disableSponsor(uuid),
    onSuccess: (_data, uuid) => {
      try { queryClient.removeQueries({ queryKey: sponsorDetailQueryKey(uuid), exact: true }); } catch {}
      queryClient.invalidateQueries({ queryKey: sponsorsQueryKey() });
    },
  });
}
