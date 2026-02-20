import { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import type { OverviewStats } from '@/types/Analytics';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

interface OverviewStatsCardProps {
  stats: OverviewStats | undefined;
  isLoading: boolean;
}

export function OverviewStatsCard({ stats, isLoading }: OverviewStatsCardProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getOverviewStatsCardStyles(theme), [theme]);

  if (isLoading) {
    return (
      <View style={[staticStyles.container, themed.container]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <View style={staticStyles.cardsGrid}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 0 }}
        style={staticStyles.cardWrapper}
      >
        <View style={[staticStyles.statCard, themed.statCard]}>
          <MaterialCommunityIcons name="account-group" size={32} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={themed.statValue}>
            {stats.totalUsers}
          </Text>
          <Text variant="bodySmall" style={themed.statLabel}>
            Total Usuarios
          </Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 100 }}
        style={staticStyles.cardWrapper}
      >
        <View style={[staticStyles.statCard, themed.statCard]}>
          <MaterialCommunityIcons name="account-check" size={32} color={theme.colors.secondary} />
          <Text variant="headlineSmall" style={themed.statValue}>
            {stats.activeUsers}
          </Text>
          <Text variant="bodySmall" style={themed.statLabel}>
            Usuarios Activos
          </Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
        style={staticStyles.cardWrapper}
      >
        <View style={[staticStyles.statCard, themed.statCard]}>
          <MaterialCommunityIcons name="calendar-star" size={32} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={themed.statValue}>
            {stats.totalEvents}
          </Text>
          <Text variant="bodySmall" style={themed.statLabel}>
            Total Eventos
          </Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 300 }}
        style={staticStyles.cardWrapper}
      >
        <View style={[staticStyles.statCard, themed.statCard]}>
          <MaterialCommunityIcons name="calendar-check" size={32} color={theme.colors.secondary} />
          <Text variant="headlineSmall" style={themed.statValue}>
            {stats.activeEvents}
          </Text>
          <Text variant="bodySmall" style={themed.statLabel}>
            Eventos Activos
          </Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 400 }}
        style={staticStyles.cardWrapper}
      >
        <View style={[staticStyles.statCard, themed.statCard]}>
          <MaterialCommunityIcons name="map-marker-star" size={32} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={themed.statValue}>
            {stats.totalPois}
          </Text>
          <Text variant="bodySmall" style={themed.statLabel}>
            Puntos de Interés
          </Text>
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 500 }}
        style={staticStyles.cardWrapper}
      >
        <View style={[staticStyles.statCard, themed.statCard]}>
          <MaterialCommunityIcons name="account-clock" size={32} color={theme.colors.secondary} />
          <Text variant="headlineSmall" style={themed.statValue}>
            {stats.recentUsers}
          </Text>
          <Text variant="bodySmall" style={themed.statLabel}>
            Nuevos (7 días)
          </Text>
        </View>
      </MotiView>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  cardWrapper: {
    width: '48%',
    minWidth: 160,
  },
  statCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

const getOverviewStatsCardStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
  },
  statValue: {
    color: theme.colors.onSurface,
    fontWeight: '700' as const,
  },
  statLabel: {
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center' as const,
  },
});
