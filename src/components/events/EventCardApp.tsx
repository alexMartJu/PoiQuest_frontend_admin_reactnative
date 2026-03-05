import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { Event } from '@/types/Event';
import type { AppTheme } from '@/theme';

interface EventCardAppProps {
  event: Event;
  onPress: () => void;
}

export function EventCardApp({ event, onPress }: EventCardAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventCardStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  
  // Detectar si es tablet (ancho mayor a 768px)
  const isTablet = width >= 768;
  
  // Dimensiones fijas para las cards
  const CARD_HEIGHT = 140;
  const IMAGE_WIDTH = isTablet ? 160 : 120;
  // Limitar el ancho máximo en tablet para que no queden demasiado largas
  const CARD_MAX_WIDTH = isTablet ? Math.min(640, width - 240) : undefined;

  return (
    <Pressable onPress={onPress} style={staticStyles.pressable}>
      <Card
        style={[
          staticStyles.card,
          themed.card,
          {
            height: CARD_HEIGHT,
            width: isTablet ? '80%' : '100%',
            maxWidth: CARD_MAX_WIDTH,
            alignSelf: 'center',
          },
        ]}
      >
        <View style={staticStyles.cardContainer}>
          {/* Imagen a la izquierda */}
          <Card.Cover
            source={{
              uri: event.images[0]?.url || 'https://via.placeholder.com/400x200',
            }}
            style={[
              staticStyles.cardImage,
              {
                width: IMAGE_WIDTH,
                height: CARD_HEIGHT,
              },
            ]}
          />

          {/* Contenido a la derecha */}
          <View style={staticStyles.cardContent}>
            <Text
              variant="titleMedium"
              style={[staticStyles.eventTitle, themed.eventTitle]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {event.name}
            </Text>

            <View style={{ flex: 1 }} />

            <View style={staticStyles.bottomInfo}>
              {event.category && (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons
                    name="tag"
                    size={isTablet ? 18 : 16}
                    color={themed.iconSecondary.color}
                  />
                  <Text
                    variant="bodySmall"
                    style={[staticStyles.infoText, themed.categoryText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {event.category.name}
                  </Text>
                </View>
              )}

              {event.city && (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons
                    name="city"
                    size={isTablet ? 18 : 16}
                    color={themed.iconVariant.color}
                  />
                  <Text
                    variant="bodySmall"
                    style={[staticStyles.infoText, themed.infoText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {event.city.name}, {event.city.country}
                  </Text>
                </View>
              )}

              <View style={staticStyles.infoRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={isTablet ? 18 : 16}
                  color={themed.iconVariant.color}
                />
                <Text
                  variant="bodySmall"
                  style={[staticStyles.infoText, themed.infoText]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {event.startDate}
                  {event.endDate && ` - ${event.endDate}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  cardContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  cardImage: {
    borderRadius: 0,
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
  },
  eventTitle: {
    marginBottom: 4,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    height: 26,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 2,
  },
  infoText: {
    flex: 1,
  },
  bottomInfo: {
    alignSelf: 'stretch',
    marginTop: 'auto',
    paddingBottom: 6,
  },
});

const getEventCardStyles = (theme: AppTheme) => ({
  card: {
    backgroundColor: theme.colors.surface,
  },
  eventTitle: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.titleMedium.fontWeight as any,
  },
  iconPrimary: {
    color: theme.colors.primary,
  },
  iconSecondary: {
    color: theme.colors.secondary,
  },
  iconVariant: {
    color: theme.colors.onSurfaceVariant,
  },
  infoText: {
    color: theme.colors.onSurfaceVariant,
  },
  categoryText: {
    color: theme.colors.secondary,
  },
});
