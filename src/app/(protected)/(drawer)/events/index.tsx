import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, View, RefreshControl } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { getEvents } from '@/services/event.service';
import { EventCardApp } from '@/components/events';
import { AnimatedFABApp } from '@/components/common';
import type { Event } from '@/types/Event';
import { eventsStaticStyles, getEventsStyles } from '@/styles/events.styles';

export default function EventsScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventsStyles(theme), [theme]);
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);

  // Cargar eventos
  const loadEvents = async (cursor?: string, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getEvents(cursor);
      
      if (isRefresh || !cursor) {
        setEvents(response.data);
      } else {
        setEvents((prev) => [...prev, ...response.data]);
      }

      setNextCursor(response.nextCursor);
      setHasNextPage(response.hasNextPage);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Cargar eventos cuando la pantalla se enfoca
  useFocusEffect(
    useCallback(() => {
      setIsFABVisible(true); // Mostrar FAB cuando la pantalla está enfocada
      loadEvents(undefined, false);
      
      return () => {
        setIsFABVisible(false); // Ocultar FAB cuando la pantalla se desenfoca
      };
    }, []),
  );

  // Refrescar eventos
  const handleRefresh = () => {
    loadEvents(undefined, true);
  };

  // Cargar más eventos (paginación)
  const handleLoadMore = () => {
    if (hasNextPage && !isLoading && nextCursor) {
      loadEvents(nextCursor, false);
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

  return (
    <View style={[eventsStaticStyles.container, themed.container]}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.uuid}
        renderItem={renderEvent}
        contentContainerStyle={[eventsStaticStyles.listContent, themed.listContent]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        ListEmptyComponent={
          <View style={eventsStaticStyles.emptyContainer}>
            <MaterialCommunityIcons name="calendar-blank" size={80} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyLarge" style={themed.emptyText}>
              No hay eventos disponibles
            </Text>
          </View>
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
 
