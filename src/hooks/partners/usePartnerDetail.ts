import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useCityDetailQuery, useOrganizerDetailQuery, useSponsorDetailQuery } from '../queries/partners/usePartnersQuery';
import { useDisableCityMutation, useDisableOrganizerMutation, useDisableSponsorMutation } from '../queries/partners/usePartnerMutations';
import { useSnackbarStore } from '@/stores/snackbar.store';

// ================== CITY DETAIL ==================

export function useCityDetail() {
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data: city, isLoading } = useCityDetailQuery(uuid);
  const disableMutation = useDisableCityMutation();

  const handleDisable = async () => {
    if (!city) return;
    try {
      setConfirmVisible(false);
      await disableMutation.mutateAsync(city.uuid);
      showSnackbar({ message: 'Ciudad desactivada correctamente', variant: 'success' });
      router.back();
    } catch {
      showSnackbar({ message: 'No se pudo desactivar la ciudad', variant: 'error' });
    }
  };

  return {
    city: city ?? null,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDisabling: disableMutation.isPending,
    handleDisable,
  };
}

// ================== ORGANIZER DETAIL ==================

export function useOrganizerDetail() {
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data: organizer, isLoading } = useOrganizerDetailQuery(uuid);
  const disableMutation = useDisableOrganizerMutation();

  const handleDisable = async () => {
    if (!organizer) return;
    try {
      setConfirmVisible(false);
      await disableMutation.mutateAsync(organizer.uuid);
      showSnackbar({ message: 'Organizador desactivado correctamente', variant: 'success' });
      router.back();
    } catch {
      showSnackbar({ message: 'No se pudo desactivar el organizador', variant: 'error' });
    }
  };

  return {
    organizer: organizer ?? null,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDisabling: disableMutation.isPending,
    handleDisable,
  };
}

// ================== SPONSOR DETAIL ==================

export function useSponsorDetail() {
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();
  const showSnackbar = useSnackbarStore((s) => s.show);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const { data: sponsor, isLoading } = useSponsorDetailQuery(uuid);
  const disableMutation = useDisableSponsorMutation();

  const handleDisable = async () => {
    if (!sponsor) return;
    try {
      setConfirmVisible(false);
      await disableMutation.mutateAsync(sponsor.uuid);
      showSnackbar({ message: 'Patrocinador desactivado correctamente', variant: 'success' });
      router.back();
    } catch {
      showSnackbar({ message: 'No se pudo desactivar el patrocinador', variant: 'error' });
    }
  };

  return {
    sponsor: sponsor ?? null,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDisabling: disableMutation.isPending,
    handleDisable,
  };
}
