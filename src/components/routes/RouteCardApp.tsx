import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { Route } from '@/types/Route';
import type { AppTheme } from '@/theme';

interface RouteCardAppProps {
  route: Route;
  onPress: () => void;
}

export function RouteCardApp({ route, onPress }: RouteCardAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getRouteCardStyles(theme), [theme]);
  const { width } = useWindowDimensions();

  const isTablet = width >= 768;
  const CARD_MAX_WIDTH = isTablet ? Math.min(640, width - 240) : undefined;

  const poisCount = route.pois.length;

  return (
    <Pressable onPress={onPress} style={staticStyles.pressable}>
      <Card
        style={[
          staticStyles.card,
          themed.card,
          {
            width: isTablet ? '80%' : '100%',
            maxWidth: CARD_MAX_WIDTH,
            alignSelf: 'center',
          },
        ]}
      >
        <Card.Content style={staticStyles.content}>
          <View style={[staticStyles.iconContainer, themed.iconContainer]}>
            <MaterialCommunityIcons
              name="map-marker-path"
              size={28}
              color={themed.icon.color}
            />
          </View>

          <View style={staticStyles.textContainer}>
            <Text
              variant="titleMedium"
              style={[staticStyles.routeName, themed.routeName]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {route.name}
            </Text>

            {route.description ? (
              <Text
                variant="bodySmall"
                style={[staticStyles.description, themed.description]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {route.description}
              </Text>
            ) : null}

            <View style={staticStyles.infoRow}>
              <MaterialCommunityIcons
                name="map-marker-multiple-outline"
                size={isTablet ? 16 : 14}
                color={themed.iconVariant.color}
              />
              <Text
                variant="bodySmall"
                style={[staticStyles.infoText, themed.infoText]}
              >
                {poisCount} {poisCount === 1 ? 'punto de interés' : 'puntos de interés'}
              </Text>
            </View>
          </View>

          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={themed.chevron.color}
          />
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({
  pressable: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  routeName: {
    fontWeight: '600',
  },
  description: {
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  infoText: {
    opacity: 0.7,
  },
});

function getRouteCardStyles(theme: AppTheme) {
  return {
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.outline,
    },
    iconContainer: {
      backgroundColor: theme.colors.primaryContainer,
    },
    icon: { color: theme.colors.primary },
    routeName: { color: theme.colors.onSurface },
    description: { color: theme.colors.onSurfaceVariant },
    iconVariant: { color: theme.colors.onSurfaceVariant },
    infoText: { color: theme.colors.onSurfaceVariant },
    chevron: { color: theme.colors.onSurfaceVariant },
  };
}
