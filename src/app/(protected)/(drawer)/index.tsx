import { View, ScrollView, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useUserStore } from '@/stores/user.store';
import { useMemo } from 'react';
import { dashboardStaticStyles, getDashboardStyles } from '@/styles/dashboard.styles';
import {
  useOverviewStats,
  useEventsByCategory,
  useUsersByMonth,
} from '@/hooks/queries/analytics';
import {
  OverviewStatsCard,
  EventsByCategoryChart,
  UsersByMonthChart,
} from '@/components/analytics';

export default function DashboardScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getDashboardStyles(theme), [theme]);
  const { user } = useUserStore();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Obtener datos de analytics
  const { data: overviewStats, isLoading: isLoadingOverview } = useOverviewStats();
  const { data: eventsByCategory, isLoading: isLoadingEventsByCategory } = useEventsByCategory();
  const { data: usersByMonth, isLoading: isLoadingUsersByMonth } = useUsersByMonth();

  return (
    <View style={[dashboardStaticStyles.container, themed.container]}>
      <ScrollView
        contentContainerStyle={dashboardStaticStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={dashboardStaticStyles.header}>
          <MaterialCommunityIcons name="view-dashboard-outline" size={64} color={themed.iconColor} />
          <Text variant="headlineMedium" style={[dashboardStaticStyles.title, themed.title]}>
            Dashboard
          </Text>
          <Text variant="bodyLarge" style={[dashboardStaticStyles.subtitle, themed.subtitle]}>
            Bienvenido/a, {user?.name}
          </Text>
        </View>

        {/* Estadísticas generales */}
        <View style={dashboardStaticStyles.section}>
          <Text
            variant="titleMedium"
            style={[dashboardStaticStyles.sectionTitle, themed.sectionTitle]}
          >
            Resumen General
          </Text>
          <OverviewStatsCard stats={overviewStats} isLoading={isLoadingOverview} />
        </View>

        {/* Gráficos - En tablet lado a lado, en móvil uno debajo del otro */}
        <View
          style={[
            dashboardStaticStyles.section,
            isTablet && dashboardStaticStyles.chartsContainer,
          ]}
        >
          <View style={isTablet ? dashboardStaticStyles.chartItem : dashboardStaticStyles.chartItemMobile}>
            <EventsByCategoryChart data={eventsByCategory} isLoading={isLoadingEventsByCategory} />
          </View>

          <View style={isTablet ? dashboardStaticStyles.chartItem : dashboardStaticStyles.chartItemMobile}>
            <UsersByMonthChart data={usersByMonth} isLoading={isLoadingUsersByMonth} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
