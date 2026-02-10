import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useEventsInfiniteQuery } from '@/hooks/queries/events';
import { EventCardApp } from '@/components/events';
import { AnimatedFABApp } from '@/components/common';
import type { Event } from '@/types/Event';
import { eventsStaticStyles, getEventsStyles } from '@/styles/events.styles';

export default function EventsScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventsStyles(theme), [theme]);
  const router = useRouter();
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);

  // Usar React Query Infinite para paginación por scroll
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useEventsInfiniteQuery(5); // 5 eventos por página

  // Concatenar todas las páginas en un solo array
  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  // Mostrar/ocultar FAB cuando la pantalla se enfoca/desenfoca
  useFocusEffect(
    useCallback(() => {
      setIsFABVisible(true);
      
      return () => {
        setIsFABVisible(false);
      };
    }, []),
  );

  // Refrescar eventos con pull-to-refresh
  const handleRefresh = () => {
    refetch();
  };

  // Cargar más eventos al llegar al final (paginación infinita)
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Navegar a detalle
  const handleEventPress = (uuid: string) => {
    router.push(`/(protected)/(drawer)/events/${uuid}`);
  };

  // Navegar a crear
  const handleCreateEvent = () => {
    router.push('/(protected)/(drawer)/events/create');
  };

  // Renderizar cada evento
  const renderEvent = ({ item }: { item: Event }) => (
    <EventCardApp event={item} onPress={() => handleEventPress(item.uuid)} />
  );

  // Manejar scroll para animar el FAB
  const handleScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  // Footer para mostrar spinner al cargar más eventos
  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
          Cargando más eventos...
        </Text>
      </View>
    );
  };

  return (
    <View style={[eventsStaticStyles.container, themed.container]}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.uuid}
        renderItem={renderEvent}
        contentContainerStyle={[eventsStaticStyles.listContent, themed.listContent]}
        refreshControl={
          <RefreshControl 
            refreshing={isFetching && !isLoading} 
            onRefresh={handleRefresh} 
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        onScroll={handleScroll}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={eventsStaticStyles.emptyContainer}>
              <Text variant="bodyLarge" style={themed.emptyText}>
                Cargando eventos...
              </Text>
            </View>
          ) : error ? (
            <View style={eventsStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="alert-circle" size={80} color={theme.colors.error} />
              <Text variant="bodyLarge" style={{ color: theme.colors.error, textAlign: 'center' }}>
                {error instanceof Error ? error.message : 'Error al cargar eventos'}
              </Text>
            </View>
          ) : (
            <View style={eventsStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="calendar-blank" size={80} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={themed.emptyText}>
                No hay eventos disponibles
              </Text>
            </View>
          )
        }
      />

      <Portal>
        <AnimatedFABApp
          icon="plus"
          label="Crear Evento"
          extended={isExtended}
          visible={isFABVisible}
          onPress={handleCreateEvent}
          animateFrom="right"
          iconMode="dynamic"
        />
      </Portal>
    </View>
  );
}
 
