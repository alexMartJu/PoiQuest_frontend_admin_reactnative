import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, Dimensions } from 'react-native';
import { Text, IconButton, Portal, Modal, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputApp, ButtonApp } from '@/components/common';
import { PoiMapPicker } from '@/components/pois/PoiMap';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import { createPoiSchema, updatePoiSchema, CreatePoiFormValues, UpdatePoiFormValues } from '@/schemas/poi.schema';
import { PointOfInterest } from '@/types/PointOfInterest';
import { useCreatePoiMutation, useUpdatePoiMutation } from '@/hooks/queries/pois';
import { useEventDetailQuery } from '@/hooks/queries/events';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { router } from 'expo-router';
import { pickImageFromLibrary } from '@/utils/pickImage';
import { uploadImage } from '@/services/file.service';

interface PoiFormProps {
  poi?: PointOfInterest | null;
  eventUuid?: string;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SelectedImage {
  uri: string;
  fileName?: string;
  uploaded: boolean;
}

export function PoiForm({ poi, eventUuid, isCreating = false, onSuccess, onCancel }: PoiFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoiFormStyles(theme), [theme]);

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [selectedCoordX, setSelectedCoordX] = useState<number | null>(poi?.coordX ?? null);
  const [selectedCoordY, setSelectedCoordY] = useState<number | null>(poi?.coordY ?? null);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const createMutation = useCreatePoiMutation();
  const updateMutation = useUpdatePoiMutation();
  const showSnackbar = useSnackbarStore((state) => state.show);

