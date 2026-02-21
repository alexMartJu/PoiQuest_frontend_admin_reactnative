import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disableUser, enableUser, registerValidator } from '@/services/user.service';
import { usersQueryKey } from '../queryKeys';
import { analyticsKeys } from '../analytics/useAnalyticsQueries';
import type { RegisterValidatorDto } from '@/types/User';

// ================== USER MUTATION HOOKS ==================

/**
 * Hook para deshabilitar la cuenta de un usuario por UUID de perfil
 *
 * Al completarse, invalida tanto la lista de activos como la de deshabilitados.
 *
 * @example
 * const disableMutation = useDisableUserMutation();
 * disableMutation.mutate(profileUuid);
 */
export function useDisableUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileUuid: string) => disableUser(profileUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey('active') });
      queryClient.invalidateQueries({ queryKey: usersQueryKey('disabled') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}

/**
 * Hook para habilitar la cuenta de un usuario por UUID de perfil
 *
 * Al completarse, invalida tanto la lista de activos como la de deshabilitados.
 *
 * @example
 * const enableMutation = useEnableUserMutation();
 * enableMutation.mutate(profileUuid);
 */
export function useEnableUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileUuid: string) => enableUser(profileUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey('active') });
      queryClient.invalidateQueries({ queryKey: usersQueryKey('disabled') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}

/**
 * Hook para registrar un nuevo usuario con rol ticket_validator
 *
 * Al completarse exitosamente, invalida la lista de usuarios activos.
 *
 * @example
 * const registerMutation = useRegisterValidatorMutation();
 * registerMutation.mutate(validatorData);
 */
export function useRegisterValidatorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterValidatorDto) => registerValidator(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey('active') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}
