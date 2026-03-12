import React, { useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useRouteDetail } from '@/hooks/routes/useRouteDetail';
import { RouteMap } from '@/components/routes';
import { CommonDialogApp } from '@/components/common';
import {
  routeDetailStaticStyles,
  getRouteDetailStyles,
} from '@/styles/routes.styles';

export default function RouteDetailScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getRouteDetailStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();

  const {
    route,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDeleting,
    handleDeleteRoute,
  } = useRouteDetail();

  if (isLoading) {
    return (
      <View style={[routeDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando ruta...</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={[routeDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Ruta no encontrada</Text>
      </View>
    );
  }

  const sortedPois = [...route.pois].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <View style={themed.container}>
      {/* Header */}
      <View style={routeDetailStaticStyles.header}>
        <Pressable style={routeDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text
          variant="titleMedium"
          style={[routeDetailStaticStyles.title, themed.routeTitle]}
        >
          Detalle de la ruta
        </Text>
        <View style={routeDetailStaticStyles.headerActions}>
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() =>
              router.push(
                `/(protected)/(drawer)/routes/${eventUuid}/${route.uuid}/edit`,
              )
            }
            accessibilityLabel="Editar ruta"
          />
          <IconButton
            icon="delete-outline"
            size={22}
            iconColor={theme.colors.error}
            onPress={() => setConfirmVisible(true)}
            accessibilityLabel="Eliminar ruta"
            disabled={isDeleting}
          />
        </View>
      </View>

      <ScrollView
        style={routeDetailStaticStyles.scrollView}
        contentContainerStyle={routeDetailStaticStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Información básica */}
        <View style={[routeDetailStaticStyles.card, themed.card]}>
          <Text
            variant="headlineSmall"
            style={[routeDetailStaticStyles.routeTitle, themed.routeTitle]}
          >
            {route.name}
          </Text>

          <Divider style={{ marginVertical: 12 }} />

          {route.description ? (
            <View style={routeDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons
                name="text"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="bodyMedium"
                style={[routeDetailStaticStyles.infoText, themed.infoText]}
              >
                {route.description}
              </Text>
            </View>
          ) : null}

          <View style={routeDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons
              name="map-marker-multiple-outline"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="bodyMedium"
              style={[routeDetailStaticStyles.infoText, themed.infoText]}
            >
              {route.pois.length}{' '}
              {route.pois.length === 1 ? 'punto de interés' : 'puntos de interés'}
            </Text>
          </View>
        </View>

        {/* Mapa de la ruta */}
        <View style={routeDetailStaticStyles.mapSection}>
          <Text
            variant="titleMedium"
            style={[routeDetailStaticStyles.mapSectionTitle, themed.mapSectionTitle]}
          >
            Recorrido en mapa
          </Text>
          <RouteMap pois={route.pois} />
        </View>

        {/* Listado de POIs en orden */}
        {sortedPois.length > 0 && (
          <View style={[routeDetailStaticStyles.card, themed.card]}>
            <Text
              variant="titleMedium"
              style={[routeDetailStaticStyles.sectionTitle, themed.sectionTitle]}
            >
              Puntos de interés en orden
            </Text>
            {sortedPois.map((rp, index) => (
              <View
                key={rp.poi.uuid}
                style={[
                  routeDetailStaticStyles.poiOrderItem,
                  themed.poiOrderItem,
                  index === sortedPois.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[routeDetailStaticStyles.poiOrderBadge, themed.poiOrderBadge]}>
                  <Text variant="labelMedium" style={themed.poiOrderBadgeText}>
                    {rp.sortOrder}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    variant="bodyMedium"
                    style={[routeDetailStaticStyles.infoText, themed.infoText]}
                    numberOfLines={1}
                  >
                    {rp.poi.title}
                  </Text>
                  {rp.poi.author ? (
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {rp.poi.author}
                    </Text>
                  ) : null}
                </View>
                {rp.poi.coordX !== null && rp.poi.coordY !== null ? (
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={18}
                    color={theme.colors.primary}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="map-marker-off-outline"
                    size={18}
                    color={theme.colors.onSurfaceVariant}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Diálogo de confirmación de eliminación */}
      <CommonDialogApp
        visible={confirmVisible}
        title="Eliminar ruta"
        message={
          <Text>
            ¿Seguro que deseas eliminar la ruta{' '}
            <Text style={{ fontWeight: '700' }}>{route.name}</Text>? Esta acción no
            se puede deshacer.
          </Text>
        }
        cancelText="Cancelar"
        confirmText="Eliminar"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDeleteRoute}
        cancelDisabled={isDeleting}
        confirmLoading={isDeleting}
      />
    </View>
  );
}
