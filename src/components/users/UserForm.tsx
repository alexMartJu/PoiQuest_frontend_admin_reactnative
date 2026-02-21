import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import {
  registerValidatorSchema,
  type RegisterValidatorFormValues,
} from '@/schemas/user.schema';
import { useRegisterValidatorMutation } from '@/hooks/queries/users';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { router } from 'expo-router';

interface UserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function UserForm({ onSuccess, onCancel }: UserFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getUserFormStyles(theme), [theme]);

  const registerMutation = useRegisterValidatorMutation();
  const isSaving = registerMutation.isPending;

  const showSnackbar = useSnackbarStore((state) => state.show);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValidatorFormValues>({
    resolver: zodResolver(registerValidatorSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      confirmPassword: '',
      avatarUrl: '',
      bio: '',
    },
  });

  const onSubmit = async (data: RegisterValidatorFormValues) => {
    try {
      const { confirmPassword, avatarUrl, bio, ...rest } = data;

      const dto = {
        ...rest,
        ...(avatarUrl && avatarUrl.trim() !== '' ? { avatarUrl: avatarUrl.trim() } : {}),
        ...(bio && bio.trim() !== '' ? { bio: bio.trim() } : {}),
      };

      await registerMutation.mutateAsync(dto);
      showSnackbar({ message: 'Validador registrado correctamente', variant: 'success' });
      if (onSuccess) onSuccess();
      else router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo registrar el usuario';
      showSnackbar({ message, variant: 'error' });
    }
  };

  return (
    <ScrollView
      style={[staticStyles.container, themed.container]}
      contentContainerStyle={staticStyles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Sección: Información personal ── */}
      <View style={[staticStyles.card, themed.card]}>
        <View style={staticStyles.sectionHeader}>
          <MaterialCommunityIcons
            name="account-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="titleMedium"
            style={[staticStyles.sectionTitle, themed.sectionTitle]}
          >
            Información personal
          </Text>
        </View>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Nombre *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.name?.message}
              maxLength={100}
              autoCapitalize="words"
            />
          )}
        />

        <Controller
          control={control}
          name="lastname"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Apellidos *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.lastname?.message}
              maxLength={150}
              autoCapitalize="words"
            />
          )}
        />
      </View>

      {/* ── Sección: Datos de la cuenta ── */}
      <View style={[staticStyles.card, themed.card]}>
        <View style={staticStyles.sectionHeader}>
          <MaterialCommunityIcons
            name="shield-lock-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="titleMedium"
            style={[staticStyles.sectionTitle, themed.sectionTitle]}
          >
            Datos de la cuenta
          </Text>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Email *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              left={
                <TextInput.Icon icon="email-outline" />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Contraseña *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.password?.message}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              left={
                <TextInput.Icon icon="lock-outline" />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Confirmar contraseña *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.confirmPassword?.message}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              left={
                <TextInput.Icon icon="lock-check-outline" />
              }
            />
          )}
        />

        <Text variant="bodySmall" style={[staticStyles.hint, themed.hint]}>
          Mínimo 8 caracteres.
        </Text>
      </View>

      {/* ── Sección: Perfil (opcional) ── */}
      <View style={[staticStyles.card, themed.card]}>
        <View style={staticStyles.sectionHeader}>
          <MaterialCommunityIcons
            name="card-account-details-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text
            variant="titleMedium"
            style={[staticStyles.sectionTitle, themed.sectionTitle]}
          >
            Perfil{' '}
            <Text variant="bodyMedium" style={themed.optional}>
              (opcional)
            </Text>
          </Text>
        </View>

        <Controller
          control={control}
          name="avatarUrl"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="URL del avatar"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.avatarUrl?.message}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              maxLength={255}
              placeholder="https://example.com/avatar.jpg"
              left={
                <TextInput.Icon icon="image-outline" />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="bio"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Biografía"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.bio?.message}
              multiline
              numberOfLines={3}
              placeholder="Breve descripción del validador..."
            />
          )}
        />
      </View>

      {/* ── Botones de acción ── */}
      <View style={staticStyles.buttonContainer}>
        <ButtonApp
          mode="contained"
          icon="account-plus"
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={isSaving}
          style={staticStyles.button}
          buttonColor={themed.buttonContained.backgroundColor}
          textColor={themed.buttonContained.textColor}
          accessibilityLabel="Registrar validador"
          accessibilityHint="Crea un nuevo usuario con rol ticket_validator"
        >
          Registrar validador
        </ButtonApp>

        {onCancel && (
          <ButtonApp
            mode="outlined"
            icon="close"
            onPress={onCancel}
            disabled={isSaving}
            style={[staticStyles.button, { borderColor: themed.cancelButton.borderColor }]}
            textColor={themed.cancelButton.textColor}
            accessibilityLabel="Cancelar registro"
            accessibilityHint="Descarta el formulario y regresa a la pantalla anterior"
          >
            Cancelar
          </ButtonApp>
        )}
      </View>
    </ScrollView>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    fontWeight: '700',
  },
  hint: {
    marginTop: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    width: '100%',
  },
});

const getUserFormStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
  },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.titleMedium.fontWeight as any,
  },
  optional: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: '400' as any,
  },
  hint: {
    color: theme.colors.onSurfaceVariant,
  },
  buttonContained: {
    backgroundColor: theme.colors.secondary,
    textColor: theme.colors.onSecondary,
  },
  cancelButton: {
    borderColor: theme.colors.error,
    textColor: theme.colors.error,
  },
});
