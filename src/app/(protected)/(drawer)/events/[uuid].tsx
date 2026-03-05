import React, { useMemo } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Text, IconButton, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useEventDetail } from '@/hooks/events/useEventDetail';
import { CommonDialogApp } from '@/components/common';
import { eventDetailStaticStyles, getEventDetailStyles } from '@/styles/events.styles';

export default function EventDetailScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventDetailStyles(theme), [theme]);
  const router = useRouter();
  const {
    event,
    isLoading,
    confirmVisible,
    setConfirmVisible,
    isDeleting,
    handleDeleteEvent,
  } = useEventDetail();

  if (isLoading) {
    return (
      <View style={[eventDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[eventDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Evento no encontrado</Text>
      </View>
    );
  }

  // Mostrar detalles del evento
  return (
    <View style={themed.container}>
      <View style={eventDetailStaticStyles.header}>
        <Pressable style={eventDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[eventDetailStaticStyles.title, themed.eventName]}> 
          Detalle del evento
        </Text>
        <View style={eventDetailStaticStyles.headerActions}>
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() => router.push(`/(protected)/(drawer)/events/${event.uuid}/edit`)}
            accessibilityLabel="Editar evento"
          />
          <IconButton
            icon="delete-outline"
            size={22}
            iconColor={theme.colors.error}
            onPress={() => setConfirmVisible(true)}
            accessibilityLabel="Eliminar evento"
            disabled={isDeleting}
          />
        </View>
      </View>

      <ScrollView
        style={eventDetailStaticStyles.scrollView}
        contentContainerStyle={eventDetailStaticStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Imagen principal */}
        {event.images && event.images.length > 0 && (
          <Image
            source={{ uri: event.images.find(img => img.isPrimary)?.url || event.images[0]?.url }}
            style={eventDetailStaticStyles.mainImage}
            resizeMode="cover"
          />
        )}

        {/* Información básica */}
        <View style={[eventDetailStaticStyles.card, themed.card]}>
          <Text variant="headlineSmall" style={[eventDetailStaticStyles.eventName, themed.eventName]}> 
            {event.name}
          </Text>

          {event.category && (
            <Chip
              icon="tag-outline"
              mode="outlined"
              style={eventDetailStaticStyles.categoryChip}
              textStyle={{ color: theme.colors.primary }}
            >
              {event.category.name}
            </Chip>
          )}

          <Divider style={{ marginVertical: 12 }} />

          {event.description && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="text" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                {event.description}
              </Text>
            </View>
          )}

          {event.city && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="city" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                {event.city.name}, {event.city.country}
              </Text>
            </View>
          )}

          {event.organizer && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="handshake" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                Organizador: {event.organizer.name}
              </Text>
            </View>
          )}

          {event.sponsor && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="star-circle" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                Patrocinador: {event.sponsor.name}
              </Text>
            </View>
          )}

          <View style={eventDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons
              name={event.isPremium ? 'star-circle' : 'ticket-outline'}
              size={20}
              color={event.isPremium ? theme.colors.secondary : theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
              {event.isPremium ? 'Evento premium' : 'Gratuito'}
            </Text>
          </View>

          {event.isPremium && event.price != null && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="currency-eur" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                Precio: {event.price} €
              </Text>
            </View>
          )}

          {event.capacityPerDay != null && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="account-multiple" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                Capacidad diaria: {event.capacityPerDay} personas
              </Text>
            </View>
          )}

          <View style={eventDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons name="calendar-start" size={20} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
              Inicio: {event.startDate}
            </Text>
          </View>

          {event.endDate && (
            <View style={eventDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="calendar-end" size={20} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
                Fin: {event.endDate}
              </Text>
            </View>
          )}

          <View style={eventDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons
              name={event.status === 'active' ? 'check-circle' : 'clock-outline'}
              size={20}
              color={event.status === 'active' ? theme.colors.primary : theme.colors.onSurfaceVariant}
            />
            <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}> 
              Estado: {event.status === 'active' ? 'Activo' : 'Finalizado'}
            </Text>
          </View>
        </View>

        {/* Galería de imágenes */}
        {event.images && event.images.length > 1 && (
          <View style={[eventDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={[eventDetailStaticStyles.sectionTitle, themed.sectionTitle]}> 
              Galería
            </Text>
            <View style={eventDetailStaticStyles.galleryContainer}>
              {event.images.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.url }}
                  style={[eventDetailStaticStyles.galleryImage, themed.galleryImage]}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>
        )}

        {/* Puntos de interés */}
        {event.pointsOfInterest && event.pointsOfInterest.length > 0 && (
          <View style={[eventDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={[eventDetailStaticStyles.sectionTitle, themed.sectionTitle]}> 
              Puntos de interés ({event.pointsOfInterest.length})
            </Text>
            {event.pointsOfInterest.map((poi) => (
              <View key={poi.uuid} style={eventDetailStaticStyles.poiItem}>
                <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.primary} />
                <Text variant="bodyMedium" style={[eventDetailStaticStyles.infoText, themed.infoText]}>
                  {poi.title}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Diálogo de confirmación de eliminación */}
      <CommonDialogApp
        visible={confirmVisible}
        title="Eliminar evento"
        message={
          <Text>
            ¿Seguro que deseas eliminar el evento{' '}
            <Text style={{ fontWeight: '700' }}>{event.name}</Text>? Esta acción no se puede deshacer.
          </Text>
        }
        cancelText="Cancelar"
        confirmText="Eliminar"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDeleteEvent}
        cancelDisabled={isDeleting}
        confirmLoading={isDeleting}
      />
    </View>
  );
}