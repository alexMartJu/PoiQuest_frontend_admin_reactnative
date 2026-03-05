import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import {
  createSponsorSchema,
  updateSponsorSchema,
  CreateSponsorFormValues,
  UpdateSponsorFormValues,
} from '@/schemas/partner.schema';
import type { Sponsor } from '@/types/Partner';
import { useCreateSponsorMutation, useUpdateSponsorMutation } from '@/hooks/queries/partners';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { router } from 'expo-router';
import { pickImageFromLibrary } from '@/utils/pickImage';
import { uploadImage } from '@/services/file.service';

interface SponsorFormProps {
  sponsor?: Sponsor | null;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SelectedImage {
  uri: string;
  fileName?: string;
  uploaded: boolean;
}

export function SponsorForm({ sponsor, isCreating = false, onSuccess, onCancel }: SponsorFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getSponsorFormStyles(theme), [theme]);

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);

  const createMutation = useCreateSponsorMutation();
  const updateMutation = useUpdateSponsorMutation();
  const showSnackbar = useSnackbarStore((state) => state.show);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const schema = isCreating ? createSponsorSchema : updateSponsorSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateSponsorFormValues | UpdateSponsorFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isCreating
      ? { name: '', websiteUrl: '', contactEmail: '', description: '', imageFileNames: [] }
      : {
          name: sponsor?.name || '',
          websiteUrl: sponsor?.websiteUrl || '',
          contactEmail: sponsor?.contactEmail || '',
          description: sponsor?.description || '',
          imageFileNames: sponsor?.images?.map((img) => img.fileName) || [],
        },
  });

  useEffect(() => {
    if (sponsor && !isCreating) {
      reset({
        name: sponsor.name,
        websiteUrl: sponsor.websiteUrl || '',
        contactEmail: sponsor.contactEmail || '',
        description: sponsor.description || '',
        imageFileNames: sponsor.images?.map((img) => img.fileName) || [],
      });
      if (sponsor.images?.length) {
        setSelectedImages(
          sponsor.images.map((img) => ({ uri: img.url, fileName: img.fileName, uploaded: true })),
        );
      }
    }
  }, [sponsor, isCreating, reset]);

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

  const onSubmit = async (data: CreateSponsorFormValues | UpdateSponsorFormValues) => {
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
        const created = await createMutation.mutateAsync(payload as CreateSponsorFormValues);
        showSnackbar({ message: 'Patrocinador creado correctamente', variant: 'success' });
        router.replace(`/(protected)/(drawer)/partners/sponsors/${created.uuid}`);
      } else {
        if (!sponsor) throw new Error('No hay patrocinador para actualizar');
        await updateMutation.mutateAsync({ uuid: sponsor.uuid, data: payload as UpdateSponsorFormValues });
        showSnackbar({ message: 'Patrocinador actualizado correctamente', variant: 'success' });
        onSuccess?.();
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'No se pudo guardar el patrocinador';
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
          Información del patrocinador
        </Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Nombre *" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.name?.message} maxLength={200} />
          )}
        />

        <Controller
          control={control}
          name="websiteUrl"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Sitio web" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.websiteUrl?.message} keyboardType="url" autoCapitalize="none" />
          )}
        />

        <Controller
          control={control}
          name="contactEmail"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp label="Email de contacto" value={value || ''} onChangeText={onChange} onBlur={onBlur} errorText={errors.contactEmail?.message} keyboardType="email-address" autoCapitalize="none" />
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

      {/* Imágenes */}
      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Imágenes
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 12 }}>
          Selecciona entre 1 y 2 imágenes y súbelas una a una.
        </Text>

        {selectedImages.map((img, index) => (
          <View key={index} style={staticStyles.imagePreviewContainer}>
            <Image source={{ uri: img.uri }} style={staticStyles.imagePreview} resizeMode="cover" />
            <View style={staticStyles.imageActions}>
              {img.uploaded ? (
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
              {!img.uploaded && (
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

      {/* Botones de acción */}
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
          {isCreating ? 'Crear patrocinador' : 'Guardar cambios'}
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

const getSponsorFormStyles = (theme: AppTheme) => ({
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
