import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DraggableFlatList, {
  ShadowDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import { TextInputApp, ButtonApp } from '@/components/common';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import {
  createRouteSchema,
  updateRouteSchema,
  type CreateRouteFormValues,
  type UpdateRouteFormValues,
} from '@/schemas/route.schema';
import type { Route } from '@/types/Route';
import type { PointOfInterest } from '@/types/PointOfInterest';
import { useCreateRouteMutation, useUpdateRouteMutation } from '@/hooks/queries/routes';
import { usePoisByEventQuery } from '@/hooks/queries/pois';
import { useAdminEventDetailQuery } from '@/hooks/queries/events';
import { useSnackbarStore } from '@/stores/snackbar.store';

interface RouteFormProps {
  route?: Route | null;
  eventUuid?: string;
  isCreating?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface DraggablePoi {
  uuid: string;
  title: string;
  qrCode: string;
}

export function RouteForm({
  route,
  eventUuid,
  isCreating = false,
  onSuccess,
  onCancel,
}: RouteFormProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getRouteFormStyles(theme), [theme]);
  const showSnackbar = useSnackbarStore((state) => state.show);

  const createMutation = useCreateRouteMutation();
  const updateMutation = useUpdateRouteMutation();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const { data: availablePois, isLoading: isLoadingPois } = usePoisByEventQuery(
    eventUuid,
    !!eventUuid,
  );

  const { data: eventDetail, isLoading: isLoadingEvent } = useAdminEventDetailQuery(
    eventUuid,
    isCreating && !!eventUuid,
  );

  const [selectedPois, setSelectedPois] = useState<DraggablePoi[]>([]);

  const schema = isCreating ? createRouteSchema : updateRouteSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateRouteFormValues | UpdateRouteFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: isCreating
      ? {
          eventUuid: eventUuid || '',
          name: '',
          description: '',
          poiUuids: [],
        }
      : {
          name: route?.name || '',
          description: route?.description || '',
          poiUuids: route?.pois.map((rp) => rp.poi.uuid) || [],
        },
  });

  useEffect(() => {
    if (route && !isCreating) {
      const sorted = [...route.pois].sort((a, b) => a.sortOrder - b.sortOrder);
      reset({
        name: route.name,
        description: route.description || '',
        poiUuids: sorted.map((rp) => rp.poi.uuid),
      });
      setSelectedPois(
        sorted.map((rp) => ({
          uuid: rp.poi.uuid,
          title: rp.poi.title,
          qrCode: rp.poi.qrCode,
        })),
      );
    }
  }, [route, isCreating, reset]);

  const handleTogglePoi = (poi: PointOfInterest) => {
    setSelectedPois((prev) => {
      let next: DraggablePoi[];
      if (prev.some((p) => p.uuid === poi.uuid)) {
        next = prev.filter((p) => p.uuid !== poi.uuid);
      } else {
        next = [...prev, { uuid: poi.uuid, title: poi.title, qrCode: poi.qrCode }];
      }
      setValue('poiUuids' as keyof (CreateRouteFormValues | UpdateRouteFormValues), next.map((p) => p.uuid) as any);
      return next;
    });
  };

  const handleDragEnd = ({ data }: { data: DraggablePoi[] }) => {
    setSelectedPois(data);
    setValue('poiUuids' as keyof (CreateRouteFormValues | UpdateRouteFormValues), data.map((p) => p.uuid) as any);
  };

  const onSubmit = async (values: CreateRouteFormValues | UpdateRouteFormValues) => {
    try {
      if (isCreating) {
        const data = values as CreateRouteFormValues;
        await createMutation.mutateAsync(data);
        showSnackbar({ message: 'Ruta creada correctamente', variant: 'success' });
      } else {
        const data = values as UpdateRouteFormValues;
        await updateMutation.mutateAsync({ uuid: route!.uuid, data });
        showSnackbar({ message: 'Ruta actualizada correctamente', variant: 'success' });
      }
      onSuccess?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo guardar la ruta';
      showSnackbar({ message, variant: 'error' });
    }
  };

  const renderDraggableItem = ({
    item,
    drag,
    isActive,
    getIndex,
  }: RenderItemParams<DraggablePoi>) => {
    const index = getIndex() ?? 0;
    return (
      <ShadowDecorator>
        <View
          style={[
            staticStyles.draggableItem,
            themed.draggableItem,
            isActive && staticStyles.draggableItemActive,
            isActive && themed.draggableItemActive,
          ]}
        >
          <View style={[staticStyles.orderBadge, themed.orderBadge]}>
            <Text variant="labelMedium" style={themed.orderBadgeText}>
              {index + 1}
            </Text>
          </View>

          <View style={staticStyles.draggableContent}>
            <Text
              variant="bodyMedium"
              style={[staticStyles.draggableTitle, themed.draggableTitle]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text variant="bodySmall" style={themed.draggableSubtitle} numberOfLines={1}>
              QR: {item.qrCode}
            </Text>
          </View>

          <View style={staticStyles.dragActions}>
            <Pressable
              onPress={() =>
                handleTogglePoi({
                  uuid: item.uuid,
                  title: item.title,
                  qrCode: item.qrCode,
                } as PointOfInterest)
              }
              style={staticStyles.iconButton}
            >
              <MaterialCommunityIcons
                name="close-circle-outline"
                size={22}
                color={theme.colors.error}
              />
            </Pressable>
            <Pressable onLongPress={drag} delayLongPress={150} style={staticStyles.iconButton}>
              <MaterialCommunityIcons
                name="drag-horizontal-variant"
                size={26}
                color={isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
              />
            </Pressable>
          </View>
        </View>
      </ShadowDecorator>
    );
  };

  return (
    <ScrollView
      style={[staticStyles.container, themed.container]}
      contentContainerStyle={staticStyles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Información básica */}
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
                left={
                  <TextInput.Icon
                    icon="calendar-star"
                    color={theme.colors.secondary}
                    forceTextInputFocus={false}
                  />
                }
              />
            )}
          />
        )}

        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Nombre *"
              value={(value as string) || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={(errors as any).name?.message}
              maxLength={255}
              autoCapitalize="sentences"
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInputApp
              label="Descripción"
              value={(value as string | null | undefined) ?? ''}
              onChangeText={onChange}
              onBlur={onBlur}
              errorText={(errors as any).description?.message}
              multiline
              numberOfLines={3}
            />
          )}
        />
      </View>

      {/* Selección de POIs disponibles */}
      <View style={[staticStyles.card, themed.card]}>
        <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
          Puntos de interés disponibles
        </Text>
        <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
          Selecciona los puntos que formarán parte de la ruta
        </Text>

        {isLoadingPois ? (
          <Text variant="bodySmall" style={themed.helperText}>
            Cargando puntos de interés...
          </Text>
        ) : !availablePois || availablePois.length === 0 ? (
          <Text variant="bodySmall" style={themed.helperText}>
            No hay puntos de interés en este evento.
          </Text>
        ) : (
          availablePois.map((poi) => {
            const isSelected = selectedPois.some((p) => p.uuid === poi.uuid);
            return (
              <Pressable
                key={poi.uuid}
                style={[
                  staticStyles.poiOption,
                  themed.poiOption,
                  isSelected && [staticStyles.poiOptionSelected, themed.poiOptionSelected],
                ]}
                onPress={() => handleTogglePoi(poi)}
              >
                <MaterialCommunityIcons
                  name={isSelected ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                  size={22}
                  color={isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant}
                />
                <Text
                  variant="bodyMedium"
                  style={[staticStyles.poiOptionText, themed.poiOptionText]}
                  numberOfLines={1}
                >
                  {poi.title}
                </Text>
              </Pressable>
            );
          })
        )}

        {(errors as any).poiUuids && (
          <Text variant="bodySmall" style={[staticStyles.errorText, themed.errorText]}>
            {(errors as any).poiUuids.message}
          </Text>
        )}
      </View>

      {/* Orden de la ruta con DraggableFlatList */}
      {selectedPois.length > 0 && (
        <View style={[staticStyles.card, themed.card]}>
          <Text variant="titleMedium" style={[staticStyles.sectionTitle, themed.sectionTitle]}>
            Orden de la ruta ({selectedPois.length} puntos)
          </Text>
          <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
            Mantén pulsado{' '}
            <MaterialCommunityIcons
              name="drag-horizontal-variant"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />{' '}
            para arrastrar y reordenar
          </Text>

          <DraggableFlatList
            data={selectedPois}
            keyExtractor={(item) => item.uuid}
            renderItem={renderDraggableItem}
            onDragEnd={handleDragEnd}
            scrollEnabled={false}
            containerStyle={staticStyles.draggableList}
          />
        </View>
      )}

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
          accessibilityLabel={isCreating ? 'Crear nueva ruta' : 'Guardar cambios de la ruta'}
        >
          {isCreating ? 'Crear ruta' : 'Guardar cambios'}
        </ButtonApp>
        {onCancel && (
          <ButtonApp
            mode="outlined"
            icon="close"
            onPress={onCancel}
            disabled={isSaving}
            style={[staticStyles.button, { borderColor: themed.cancelButton.borderColor }]}
            textColor={themed.cancelButton.textColor}
            accessibilityLabel="Cancelar"
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
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 8,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  helperText: {
    marginBottom: 4,
  },
  errorText: {
    marginTop: 4,
  },
  poiOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
  },
  poiOptionSelected: {
    borderWidth: 1.5,
  },
  poiOptionText: {
    flex: 1,
  },
  draggableList: {
    marginTop: 8,
  },
  draggableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
  },
  draggableItemActive: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  orderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggableContent: {
    flex: 1,
    gap: 2,
  },
  draggableTitle: {
    fontWeight: '600',
  },
  dragActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 4,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  button: {
    width: '100%',
  },
});

function getRouteFormStyles(theme: AppTheme) {
  return {
    container: {
      backgroundColor: theme.colors.background,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    sectionTitle: {
      color: theme.colors.onSurface,
      fontWeight: theme.fonts.titleMedium.fontWeight as any,
    },
    helperText: {
      color: theme.colors.onSurfaceVariant,
    },
    errorText: {
      color: theme.colors.error,
    },
    poiOption: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outlineVariant,
    },
    poiOptionSelected: {
      backgroundColor: theme.colors.primaryContainer,
      borderColor: theme.colors.primary,
    },
    poiOptionText: {
      color: theme.colors.onSurface,
    },
    draggableItem: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outlineVariant,
    },
    draggableItemActive: {
      borderColor: theme.colors.primary,
    },
    orderBadge: {
      backgroundColor: theme.colors.primaryContainer,
    },
    orderBadgeText: {
      color: theme.colors.primary,
      fontWeight: '700' as const,
    },
    draggableTitle: {
      color: theme.colors.onSurface,
    },
    draggableSubtitle: {
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
  };
}
