import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, ActivityIndicator, FlatList } from 'react-native';
import { Text, IconButton, Portal, Modal, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import {
  createOrganizerSchema,
  updateOrganizerSchema,
  CreateOrganizerFormValues,
  UpdateOrganizerFormValues,
} from '@/schemas/partner.schema';
import type { Organizer } from '@/types/Partner';
import { OrganizerType, ORGANIZER_TYPE_LABELS } from '@/types/Partner';
import { useCreateOrganizerMutation, useUpdateOrganizerMutation } from '@/hooks/queries/partners';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { router } from 'expo-router';
import { pickImageFromLibrary } from '@/utils/pickImage';
import { uploadImage } from '@/services/file.service';

interface OrganizerFormProps {
  organizer?: Organizer | null;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SelectedImage {
  uri: string;
  fileName?: string;
  uploaded: boolean;
}

const ORGANIZER_TYPE_OPTIONS = Object.values(OrganizerType).map((v) => ({
  value: v,
  label: ORGANIZER_TYPE_LABELS[v],
}));

export function OrganizerForm({ organizer, isCreating = false, onSuccess, onCancel }: OrganizerFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getOrganizerFormStyles(theme), [theme]);

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [typeModalVisible, setTypeModalVisible] = useState(false);

  const createMutation = useCreateOrganizerMutation();
  const updateMutation = useUpdateOrganizerMutation();
  const showSnackbar = useSnackbarStore((state) => state.show);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const schema = isCreating ? createOrganizerSchema : updateOrganizerSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateOrganizerFormValues | UpdateOrganizerFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isCreating
      ? {
          name: '',
          type: OrganizerType.COMPANY,
          contactEmail: '',
          contactPhone: '',
          description: '',
          imageFileNames: [],
        }
      : {
          name: organizer?.name || '',
          type: organizer?.type || OrganizerType.COMPANY,
          contactEmail: organizer?.contactEmail || '',
          contactPhone: organizer?.contactPhone || '',
          description: organizer?.description || '',
          imageFileNames: organizer?.images?.map((img) => img.fileName) || [],
        },
  });

  useEffect(() => {
    if (organizer && !isCreating) {
      reset({
        name: organizer.name,
        type: organizer.type,
        contactEmail: organizer.contactEmail,
        contactPhone: organizer.contactPhone || '',
        description: organizer.description || '',
        imageFileNames: organizer.images?.map((img) => img.fileName) || [],
      });
      if (organizer.images?.length) {
        setSelectedImages(
          organizer.images.map((img) => ({ uri: img.url, fileName: img.fileName, uploaded: true })),
        );
      }
    }
  }, [organizer, isCreating, reset]);

  const handlePickImage = async () => {
    try {
      if (selectedImages.length >= 2) {
        showSnackbar({ message: 'Solo puedes seleccionar un máximo de 2 imágenes', variant: 'warning' });
        return;
      }
      const asset = await pickImageFromLibrary();
      if (!asset) return;
      setSelectedImages((prev) => [...prev, { uri: asset.uri, uploaded: false }]);
    } catch (error: any) {
      showSnackbar({ message: error?.message || 'No se pudo seleccionar la imagen', variant: 'error' });
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setValue('imageFileNames' as any, next.filter((i) => i.fileName).map((i) => i.fileName!));
      return next;
    });
  };

  const handleUploadImage = async (index: number) => {
    const image = selectedImages[index];
    if (!image || image.uploaded) return;
    try {
      setUploadingImageIndex(index);
      const response = await uploadImage(image.uri);
      setSelectedImages((prev) => {
        const next = prev.map((img, i) =>
          i === index ? { ...img, fileName: response.fileName, uploaded: true } : img,
        );
        setValue('imageFileNames' as any, next.filter((i) => i.fileName).map((i) => i.fileName!));
        return next;
      });
      showSnackbar({ message: 'Imagen subida correctamente', variant: 'success' });
    } catch (error: any) {
      showSnackbar({ message: error?.message || 'No se pudo subir la imagen', variant: 'error' });
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const onSubmit = async (data: CreateOrganizerFormValues | UpdateOrganizerFormValues) => {
    try {
      if (isCreating && selectedImages.length === 0) {
        showSnackbar({ message: 'Debes seleccionar al menos 1 imagen', variant: 'error' });
        return;
      }
      if (selectedImages.some((img) => !img.uploaded)) {
        showSnackbar({ message: 'Debes subir todas las imágenes antes de guardar', variant: 'error' });
        return;
      }
      const imageFileNames = selectedImages.filter((img) => img.fileName).map((img) => img.fileName!);
      const payload = { ...data, imageFileNames } as any;

      if (isCreating) {
        const created = await createMutation.mutateAsync(payload as CreateOrganizerFormValues);
        showSnackbar({ message: 'Organizador creado correctamente', variant: 'success' });
        router.replace(`/(protected)/(drawer)/partners/organizers/${created.uuid}`);
      } else {
        if (!organizer) throw new Error('No hay organizador para actualizar');
        await updateMutation.mutateAsync({ uuid: organizer.uuid, data: payload as UpdateOrganizerFormValues });
        showSnackbar({ message: 'Organizador actualizado correctamente', variant: 'success' });
        onSuccess?.();
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar el organizador';
      showSnackbar({ message, variant: 'error' });
    }
  };

  return (
    <ScrollView
      style={[staticStyles.container, themed.container]}
      contentContainerStyle={staticStyles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Info básica */}
      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Información del organizador
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Nombre *" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.name?.message} maxLength={200} />
          )}
        />

        {/* Tipo de organizador — igual que selector de categoría en EventForm */}
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => {
            const selected = ORGANIZER_TYPE_OPTIONS.find((o) => o.value === value);
            return (
              <>
                <TextInputApp
                  label="Tipo de organizador *"
                  value={selected?.label || ''}
                  editable={false}
                  errorText={errors.type?.message}
                  right={
                    <TextInput.Icon
                      icon="menu-down"
                      onPress={() => setTypeModalVisible(true)}
                      color={theme.colors.secondary}
                      forceTextInputFocus={false}
                    />
                  }
                />
                <Portal>
                  <Modal
                    visible={typeModalVisible}
                    onDismiss={() => setTypeModalVisible(false)}
                    contentContainerStyle={[staticStyles.typeModal, { backgroundColor: theme.colors.surface }]}
                  >
                    <Text variant="titleMedium" style={[staticStyles.typeModalTitle, themed.sectionTitle]}>
                      Tipo de organizador
                    </Text>
                    <FlatList
                      data={ORGANIZER_TYPE_OPTIONS}
                      keyExtractor={(item) => item.value}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => { onChange(item.value); setTypeModalVisible(false); }}
                          style={({ pressed }) => [
                            staticStyles.typeItem,
                            pressed && { backgroundColor: theme.colors.surfaceVariant },
                            value === item.value && { backgroundColor: theme.colors.secondaryContainer },
                          ]}
                        >
                          <Text
                            variant="bodyLarge"
                            style={value === item.value ? { color: theme.colors.secondary, fontWeight: 'bold' } : { color: theme.colors.onSurface }}
                          >
                            {item.label}
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

        <Controller
          control={control}
          name="contactEmail"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Email de contacto *" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.contactEmail?.message} keyboardType="email-address" autoCapitalize="none" />
          )}
        />

        <Controller
          control={control}
          name="contactPhone"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Teléfono de contacto" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.contactPhone?.message} keyboardType="phone-pad" />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Descripción" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.description?.message} multiline numberOfLines={4} />
          )}
        />
      </View>

      {/* Imágenes — igual que EventForm */}
      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Imágenes
        </Text>

        <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
          Selecciona entre 1 y 2 imágenes para el organizador. Debes subirlas antes de guardar.
        </Text>

        {selectedImages.map((image, index) => (
          <View key={index} style={staticStyles.imagePreviewContainer}>
            <Image source={{ uri: image.uri }} style={staticStyles.imagePreview} resizeMode="cover" />
            <View style={staticStyles.imageActions}>
              {image.uploaded ? (
                <View style={staticStyles.uploadedBadge}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.primary} />
                  <Text variant="bodySmall" style={{ color: theme.colors.primary }}>Subida</Text>
                </View>
              ) : (
                <View style={staticStyles.uploadedBadge}>
                  <MaterialCommunityIcons name="cloud-upload-outline" size={16} color={theme.colors.error} />
                  <Text variant="bodySmall" style={{ color: theme.colors.error }}>Sin subir</Text>
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

        {/* Error de imágenes (zod) */}
        {(errors as any).imageFileNames?.message && (
          <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: 4 }}>
            {(errors as any).imageFileNames.message}
          </Text>
        )}
      </View>

      {/* Botones */}
      <View style={staticStyles.buttonContainer}>
        <ButtonApp
          mode="contained"
          icon={isCreating ? 'plus' : 'content-save'}
          onPress={handleSubmit(onSubmit)}
          loading={isSaving}
          disabled={isSaving}
          style={staticStyles.button}
          buttonColor={themed.buttonContained.backgroundColor}
          textColor={themed.buttonContained.textColor}
        >
          {isCreating ? 'Crear organizador' : 'Guardar cambios'}
        </ButtonApp>
        {onCancel && (
          <ButtonApp
            mode="outlined"
            icon="close"
            onPress={onCancel}
            disabled={isSaving}
            style={[staticStyles.button, { borderColor: themed.cancelButton.borderColor }]}
            textColor={themed.cancelButton.textColor}
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: { marginBottom: 12 },
  helperText: { marginBottom: 8 },
  buttonContainer: { gap: 12, marginTop: 8 },
  button: { width: '100%' },
  typeModal: {
    margin: 24,
    borderRadius: 12,
    maxHeight: '50%',
    overflow: 'hidden',
  },
  typeModalTitle: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  typeItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
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

const getOrganizerFormStyles = (theme: AppTheme) => ({
  container: { backgroundColor: theme.colors.background },
  card: { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant },
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.titleMedium.fontWeight as any,
  },
  helperText: { color: theme.colors.onSurfaceVariant },
  buttonContained: {
    backgroundColor: theme.colors.secondary,
    textColor: theme.colors.onPrimary,
  },
  cancelButton: {
    borderColor: theme.colors.error,
    textColor: theme.colors.error,
  },
});
