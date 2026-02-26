import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { PointOfInterest } from '@/types/PointOfInterest';
import type { AppTheme } from '@/theme';

interface PoiCardAppProps {
  poi: PointOfInterest;
  onPress: () => void;
}

export function PoiCardApp({ poi, onPress }: PoiCardAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoiCardStyles(theme), [theme]);
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;

  const CARD_HEIGHT = 140;
  const IMAGE_WIDTH = isTablet ? 160 : 120;
  const CARD_MAX_WIDTH = isTablet ? Math.min(640, width - 240) : undefined;

  const primaryImage = poi.images?.find(img => img.isPrimary)?.url || poi.images?.[0]?.url;

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
          <Card.Cover
            source={{
              uri: primaryImage || 'https://via.placeholder.com/400x200',
            }}
            style={[
              staticStyles.cardImage,
              {
                width: IMAGE_WIDTH,
                height: CARD_HEIGHT,
              },
            ]}
          />
          <View style={staticStyles.cardContent}>
            <Text
              variant="titleMedium"
              style={[staticStyles.poiTitle, themed.poiTitle]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {poi.title}
            </Text>
            <View style={{ flex: 1 }} />
            <View style={staticStyles.bottomInfo}>
              {poi.author && (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons
                    name="account"
                    size={isTablet ? 18 : 16}
                    color={themed.iconSecondary.color}
                  />
                  <Text
                    variant="bodySmall"
                    style={[staticStyles.infoText, themed.authorText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {poi.author}
                  </Text>
                </View>
              )}
              <View style={staticStyles.infoRow}>
                <MaterialCommunityIcons
                  name="qrcode"
                  size={isTablet ? 18 : 16}
                  color={themed.iconVariant.color}
                />
                <Text
                  variant="bodySmall"
                  style={[staticStyles.infoText, themed.infoText]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {poi.qrCode}
                </Text>
              </View>
              {(poi.coordX !== null && poi.coordY !== null) && (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={isTablet ? 18 : 16}
                    color={themed.iconVariant.color}
                  />
                  <Text
                    variant="bodySmall"
                    style={[staticStyles.infoText, themed.infoText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {poi.coordX!.toFixed(4)}, {poi.coordY!.toFixed(4)}
                  </Text>
                </View>
              )}
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
  poiTitle: {
    marginBottom: 4,
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

const getPoiCardStyles = (theme: AppTheme) => ({
  card: {
    backgroundColor: theme.colors.surface,
  },
  poiTitle: {
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
  authorText: {
    color: theme.colors.secondary,
  },
});
