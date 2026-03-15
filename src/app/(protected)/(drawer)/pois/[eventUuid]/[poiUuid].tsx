import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { usePoiDetail } from '@/hooks/pois/usePoiDetail';
import { PoiMapViewer, ARViewerModal, QRCodeModal } from '@/components/pois';
import { CommonDialogApp } from '@/components/common';
import { poiDetailStaticStyles, getPoiDetailStyles } from '@/styles/pois.styles';

export default function PoiDetailScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoiDetailStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();
  const [
    arModalVisible, setArModalVisible
  ] = useState(false);
  const [
    qrModalVisible, setQrModalVisible
  ] = useState(false);
  const {
    poi,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDeleting,
    handleDeletePoi,
  } = usePoiDetail();

  if (isLoading) {
    return (
      <View style={[poiDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando punto de interés...</Text>
      </View>
    );
  }

  if (!poi) {
    return (
      <View style={[poiDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Punto de interés no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      <View style={poiDetailStaticStyles.header}>
        <Pressable style={poiDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[poiDetailStaticStyles.title, themed.poiTitle]}>
          Detalle del POI
        </Text>
        <View style={poiDetailStaticStyles.headerActions}>
          <IconButton
            icon="cube-scan"
            size={22}
            iconColor={poi.modelUrl ? theme.colors.secondary : theme.colors.onSurfaceVariant}
            onPress={() => setArModalVisible(true)}
            accessibilityLabel="Ver modelo AR"
            disabled={!poi.modelUrl}
          />
          <IconButton
            icon="qrcode"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() => setQrModalVisible(true)}
            accessibilityLabel="Descargar código QR"
          />
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() => router.push(`/(protected)/(drawer)/pois/${eventUuid}/${poi.uuid}/edit`)}
            accessibilityLabel="Editar punto de interés"
          />
          <IconButton
            icon="delete-outline"
            size={22}
            iconColor={theme.colors.error}
            onPress={() => setConfirmVisible(true)}
            accessibilityLabel="Eliminar punto de interés"
            disabled={isDeleting}
          />
        </View>
      </View>

      <ScrollView
        style={poiDetailStaticStyles.scrollView}
        contentContainerStyle={poiDetailStaticStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen principal */}
        {poi.images && poi.images.length > 0 && (
          <Image
            source={{ uri: poi.images[0]?.url }}
            style={poiDetailStaticStyles.mainImage}
            resizeMode="cover"
          />
        )}

        {/* Información básica */}
        <View style={[poiDetailStaticStyles.card, themed.card]}>
          <Text variant="headlineSmall" style={[poiDetailStaticStyles.poiTitle, themed.poiTitle]}>
            {poi.title}
          </Text>

          <Divider style={{ marginVertical: 12 }} />

          {poi.author && (
            <View style={poiDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="account" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
                Autor: {poi.author}
              </Text>
            </View>
          )}

          {poi.description && (
            <View style={poiDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="text" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
                {poi.description}
              </Text>
            </View>
          )}

          <View style={poiDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons name="qrcode" size={20} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
              QR: {poi.qrCode}
            </Text>
          </View>

          {poi.coordX !== null && poi.coordY !== null && (
            <View style={poiDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
                Coordenadas: {poi.coordX.toFixed(6)}, {poi.coordY.toFixed(6)}
              </Text>
            </View>
          )}

          {poi.modelUrl && (
            <View style={poiDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="cube-outline" size={20} color={theme.colors.secondary} />
              <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, { color: theme.colors.secondary }]}>
                Modelo 3D disponible
              </Text>
            </View>
          )}
        </View>

        {/* Datos interesantes para AR */}
        {poi.interestingData && (
          <View style={[poiDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={[poiDetailStaticStyles.sectionTitle, themed.sectionTitle]}>
              Datos interesantes
            </Text>
            <View style={poiDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="star-shooting" size={20} color={theme.colors.secondary} />
              <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
                {poi.interestingData}
              </Text>
            </View>
          </View>
        )}

        {/* Mapa */}
        {poi.coordX !== null && poi.coordY !== null && (
          <View style={poiDetailStaticStyles.mapSection}>
            <Text variant="titleMedium" style={[poiDetailStaticStyles.sectionTitle, themed.sectionTitle]}>
              Ubicación en el mapa
            </Text>
            <PoiMapViewer coordX={poi.coordX} coordY={poi.coordY} />
          </View>
        )}

        {/* Galería de imágenes */}
        {poi.images && poi.images.length > 1 && (
          <View style={[poiDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={[poiDetailStaticStyles.sectionTitle, themed.sectionTitle]}>
              Galería
            </Text>
            <View style={poiDetailStaticStyles.galleryContainer}>
              {poi.images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.url }}
                  style={[poiDetailStaticStyles.galleryImage, themed.galleryImage]}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>
        )}

        {/* Evento asociado */}
        {poi.event && (
          <View style={[poiDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={[poiDetailStaticStyles.sectionTitle, themed.sectionTitle]}>
              Evento asociado
            </Text>
            <View style={poiDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="calendar-star" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
                {poi.event.name}
              </Text>
            </View>
            {poi.event.location && (
              <View style={poiDetailStaticStyles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.onSurfaceVariant} />
                <Text variant="bodyMedium" style={[poiDetailStaticStyles.infoText, themed.infoText]}>
                  {poi.event.location}
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Diálogo de confirmación de eliminación */}
      <CommonDialogApp
        visible={confirmVisible}
        title="Eliminar punto de interés"
        message={
          <Text>
            ¿Seguro que deseas eliminar el punto de interés{' '}
            <Text style={{ fontWeight: '700' }}>{poi.title}</Text>? Esta acción no se puede deshacer.
          </Text>
        }
        cancelText="Cancelar"
        confirmText="Eliminar"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDeletePoi}
        cancelDisabled={isDeleting}
        confirmLoading={isDeleting}
      />

      {/* Modal AR */}
      {poi.modelUrl && (
        <ARViewerModal
          visible={arModalVisible}
          modelUrl={poi.modelUrl}
          title={poi.title}
          onDismiss={() => setArModalVisible(false)}
        />
      )}

      {/* Modal QR */}
      <QRCodeModal
        visible={qrModalVisible}
        qrCode={poi.qrCode}
        poiTitle={poi.title}
        onDismiss={() => setQrModalVisible(false)}
      />
    </View>
  );
}
