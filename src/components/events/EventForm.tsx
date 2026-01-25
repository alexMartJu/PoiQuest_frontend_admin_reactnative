import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Switch } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import { createEventSchema, updateEventSchema, CreateEventFormValues, UpdateEventFormValues } from '@/schemas/event.schema';
import { Event } from '@/types/Event';
import { createEvent, updateEvent } from '@/services/event.service';
import { router } from 'expo-router';

interface EventFormProps {
  event?: Event | null;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EventForm({ event, isCreating = false, onSuccess, onCancel }: EventFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventFormStyles(theme), [theme]);
  const [isSaving, setIsSaving] = useState(false);

  // Usar el schema correcto según si es creación o edición
  const schema = isCreating ? createEventSchema : updateEventSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEventFormValues | UpdateEventFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isCreating
      ? {
          name: '',
          description: '',
          categoryUuid: '',
          location: '',
          startDate: '',
          endDate: '',
          imageUrls: [],
        }
      : {
          name: event?.name || '',
          description: event?.description || '',
          categoryUuid: event?.category?.uuid || '',
          location: event?.location || '',
          startDate: event?.startDate || '',
          endDate: event?.endDate || '',
          imageUrls: event?.images?.map(img => img.imageUrl) || [],
        },
  });

  // Actualizar el formulario cuando cambie el evento
  useEffect(() => {
    if (event && !isCreating) {
      reset({
        name: event.name,
        description: event.description || '',
        categoryUuid: event.category?.uuid || '',
        location: event.location || '',
        startDate: event.startDate,
        endDate: event.endDate || '',
        imageUrls: event.images?.map(img => img.imageUrl) || [],
      });
    }
  }, [event, isCreating, reset]);

  const onSubmit = async (data: CreateEventFormValues | UpdateEventFormValues) => {
    setIsSaving(true);
    try {
      if (isCreating) {
        // Crear nuevo evento
        const created = await createEvent(data as CreateEventFormValues);
        Alert.alert('Éxito', 'Evento creado correctamente');
        router.replace(`/(protected)/(drawer)/events/${created.uuid}`);
      } else {
        // Actualizar evento existente
        if (!event) {
          throw new Error('No hay evento para actualizar');
        }
        await updateEvent(event.uuid, data as UpdateEventFormValues);
        Alert.alert('Éxito', 'Evento actualizado correctamente');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar el evento';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
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
          Información básica
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Nombre del evento *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.name?.message}
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

        <Controller
          control={control}
          name="categoryUuid"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="UUID de la categoría *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.categoryUuid?.message}
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="location"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Ubicación"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.location?.message}
              maxLength={255}
            />
          )}
        />
      </View>

      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Fechas
        </Text>

        <Controller
          control={control}
          name="startDate"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Fecha de inicio (YYYY-MM-DD) *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.startDate?.message}
              placeholder="2025-12-01"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Fecha de fin (YYYY-MM-DD)"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.endDate?.message}
              placeholder="2025-12-31"
              autoCapitalize="none"
            />
          )}
        />
      </View>

      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Imágenes
        </Text>

        <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
          Introduce las URLs de las imágenes (mínimo 1, máximo 2). Separa cada URL con una coma.
        </Text>

        <Controller
          control={control}
          name="imageUrls"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="URLs de imágenes *"
              value={Array.isArray(value) ? value.join(', ') : ''}
              onChangeText={(text) => {
                const urls = text
                  .split(',')
                  .map(url => url.trim())
                  .filter(url => url.length > 0);
                onChange(urls);
              }}
              onBlur={onBlur}
              errorText={errors.imageUrls?.message || (Array.isArray(errors.imageUrls) && errors.imageUrls[0]?.message)}
              multiline
              numberOfLines={3}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              autoCapitalize="none"
            />
          )}
        />
      </View>

      <View style={staticStyles.buttonContainer}>
        <ButtonApp
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={isSaving}
          style={staticStyles.button}
        >
          {isCreating ? 'Crear evento' : 'Guardar cambios'}
        </ButtonApp>

        {onCancel && (
          <ButtonApp mode="outlined" onPress={onCancel} disabled={isSaving} style={staticStyles.button}>
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
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  helperText: {
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    width: '100%',
  },
});

const getEventFormStyles = (theme: AppTheme) => ({
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
  helperText: {
    color: theme.colors.onSurfaceVariant,
  },
});
