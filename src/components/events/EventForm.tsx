import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { Text, IconButton, Portal, Modal, TextInput, Switch } from 'react-native-paper';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputApp, ButtonApp, DatePickerApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import { createEventSchema, updateEventSchema, CreateEventFormValues, UpdateEventFormValues } from '@/schemas/event.schema';
import { Event } from '@/types/Event';
import { useCreateEventMutation, useUpdateEventMutation, useEventCategoriesQuery } from '@/hooks/queries/events';
import { useAllActiveCitiesQuery, useAllActiveOrganizersQuery, useAllActiveSponsorsQuery } from '@/hooks/queries/partners';
import { useSnackbarStore } from '@/stores/snackbar.store';
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
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [organizerModalVisible, setOrganizerModalVisible] = useState(false);
  const [sponsorModalVisible, setSponsorModalVisible] = useState(false);

  // Obtener categorías de eventos
  const { data: categories = [], isLoading: isLoadingCategories } = useEventCategoriesQuery();
  // Obtener partners activos para pickers
  const { data: cities = [] } = useAllActiveCitiesQuery();
  const { data: organizers = [] } = useAllActiveOrganizersQuery();
  const { data: sponsors = [] } = useAllActiveSponsorsQuery();

  const createMutation = useCreateEventMutation();
  const updateMutation = useUpdateEventMutation();
  const showSnackbar = useSnackbarStore((state) => state.show);

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
          cityUuid: '',
          organizerUuid: '',
          sponsorUuid: '',
          isPremium: false,
          price: null,
          capacityPerDay: null,
          startDate: '',
          endDate: '',
          imageFileNames: [],
        }
      : {
          name: event?.name || '',
          description: event?.description || '',
          categoryUuid: event?.category?.uuid || '',
          cityUuid: event?.city?.uuid || '',
          organizerUuid: event?.organizer?.uuid || '',
          sponsorUuid: event?.sponsor?.uuid || '',
          isPremium: event?.isPremium ?? false,
          price: event?.price ?? null,
          capacityPerDay: event?.capacityPerDay ?? null,
          startDate: event?.startDate || '',
          endDate: event?.endDate || '',
          imageFileNames: event?.images?.map(img => img.fileName) || [],
        },
  });

  // Escuchar el valor de isPremium para mostrar/ocultar el campo price
  const isPremiumValue = useWatch({ control, name: 'isPremium' as any }) as boolean;

  // Actualizar el formulario cuando cambie el evento
  useEffect(() => {
    if (event && !isCreating) {
      reset({
        name: event.name,
        description: event.description || '',
        categoryUuid: event.category?.uuid || '',
        cityUuid: event.city?.uuid || '',
        organizerUuid: event.organizer?.uuid || '',
        sponsorUuid: event.sponsor?.uuid || '',
        isPremium: event.isPremium ?? false,
        price: event.price ?? null,
        capacityPerDay: event.capacityPerDay ?? null,
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
        showSnackbar({ message: 'Solo puedes seleccionar un máximo de 2 imágenes', variant: 'warning' });
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
      showSnackbar({ message: error?.message || 'No se pudo seleccionar la imagen', variant: 'error' });
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

      showSnackbar({ message: 'Imagen subida correctamente', variant: 'success' });
    } catch (error: any) {
      showSnackbar({ message: error?.message || 'No se pudo subir la imagen', variant: 'error' });
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const onSubmit = async (data: CreateEventFormValues | UpdateEventFormValues) => {
    try {
      // Validar que al menos haya una imagen
      if (selectedImages.length === 0) {
        showSnackbar({ message: 'Debes seleccionar al menos 1 imagen', variant: 'error' });
        return;
      }

      // Validar que todas las imágenes estén subidas
      const hasUnuploadedImages = selectedImages.some(img => !img.uploaded);
      if (hasUnuploadedImages) {
        showSnackbar({ message: 'Debes subir todas las imágenes antes de guardar', variant: 'error' });
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
        showSnackbar({ message: 'Evento creado correctamente', variant: 'success' });
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
        showSnackbar({ message: 'Evento actualizado correctamente', variant: 'success' });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar el evento';
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
          render={({ field: { value, onChange } }) => {
            const selectedCategory = categories.find(c => c.uuid === value);
            return (
              <>
                <TextInputApp
                  label="Categoría *"
                  value={selectedCategory?.name || ''}
                  editable={false}
                  errorText={errors.categoryUuid?.message}
                  right={
                    <TextInput.Icon
                      icon="menu-down"
                      onPress={() => setCategoryModalVisible(true)}
                      color={theme.colors.secondary}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <Portal>
                  <Modal
                    visible={categoryModalVisible}
                    onDismiss={() => setCategoryModalVisible(false)}
                    contentContainerStyle={[staticStyles.categoryModal, { backgroundColor: theme.colors.surface }]}
                  >
                    <Text variant="titleMedium" style={[staticStyles.categoryModalTitle, themed.sectionTitle]}>
                      Seleccionar categoría
                    </Text>
                    {isLoadingCategories ? (
                      <ActivityIndicator style={{ padding: 24 }} color={theme.colors.primary} />
                    ) : categories.length === 0 ? (
                      <Text variant="bodyMedium" style={{ padding: 24, textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
                        No hay categorías disponibles
                      </Text>
                    ) : (
                      <FlatList
                        data={categories}
                        keyExtractor={(item) => item.uuid}
                        renderItem={({ item }) => (
                          <Pressable
                            onPress={() => {
                              onChange(item.uuid);
                              setCategoryModalVisible(false);
                            }}
                            style={({ pressed }) => [
                              staticStyles.categoryItem,
                              pressed && { backgroundColor: theme.colors.surfaceVariant },
                              value === item.uuid && { backgroundColor: theme.colors.secondaryContainer },
                            ]}
                          >
                            <Text
                              variant="bodyLarge"
                              style={value === item.uuid ? { color: theme.colors.secondary, fontWeight: 'bold' } : { color: theme.colors.onSurface }}
                            >
                              {item.name}
                            </Text>
                          </Pressable>
                        )}
                      />
                    )}
                  </Modal>
                </Portal>
              </>
            );
          }}
        />

        {/* Picker de ciudad */}
        <Controller
          control={control}
          name="cityUuid"
          render={({ field: { value, onChange } }) => {
            const selected = cities.find(c => c.uuid === value);
            return (
              <>
                <TextInputApp
                  label="Ciudad *"
                  value={selected ? `${selected.name}, ${selected.country}` : ''}
                  editable={false}
                  errorText={(errors as any).cityUuid?.message}
                  right={
                    <TextInput.Icon
                      icon="menu-down"
                      onPress={() => setCityModalVisible(true)}
                      color={theme.colors.secondary}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <Portal>
                  <Modal
                    visible={cityModalVisible}
                    onDismiss={() => setCityModalVisible(false)}
                    contentContainerStyle={[staticStyles.categoryModal, { backgroundColor: theme.colors.surface }]}
                  >
                    <Text variant="titleMedium" style={[staticStyles.categoryModalTitle, themed.sectionTitle]}>Seleccionar ciudad</Text>
                    <FlatList
                      data={cities}
                      keyExtractor={(item) => item.uuid}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => { onChange(item.uuid); setCityModalVisible(false); }}
                          style={[staticStyles.categoryItem, value === item.uuid && { backgroundColor: theme.colors.secondaryContainer }]}
                        >
                          <Text variant="bodyLarge" style={value === item.uuid ? { color: theme.colors.secondary, fontWeight: 'bold' } : { color: theme.colors.onSurface }}>
                            {item.name}, {item.country}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </Modal>
                </Portal>
              </>
            );
          }}
        />

        {/* Picker de organizador */}
        <Controller
          control={control}
          name="organizerUuid"
          render={({ field: { value, onChange } }) => {
            const selected = organizers.find(o => o.uuid === value);
            return (
              <>
                <TextInputApp
                  label="Organizador *"
                  value={selected?.name || ''}
                  editable={false}
                  errorText={(errors as any).organizerUuid?.message}
                  right={
                    <TextInput.Icon
                      icon="menu-down"
                      onPress={() => setOrganizerModalVisible(true)}
                      color={theme.colors.secondary}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <Portal>
                  <Modal
                    visible={organizerModalVisible}
                    onDismiss={() => setOrganizerModalVisible(false)}
                    contentContainerStyle={[staticStyles.categoryModal, { backgroundColor: theme.colors.surface }]}
                  >
                    <Text variant="titleMedium" style={[staticStyles.categoryModalTitle, themed.sectionTitle]}>Seleccionar organizador</Text>
                    <FlatList
                      data={organizers}
                      keyExtractor={(item) => item.uuid}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => { onChange(item.uuid); setOrganizerModalVisible(false); }}
                          style={[staticStyles.categoryItem, value === item.uuid && { backgroundColor: theme.colors.secondaryContainer }]}
                        >
                          <Text variant="bodyLarge" style={value === item.uuid ? { color: theme.colors.secondary, fontWeight: 'bold' } : { color: theme.colors.onSurface }}>
                            {item.name}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </Modal>
                </Portal>
              </>
            );
          }}
        />

        {/* Picker de patrocinador (opcional) */}
        <Controller
          control={control}
          name="sponsorUuid"
          render={({ field: { value, onChange } }) => {
            const selected = sponsors.find(s => s.uuid === value);
            return (
              <>
                <TextInputApp
                  label="Patrocinador (opcional)"
                  value={selected?.name || ''}
                  editable={false}
                  errorText={(errors as any).sponsorUuid?.message}
                  right={
                    <TextInput.Icon
                      icon={value ? 'close' : 'menu-down'}
                      onPress={() => value ? onChange('') : setSponsorModalVisible(true)}
                      color={theme.colors.secondary}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <Portal>
                  <Modal
                    visible={sponsorModalVisible}
                    onDismiss={() => setSponsorModalVisible(false)}
                    contentContainerStyle={[staticStyles.categoryModal, { backgroundColor: theme.colors.surface }]}
                  >
                    <Text variant="titleMedium" style={[staticStyles.categoryModalTitle, themed.sectionTitle]}>Seleccionar patrocinador</Text>
                    <FlatList
                      data={sponsors}
                      keyExtractor={(item) => item.uuid}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => { onChange(item.uuid); setSponsorModalVisible(false); }}
                          style={[staticStyles.categoryItem, value === item.uuid && { backgroundColor: theme.colors.secondaryContainer }]}
                        >
                          <Text variant="bodyLarge" style={value === item.uuid ? { color: theme.colors.secondary, fontWeight: 'bold' } : { color: theme.colors.onSurface }}>
                            {item.name}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </Modal>
                </Portal>
              </>
            );
          }}
        />

        {/* isPremium switch */}
        <Controller
          control={control}
          name="isPremium"
          render={({ field: { value, onChange } }) => (
            <View style={staticStyles.switchRow}>
              <MaterialCommunityIcons name="star-circle" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={{ flex: 1, color: theme.colors.onSurface, marginLeft: 8 }}>Evento premium</Text>
              <Switch value={!!value} onValueChange={onChange} />
            </View>
          )}
        />

        {/* price (solo si isPremium) */}
        {isPremiumValue && (
          <Controller
            control={control}
            name="price"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInputApp
                label="Precio (€) *"
                value={value != null ? String(value) : ''}
                onChangeText={(t) => onChange(t === '' ? null : parseFloat(t))}
                onBlur={onBlur}
                errorText={(errors as any).price?.message}
                keyboardType="decimal-pad"
              />
            )}
          />
        )}

        {/* capacityPerDay */}
        <Controller
          control={control}
          name="capacityPerDay"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Capacidad diaria (opcional)"
              value={value != null ? String(value) : ''}
              onChangeText={(t) => onChange(t === '' ? null : parseInt(t, 10))}
              onBlur={onBlur}
              errorText={(errors as any).capacityPerDay?.message}
              keyboardType="number-pad"
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
          render={({ field: { value, onChange } }) => (
            <DatePickerApp
              label="Fecha de inicio *"
              value={value || ''}
              onChange={onChange}
              errorText={errors.startDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field: { value, onChange } }) => (
            <DatePickerApp
              label="Fecha de fin"
              value={value || ''}
              onChange={onChange}
              errorText={errors.endDate?.message}
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
  categoryModal: {
    margin: 24,
    borderRadius: 12,
    maxHeight: '50%',
    overflow: 'hidden',
  },
  categoryModalTitle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  categoryItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 4,
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