  // Obtener el nombre del evento cuando se está creando
  const { data: eventDetail, isLoading: isLoadingEvent } = useEventDetailQuery(eventUuid, isCreating && !!eventUuid);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const schema = isCreating ? createPoiSchema : updatePoiSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreatePoiFormValues | UpdatePoiFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isCreating
      ? {
          eventUuid: eventUuid || '',
          title: '',
          author: '',
          description: '',
          qrCode: '',
          nfcTag: '',
          coordX: null,
          coordY: null,
          imageFileNames: [],
        }
      : {
          title: poi?.title || '',
          author: poi?.author || '',
          description: poi?.description || '',
          qrCode: poi?.qrCode || '',
          nfcTag: poi?.nfcTag || '',
          coordX: poi?.coordX ?? null,
          coordY: poi?.coordY ?? null,
          imageFileNames: poi?.images?.map(img => img.fileName) || [],
        },
  });

  useEffect(() => {
    if (poi && !isCreating) {
      reset({
        title: poi.title,
        author: poi.author || '',
        description: poi.description || '',
        qrCode: poi.qrCode,
        nfcTag: poi.nfcTag || '',
        coordX: poi.coordX ?? null,
        coordY: poi.coordY ?? null,
        imageFileNames: poi.images?.map(img => img.fileName) || [],
      });

      setSelectedCoordX(poi.coordX ?? null);
      setSelectedCoordY(poi.coordY ?? null);

      if (poi.images && poi.images.length > 0) {
        setSelectedImages(
          poi.images.map(img => ({
            uri: img.url,
            fileName: img.fileName,
            uploaded: true,
          }))
        );
      }
    }
  }, [poi, isCreating, reset]);

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setSelectedCoordX(latitude);
    setSelectedCoordY(longitude);
    setValue('coordX' as any, latitude);
    setValue('coordY' as any, longitude);
  };

  const handlePickImage = async () => {
    try {
      if (selectedImages.length >= 2) {
        showSnackbar({ message: 'Solo puedes seleccionar un máximo de 2 imágenes', variant: 'warning' });
        return;
      }
      const asset = await pickImageFromLibrary();
      if (!asset) return;
      setSelectedImages(prev => [...prev, {
        uri: asset.uri,
        uploaded: false,
      }]);
    } catch (error: any) {
      showSnackbar({ message: error?.message || 'No se pudo seleccionar la imagen', variant: 'error' });
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => {
      const next = prev.filter((_, i) => i !== index);
      const uploadedNames = next.filter((i) => i.fileName).map((i) => i.fileName!);
      setValue('imageFileNames' as any, uploadedNames);
      return next;
    });
  };

  const handleUploadImage = async (index: number) => {
    const image = selectedImages[index];
    if (!image || image.uploaded) return;
    try {
      setUploadingImageIndex(index);
      const response = await uploadImage(image.uri);
      setSelectedImages(prev => {
        const next = prev.map((img, i) =>
          i === index
            ? { ...img, fileName: response.fileName, uploaded: true }
            : img
        );
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

  const onSubmit = async (data: CreatePoiFormValues | UpdatePoiFormValues) => {
    try {
      if (selectedImages.length === 0) {
        showSnackbar({ message: 'Debes seleccionar al menos 1 imagen', variant: 'error' });
        return;
      }
      const hasUnuploadedImages = selectedImages.some(img => !img.uploaded);
      if (hasUnuploadedImages) {
        showSnackbar({ message: 'Debes subir todas las imágenes antes de guardar', variant: 'error' });
        return;
      }
      const imageFileNames = selectedImages
        .filter(img => img.fileName)
        .map(img => img.fileName!);

      const payload = {
        ...data,
        coordX: selectedCoordX,
        coordY: selectedCoordY,
        imageFileNames,
      };

      if (isCreating) {
        await createMutation.mutateAsync(payload as CreatePoiFormValues);
        showSnackbar({ message: 'Punto de interés creado correctamente', variant: 'success' });
        router.back();
      } else {
        if (!poi) {
          throw new Error('No hay POI para actualizar');
        }
        await updateMutation.mutateAsync({
          uuid: poi.uuid,
          data: payload as UpdatePoiFormValues,
        });
        showSnackbar({ message: 'Punto de interés actualizado correctamente', variant: 'success' });
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar el punto de interés';
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
        {isCreating && (
          <Controller
            control={control}
            name="eventUuid"
            render={({ field: { value } }) => (
              <TextInputApp
                label="Evento *"
                value={isLoadingEvent ? 'Cargando evento...' : (eventDetail?.name || (value as string) || '')}
                editable={false}
                disabled
                errorText={(errors as any).eventUuid?.message}
                left={<TextInput.Icon icon="calendar-star" color={theme.colors.secondary} forceTextInputFocus={false} />}
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Título *"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.title?.message}
              maxLength={255}
            />
          )}
        />
        <Controller
          control={control}
          name="author"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Autor"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.author?.message}
              maxLength={255}
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

      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Identificación
        </Text>
        <Controller
          control={control}
          name="qrCode"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Código QR *"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.qrCode?.message}
              maxLength={255}
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="nfcTag"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Tag NFC"
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={errors.nfcTag?.message}
              maxLength={255}
              autoCapitalize="none"
            />
          )}
        />
      </View>

      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Ubicación
        </Text>
        <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
          {selectedCoordX !== null && selectedCoordY !== null
            ? `Coordenadas: ${selectedCoordX.toFixed(6)}, ${selectedCoordY.toFixed(6)}`
            : 'Pulsa el botón para seleccionar la ubicación en el mapa'}
        </Text>
        {selectedCoordX !== null && selectedCoordY !== null && (
          <View style={staticStyles.coordChip}>
            <MaterialCommunityIcons name="crosshairs-gps" size={16} color={theme.colors.primary} />
            <Text variant="bodySmall" style={{ color: theme.colors.primary }}>
              {selectedCoordX.toFixed(6)}, {selectedCoordY.toFixed(6)}
            </Text>
          </View>
        )}
        <ButtonApp
          mode="outlined"
          icon="map-marker-plus"
          onPress={() => setMapModalVisible(true)}
          style={{ marginTop: 4 }}
        >
          {selectedCoordX !== null ? 'Cambiar ubicación' : 'Seleccionar ubicación'}
        </ButtonApp>
      </View>

      {/* Modal del mapa */}
      <Portal>
        <Modal
          visible={mapModalVisible}
          onDismiss={() => setMapModalVisible(false)}
          contentContainerStyle={[staticStyles.mapModal, themed.mapModal]}
        >
          <View style={staticStyles.mapModalHeader}>
            <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle, { marginBottom: 0 }]}>
              Seleccionar ubicación
            </Text>
            <IconButton
              icon="close"
              size={22}
              onPress={() => setMapModalVisible(false)}
              iconColor={theme.colors.onSurface}
            />
          </View>
          <View style={staticStyles.mapModalBody}>
            <PoiMapPicker
              coordX={selectedCoordX}
              coordY={selectedCoordY}
              onLocationSelect={handleLocationSelect}
              style={{ flex: 1, height: '100%', borderRadius: 0 }}
            />
          </View>
          <View style={staticStyles.mapModalFooter}>
            {selectedCoordX !== null && selectedCoordY !== null && (
              <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText, { marginBottom: 0, flex: 1 }]}>
                {selectedCoordX.toFixed(6)}, {selectedCoordY.toFixed(6)}
              </Text>
            )}
            <ButtonApp
              mode="contained"
              icon="check"
              onPress={() => setMapModalVisible(false)}
              buttonColor={theme.colors.secondary}
              textColor={theme.colors.onPrimary}
            >
              Confirmar
            </ButtonApp>
          </View>
        </Modal>
      </Portal>

      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Imágenes
        </Text>
        <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
          Selecciona entre 1 y 2 imágenes para el POI. Debes subirlas antes de guardar.
        </Text>
        {selectedImages.map((image, index) => (
          <View key={index} style={staticStyles.imagePreviewContainer}>
            <Image
              source={{ uri: image.uri }}
              style={staticStyles.imagePreview}
              resizeMode="cover"
            />
            <View style={staticStyles.imageActions}>
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
          accessibilityLabel={isCreating ? "Crear nuevo punto de interés" : "Guardar cambios del punto de interés"}
          accessibilityHint={isCreating ? "Crea un nuevo punto de interés con los datos ingresados" : "Guarda las modificaciones realizadas al punto de interés"}
        >
          {isCreating ? 'Crear POI' : 'Guardar cambios'}
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
  coordChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  mapModal: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: Dimensions.get('window').height * 0.85,
  },
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 4,
    paddingTop: 8,
    paddingBottom: 4,
  },
  mapModalBody: {
    flex: 1,
  },
  mapModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
});

const getPoiFormStyles = (theme: AppTheme) => ({
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
  mapModal: {
    backgroundColor: theme.colors.surface,
  },
});
