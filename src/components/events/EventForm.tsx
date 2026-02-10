import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, Pressable, ActivityIndicator } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import { createEventSchema, updateEventSchema, CreateEventFormValues, UpdateEventFormValues } from '@/schemas/event.schema';
import { Event } from '@/types/Event';
import { useCreateEventMutation, useUpdateEventMutation } from '@/hooks/queries/events';
import { router } from 'expo-router';
import { pickImageFromLibrary } from '@/utils/pickImage';
import { uploadImage } from '@/services/file.service';

interface EventFormProps {
  event?: Event | null;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Tipo para las imágenes que se están subiendo
interface SelectedImage {
  uri: string;
  fileName?: string;
  uploaded: boolean;
}

export function EventForm({ event, isCreating = false, onSuccess, onCancel }: EventFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventFormStyles(theme), [theme]);

  // Estado para las imágenes seleccionadas
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  // Usar React Query mutations
  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Usar el schema correcto según si es creación o edición
  const schema = isCreating ? createEventSchema : updateEventSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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
          imageFileNames: [],
        }
      : {
          name: event?.name || '',
          description: event?.description || '',
          categoryUuid: event?.category?.uuid || '',
          location: event?.location || '',
          startDate: event?.startDate || '',
          endDate: event?.endDate || '',
          imageFileNames: event?.images?.map(img => img.fileName) || [],
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
        imageFileNames: event.images?.map(img => img.fileName) || [],
      });
      
      // Cargar las imágenes existentes para mostrar en la UI
      if (event.images && event.images.length > 0) {
        setSelectedImages(
          event.images.map(img => ({
            uri: img.url, // URL presigned
            fileName: img.fileName,
            uploaded: true,
          }))
        );
      }
    }
  }, [event, isCreating, reset]);

  // Handler para seleccionar una imagen
  const handlePickImage = async () => {
    try {
      // Verificar límite de imágenes
      if (selectedImages.length >= 2) {
        Alert.alert('Límite alcanzado', 'Solo puedes seleccionar un máximo de 2 imágenes');
        return;
      }

      const asset = await pickImageFromLibrary();
      if (!asset) return; // Usuario canceló

      // Agregar imagen local (aún no subida)
      setSelectedImages(prev => [...prev, {
        uri: asset.uri,
        uploaded: false,
      }]);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo seleccionar la imagen');
    }
  };

  // Handler para eliminar una imagen
  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => {
      const next = prev.filter((_, i) => i !== index);

      // Sincronizar con el formulario: eliminar fileName si era subida
      const uploadedNames = next.filter((i) => i.fileName).map((i) => i.fileName!);
      setValue('imageFileNames' as any, uploadedNames);

      return next;
    });
  };

  // Handler para subir una imagen específica
  const handleUploadImage = async (index: number) => {
    const image = selectedImages[index];
    if (!image || image.uploaded) return;

    try {
      setUploadingImageIndex(index);
      const response = await uploadImage(image.uri);

      // Actualizar el estado de la imagen y sincronizar con el formulario
      setSelectedImages(prev => {
        const next = prev.map((img, i) =>
          i === index
            ? { ...img, fileName: response.fileName, uploaded: true }
            : img
        );

        // Sincronizar con el formulario: actualizar imageFileNames
        const uploadedNames = next.filter((i) => i.fileName).map((i) => i.fileName!);
        setValue('imageFileNames' as any, uploadedNames);

        return next;
      });

      Alert.alert('Éxito', 'Imagen subida correctamente');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo subir la imagen');
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const onSubmit = async (data: CreateEventFormValues | UpdateEventFormValues) => {
    try {
      // Validar que al menos haya una imagen
      if (selectedImages.length === 0) {
        Alert.alert('Error', 'Debes seleccionar al menos 1 imagen');
        return;
      }

      // Validar que todas las imágenes estén subidas
      const hasUnuploadedImages = selectedImages.some(img => !img.uploaded);
      if (hasUnuploadedImages) {
        Alert.alert('Error', 'Debes subir todas las imágenes antes de guardar');
        return;
      }

      // Extraer los fileNames de las imágenes subidas
      const imageFileNames = selectedImages
        .filter(img => img.fileName)
        .map(img => img.fileName!);

      // Agregar imageFileNames al payload
      const payload = {
        ...data,
        imageFileNames,
      };

      if (isCreating) {
        // Crear nuevo evento usando React Query mutation
        const created = await createMutation.mutateAsync(payload as CreateEventFormValues);
        Alert.alert('Éxito', 'Evento creado correctamente');
        router.replace(`/(protected)/(drawer)/events/${created.uuid}`);
      } else {
        // Actualizar evento existente usando React Query mutation
        if (!event) {
          throw new Error('No hay evento para actualizar');
        }
        await updateMutation.mutateAsync({
          uuid: event.uuid,
          data: payload as UpdateEventFormValues,
        });
        Alert.alert('Éxito', 'Evento actualizado correctamente');
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar el evento';
      Alert.alert('Error', message);
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
          Selecciona entre 1 y 2 imágenes para el evento. Debes subirlas antes de guardar.
        </Text>

        {/* Lista de imágenes seleccionadas */}
        {selectedImages.map((image, index) => (
          <View key={index} style={staticStyles.imagePreviewContainer}>
            <Image
              source={{ uri: image.uri }}
              style={staticStyles.imagePreview}
              resizeMode="cover"
            />
            
            <View style={staticStyles.imageActions}>
              {/* Estado de la imagen */}
              {image.uploaded ? (
                <View style={staticStyles.uploadedBadge}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
                    Subida
                  </Text>
                </View>
              ) : (
                <View style={staticStyles.uploadedBadge}>
                  <MaterialCommunityIcons name="cloud-upload-outline" size={16} color={theme.colors.error} />
                  <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                    Sin subir
                  </Text>
                </View>
              )}

              {/* Botón de subir (solo si no está subida) */}
              {!image.uploaded && (
                <ButtonApp
                  mode="contained"
                  icon="cloud-upload"
                  onPress={() => handleUploadImage(index)}
                  loading={uploadingImageIndex === index}
                  disabled={uploadingImageIndex !== null}
                  compact
                  style={{ flex: 1 }}
                >
                  Subir
                </ButtonApp>
              )}

              {/* Botón de eliminar */}
              <IconButton
                icon="delete"
                iconColor={theme.colors.error}
                size={20}
                onPress={() => handleRemoveImage(index)}
                disabled={uploadingImageIndex !== null}
              />
            </View>
          </View>
        ))}

        {/* Botón para agregar más imágenes */}
        {selectedImages.length < 2 && (
          <ButtonApp
            mode="outlined"
            icon="image-plus"
            onPress={handlePickImage}
            disabled={uploadingImageIndex !== null || isSaving}
            style={{ marginTop: 8 }}
          >
            Seleccionar imagen
          </ButtonApp>
        )}

        {/* Mostrar errores relacionados con imágenes */}
        {(errors as any).imageFileNames?.message && (
          <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 4 }}>
            {(errors as any).imageFileNames.message}
          </Text>
        )}
      </View>

      <View style={staticStyles.buttonContainer}>
        <ButtonApp
          mode="contained"
          icon={isCreating ? "plus" : "content-save"}
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={isSaving}
          style={staticStyles.button}
          buttonColor={themed.buttonContained.backgroundColor}
          textColor={themed.buttonContained.textColor}
          accessibilityLabel={isCreating ? "Crear nuevo evento" : "Guardar cambios del evento"}
          accessibilityHint={isCreating ? "Crea un nuevo evento con los datos ingresados" : "Guarda las modificaciones realizadas al evento"}
        >
          {isCreating ? 'Crear evento' : 'Guardar cambios'}
        </ButtonApp>

        {onCancel && (
          <ButtonApp 
            mode="outlined" 
            icon="close" 
            onPress={onCancel} 
            disabled={isSaving} 
            style={[staticStyles.button, { borderColor: themed.cancelButton.borderColor }]}
            textColor={themed.cancelButton.textColor}
            accessibilityLabel="Cancelar edición"
            accessibilityHint="Descarta los cambios y regresa a la pantalla anterior"
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
  imagePreviewContainer: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 8,
    backgroundColor: '#fafafa',
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
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
  buttonContained: {
    backgroundColor: theme.colors.secondary,
    textColor: theme.colors.onPrimary,
  },
  cancelButton: {
    borderColor: theme.colors.error,
    textColor: theme.colors.error,
  },
});
