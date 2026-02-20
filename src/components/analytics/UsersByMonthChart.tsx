import { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { MotiView } from 'moti';
import type { UsersByMonthResponse } from '@/types/Analytics';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

interface UsersByMonthChartProps {
  data: UsersByMonthResponse | undefined;
  isLoading: boolean;
}

export function UsersByMonthChart({ data, isLoading }: UsersByMonthChartProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getUsersByMonthChartStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const chartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [0] }],
      };
    }

    // Ordenar por año y mes
    const sortedData = [...data.data].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });

    // Tomar los últimos 6 meses
    const lastSixMonths = sortedData.slice(-6);

    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return {
      labels: lastSixMonths.map((item) => monthNames[item.month - 1]),
      datasets: [
        {
          data: lastSixMonths.map((item) => item.userCount),
          color: (opacity = 1) => {
            const secondary = theme.colors.secondary;
            const r = parseInt(secondary.slice(1, 3), 16);
            const g = parseInt(secondary.slice(3, 5), 16);
            const b = parseInt(secondary.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
          },
          strokeWidth: 3,
        },
      ],
    };
  }, [data, theme]);

  if (isLoading) {
    return (
      <View style={[staticStyles.container, themed.container]}>
        <Text variant="titleMedium" style={themed.title}>
          Usuarios Nuevos por Mes
        </Text>
        <View style={staticStyles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <View style={[staticStyles.container, themed.container]}>
        <Text variant="titleMedium" style={themed.title}>
          Usuarios Nuevos por Mes
        </Text>
        <View style={staticStyles.emptyContainer}>
          <Text variant="bodyMedium" style={themed.emptyText}>
            No hay datos disponibles
          </Text>
        </View>
      </View>
    );
  }

  // En tablet: usar 48% del ancho total (coincide con las cards de resumen)
  // Restar 32px para compensar el padding interno del card
  const chartWidth = isTablet ? Math.floor(width * 0.48) - 200 : width - 48;

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 500, delay: 200 }}
    >
      <View style={[staticStyles.container, themed.container]}>
        <Text variant="titleMedium" style={themed.title}>
          Usuarios Nuevos por Mes
        </Text>
        <View style={staticStyles.chartWrapper}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => {
                const secondary = theme.colors.secondary;
                const r = parseInt(secondary.slice(1, 3), 16);
                const g = parseInt(secondary.slice(3, 5), 16);
                const b = parseInt(secondary.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
              },
              labelColor: (opacity = 1) => {
                const textColor = theme.colors.onSurface;
                const r = parseInt(textColor.slice(1, 3), 16);
                const g = parseInt(textColor.slice(3, 5), 16);
                const b = parseInt(textColor.slice(5, 7), 16);
                return `rgba(${r}, ${g}, ${b}, ${opacity})`;
              },
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: theme.colors.outline,
                strokeWidth: 1,
                opacity: 0.9,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
              },
              propsForLabels: {
                fontSize: 11,
              },
            }}
            style={staticStyles.chart}
            bezier
            withInnerLines
            withOuterLines
            withVerticalLabels
            withHorizontalLabels
            withDots
            withShadow={false}
          />
        </View>
      </View>
    </MotiView>
  );
}

const staticStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    marginVertical: 8,
    borderWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  loadingContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartWrapper: {
    alignItems: 'center',
    marginTop: 12,
  },
  chart: {
    borderRadius: 16,
  },
});

const getUsersByMonthChartStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
  },
  title: {
    color: theme.colors.onSurface,
    fontWeight: '700' as const,
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
  },
});
