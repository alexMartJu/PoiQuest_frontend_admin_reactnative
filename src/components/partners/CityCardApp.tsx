import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { getPartnerCardStyles } from '@/styles/partners.styles';
import type { City } from '@/types/Partner';

interface CityCardAppProps {
  city: City;
  onPress?: () => void;
}

export function CityCardApp({ city, onPress }: CityCardAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnerCardStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <Pressable onPress={onPress} style={staticStyles.pressable} disabled={!onPress}>
      <Card
        style={[
          staticStyles.card,
          themed.card,
          {
            width: isTablet ? '80%' : '100%',
            maxWidth: isTablet ? Math.min(640, width - 240) : undefined,
            alignSelf: 'center',
          },
        ]}
      >
        <View style={staticStyles.cardContent}>
          {/* Ícono de ciudad */}
          <View style={[staticStyles.iconContainer, { backgroundColor: theme.colors.secondaryContainer }]}>
            <MaterialCommunityIcons name="city" size={36} color={theme.colors.secondary} />
          </View>

          {/* Información */}
          <View style={staticStyles.infoSection}>
            <Text
              variant="titleMedium"
              style={[staticStyles.name, themed.partnerName]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {city.name}
            </Text>

            <View style={staticStyles.infoRow}>
              <MaterialCommunityIcons name="flag" size={15} color={themed.iconSecondary.color} />
              <Text
                variant="bodySmall"
                style={[staticStyles.infoText, themed.typeText]}
                numberOfLines={1}
              >
                {city.country}
                {city.region ? ` · ${city.region}` : ''}
              </Text>
            </View>

            {city.description && (
              <Text
                variant="bodySmall"
                style={[staticStyles.description, themed.infoText]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {city.description}
              </Text>
            )}
          </View>

          {onPress && (
            <MaterialCommunityIcons
              name="chevron-right"
              size={22}
              color={theme.colors.onSurfaceVariant}
              style={staticStyles.chevron}
            />
          )}
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
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoSection: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
  chevron: {
    flexShrink: 0,
  },
});
