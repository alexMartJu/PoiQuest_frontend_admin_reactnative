import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FlatList, View, RefreshControl, Pressable } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useRoutesByEventQuery } from '@/hooks/queries/routes';
import { RouteCardApp } from '@/components/routes';
import { AnimatedFABApp } from '@/components/common';
import type { Route } from '@/types/Route';
import { routesListStaticStyles, getRoutesListStyles } from '@/styles/routes.styles';

export default function RoutesListScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getRoutesListStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);

  const {
    data: routes,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useRoutesByEventQuery(eventUuid);

  useFocusEffect(
    useCallback(() => {
      setIsFABVisible(true);
      refetch();

      return () => {
        setIsFABVisible(false);
      };
    }, [refetch]),
  );

  const handleRefresh = () => {
    refetch();
  };

  const handleRoutePress = (routeUuid: string) => {
    router.push(`/(protected)/(drawer)/routes/${eventUuid}/${routeUuid}`);
  };

  const handleCreateRoute = () => {
    router.push(`/(protected)/(drawer)/routes/${eventUuid}/create`);
  };

  const renderRoute = ({ item }: { item: Route }) => (
    <RouteCardApp route={item} onPress={() => handleRoutePress(item.uuid)} />
  );

  const handleScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  return (
    <View style={[routesListStaticStyles.container, themed.container]}>
      <View style={routesListStaticStyles.header}>
        <Pressable style={routesListStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text
          variant="titleMedium"
          style={[routesListStaticStyles.title, themed.title]}
        >
          Rutas del evento
        </Text>
      </View>

      <FlatList
        data={routes ?? []}
        keyExtractor={(item) => item.uuid}
        renderItem={renderRoute}
        contentContainerStyle={[routesListStaticStyles.listContent, themed.listContent]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
          />
        }
        onScroll={handleScroll}
        ListEmptyComponent={
          isLoading ? (
            <View style={routesListStaticStyles.emptyContainer}>
              <Text variant="bodyLarge" style={themed.emptyText}>
                Cargando rutas...
              </Text>
            </View>
          ) : error ? (
            <View style={routesListStaticStyles.emptyContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={80}
                color={theme.colors.error}
              />
              <Text
                variant="bodyLarge"
                style={{ color: theme.colors.error, textAlign: 'center' }}
              >
                {error instanceof Error ? error.message : 'Error al cargar rutas'}
              </Text>
            </View>
          ) : (
            <View style={routesListStaticStyles.emptyContainer}>
              <MaterialCommunityIcons
                name="map-marker-path"
                size={80}
                color={theme.colors.onSurfaceVariant}
              />
              <Text variant="bodyLarge" style={themed.emptyText}>
                No hay rutas para este evento
              </Text>
              <Text variant="bodySmall" style={themed.emptyText}>
                Pulsa + para crear la primera ruta
              </Text>
            </View>
          )
        }
      />

      <Portal>
        <AnimatedFABApp
          icon="plus"
          label="Nueva ruta"
          extended={isExtended}
          onPress={handleCreateRoute}
          visible={isFABVisible}
        />
      </Portal>
    </View>
  );
}
