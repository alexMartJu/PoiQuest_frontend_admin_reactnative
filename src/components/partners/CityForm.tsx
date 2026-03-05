import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import { createCitySchema, updateCitySchema, CreateCityFormValues, UpdateCityFormValues } from '@/schemas/partner.schema';
import type { City } from '@/types/Partner';
import { useCreateCityMutation, useUpdateCityMutation } from '@/hooks/queries/partners';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { router } from 'expo-router';

interface CityFormProps {
  city?: City | null;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CityForm({ city, isCreating = false, onSuccess, onCancel }: CityFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getCityFormStyles(theme), [theme]);

  const createMutation = useCreateCityMutation();
  const updateMutation = useUpdateCityMutation();
  const showSnackbar = useSnackbarStore((state) => state.show);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const schema = isCreating ? createCitySchema : updateCitySchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCityFormValues | UpdateCityFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isCreating
      ? { name: '', country: '', region: '', description: '' }
      : {
          name: city?.name || '',
          country: city?.country || '',
          region: city?.region || '',
          description: city?.description || '',
        },
  });

  useEffect(() => {
    if (city && !isCreating) {
      reset({
        name: city.name,
        country: city.country,
        region: city.region || '',
        description: city.description || '',
      });
    }
  }, [city, isCreating, reset]);

  const onSubmit = async (data: CreateCityFormValues | UpdateCityFormValues) => {
    try {
      const payload = {
        ...data,
        region: (data.region as string)?.trim() || null,
        description: (data.description as string)?.trim() || null,
      };

      if (isCreating) {
        const created = await createMutation.mutateAsync(payload as CreateCityFormValues);
        showSnackbar({ message: 'Ciudad creada correctamente', variant: 'success' });
        router.replace(`/(protected)/(drawer)/partners/cities/${created.uuid}`);
      } else {
        if (!city) throw new Error('No hay ciudad para actualizar');
        await updateMutation.mutateAsync({ uuid: city.uuid, data: payload as UpdateCityFormValues });
        showSnackbar({ message: 'Ciudad actualizada correctamente', variant: 'success' });
        onSuccess?.();
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar la ciudad';
      showSnackbar({ message, variant: 'error' });
    }
  };

  return (
    <ScrollView
      style={[staticStyles.container, themed.container]}
      contentContainerStyle={staticStyles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Información de la ciudad
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Nombre de la ciudad *"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.name?.message}
              maxLength={150}
            />
          )}
        />

        <Controller
          control={control}
          name="country"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="País *"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.country?.message}
              maxLength={100}
            />
          )}
        />

        <Controller
          control={control}
          name="region"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Región / Comunidad"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.region?.message}
              maxLength={150}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Descripción"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.description?.message}
              multiline
              numberOfLines={4}
            />
          )}
        />
      </View>

      {/* Botones de acción */}
      <View style={staticStyles.buttonContainer}>
        <ButtonApp
          mode="contained"
          icon={isCreating ? 'plus' : 'content-save'}
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={isSaving}
          style={staticStyles.button}
          buttonColor={themed.buttonContained?.backgroundColor}
          textColor={themed.buttonContained?.textColor}
        >
          {isCreating ? 'Crear ciudad' : 'Guardar cambios'}
        </ButtonApp>

        {onCancel && (
          <ButtonApp
            mode="outlined"
            icon="close"
            onPress={onCancel}
            disabled={isSaving}
            style={[staticStyles.button, { borderColor: themed.cancelButton?.borderColor }]}
            textColor={themed.cancelButton?.textColor}
          >
            Cancelar
          </ButtonApp>
        )}
      </View>
    </ScrollView>
  );
}

const staticStyles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  card: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 4,
  },
  sectionTitle: { marginBottom: 12, fontWeight: '700' },
  buttonContainer: { gap: 12, marginTop: 8 },
  button: { width: '100%' },
});

const getCityFormStyles = (theme: AppTheme) => ({
  container: { backgroundColor: theme.colors.background },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
  },
  sectionTitle: { color: theme.colors.onSurface },
  buttonContained: {
    backgroundColor: theme.colors.secondary,
    textColor: theme.colors.onSecondary,
  },
  cancelButton: {
    borderColor: theme.colors.error,
    textColor: theme.colors.error,
  },
});
