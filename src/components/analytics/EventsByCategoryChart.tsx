import { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import { MotiView } from 'moti';
import type { EventsByCategoryResponse } from '@/types/Analytics';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

interface EventsByCategoryChartProps {
  data: EventsByCategoryResponse | undefined;
  isLoading: boolean;
}

export function EventsByCategoryChart({ data, isLoading }: EventsByCategoryChartProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventsByCategoryChartStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const chartData = useMemo(() => {
    if (!data?.data || data.data.length === 0) {
      return {
        labels: ['Sin datos'],
        datasets: [{ data: [0] }],
      };
    }

    // Limitar a las primeras 5 categorías para que no se sobrecargue el gráfico
    const topCategories = data.data.slice(0, 5);

    return {
      labels: topCategories.map((item) => {
        // Abreviar nombres largos
        const name = item.categoryName;
        return name.length > 10 ? name.substring(0, 10) + '...' : name;
      }),
      datasets: [
        {
          data: topCategories.map((item) => item.eventCount),
        },
      ],
    };
  }, [data]);

  if (isLoading) {
    return (
      <View style={[staticStyles.container, themed.container]}>
        <Text variant="titleMedium" style={themed.title}>
          Eventos por Categoría
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
          Eventos por Categoría
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
      transition={{ type: 'timing', duration: 500 }}
    >
      <View style={[staticStyles.container, themed.container]}>
        <Text variant="titleMedium" style={themed.title}>
          Eventos por Categoría
        </Text>
        <View style={staticStyles.chartWrapper}>
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => {
                const primary = theme.colors.secondary;
                // Extraer RGB del color hex
                const r = parseInt(primary.slice(1, 3), 16);
                const g = parseInt(primary.slice(3, 5), 16);
                const b = parseInt(primary.slice(5, 7), 16);
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
              propsForLabels: {
                fontSize: 11,
              },
            }}
            style={staticStyles.chart}
            showValuesOnTopOfBars
            fromZero
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

const getEventsByCategoryChartStyles = (theme: AppTheme) => ({
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
