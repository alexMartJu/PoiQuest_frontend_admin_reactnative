import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useAdminEventsInfiniteQuery } from '@/hooks/queries/events';
import { EventCardApp } from '@/components/events';
import { AnimatedFABApp, SegmentedButtonGroupApp, type SegmentedButtonOption } from '@/components/common';
import { EventAdminFilter } from '@/types/Event';
import type { Event } from '@/types/Event';
import { eventsStaticStyles, getEventsStyles } from '@/styles/events.styles';

const FILTER_OPTIONS: SegmentedButtonOption<EventAdminFilter>[] = [
  { value: EventAdminFilter.PENDING, label: 'Pendientes', shortLabel: 'Pend.', icon: 'clock-outline' },
  { value: EventAdminFilter.ACTIVE, label: 'Activos', shortLabel: 'Act.', icon: 'check-circle-outline' },
  { value: EventAdminFilter.FINISHED, label: 'Finalizados', shortLabel: 'Fin.', icon: 'calendar-end' },
  { value: EventAdminFilter.DELETED, label: 'Eliminados', shortLabel: 'Elim.', icon: 'delete-outline' },
];

export default function EventsScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventsStyles(theme), [theme]);
  const router = useRouter();
  const [filter, setFilter] = useState<EventAdminFilter>(EventAdminFilter.PENDING);
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);

  const pendingQuery = useAdminEventsInfiniteQuery(EventAdminFilter.PENDING, 5);
  const activeQuery = useAdminEventsInfiniteQuery(EventAdminFilter.ACTIVE, 5);
  const finishedQuery = useAdminEventsInfiniteQuery(EventAdminFilter.FINISHED, 5);
  const deletedQuery = useAdminEventsInfiniteQuery(EventAdminFilter.DELETED, 5);

  const currentQuery =
    filter === EventAdminFilter.PENDING ? pendingQuery :
    filter === EventAdminFilter.ACTIVE ? activeQuery :
    filter === EventAdminFilter.FINISHED ? finishedQuery :
    deletedQuery;

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = currentQuery;

  const events = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.data) ?? [];
    const seen = new Set<string>();
    return all.filter((item) => {
      if (seen.has(item.uuid)) return false;
      seen.add(item.uuid);
      return true;
    });
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setIsFABVisible(true);
      return () => { setIsFABVisible(false); };
    }, []),
  );

  const handleRefresh = () => { refetch(); };
  const handleLoadMore = () => { if (hasNextPage && !isFetchingNextPage) { fetchNextPage(); } };

  const handleEventPress = (uuid: string) => {
    if (filter === EventAdminFilter.DELETED) return;
    router.push(`/(protected)/(drawer)/events/${uuid}`);
  };

  const handleCreateEvent = () => { router.push('/(protected)/(drawer)/events/create'); };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCardApp
      event={item}
      onPress={() => handleEventPress(item.uuid)}
    />
  );

  const handleScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

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

  const emptyIcon =
    filter === EventAdminFilter.PENDING ? 'clock-outline' :
    filter === EventAdminFilter.ACTIVE ? 'calendar-check' :
    filter === EventAdminFilter.FINISHED ? 'calendar-end' :
    'delete-outline';

  const emptyLabel =
    filter === EventAdminFilter.PENDING ? 'No hay eventos pendientes' :
    filter === EventAdminFilter.ACTIVE ? 'No hay eventos activos' :
    filter === EventAdminFilter.FINISHED ? 'No hay eventos finalizados' :
    'No hay eventos eliminados';

  const showFAB = filter === EventAdminFilter.PENDING || filter === EventAdminFilter.ACTIVE;

  return (
    <View style={[eventsStaticStyles.container, themed.container]}>
      <View style={[eventsStaticStyles.segmentedSection, themed.segmentedSection]}>
        <SegmentedButtonGroupApp<EventAdminFilter>
          options={FILTER_OPTIONS}
          selected={filter}
          onSelect={setFilter}
          density="small"
        />
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.uuid}
        renderItem={renderEvent}
        contentContainerStyle={[eventsStaticStyles.listContent, themed.listContent]}
        refreshControl={
          <RefreshControl refreshing={isFetching && !isLoading} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        onScroll={handleScroll}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={eventsStaticStyles.emptyContainer}>
              <Text variant="bodyLarge" style={themed.emptyText}>Cargando eventos...</Text>
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
              <MaterialCommunityIcons name={emptyIcon} size={80} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={themed.emptyText}>{emptyLabel}</Text>
            </View>
          )
        }
      />

      {showFAB && (
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
      )}
    </View>
  );
}

