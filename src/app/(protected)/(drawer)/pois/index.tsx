import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useEventsInfiniteQuery } from '@/hooks/queries/events';
import { EventCardApp } from '@/components/events';
import type { Event } from '@/types/Event';
import { poisEventsStaticStyles, getPoisEventsStyles } from '@/styles/pois.styles';

export default function PoisEventsScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoisEventsStyles(theme), [theme]);
  const router = useRouter();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
    refetch,
  } = useEventsInfiniteQuery(5);

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  const handleRefresh = () => {
    refetch();
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleEventPress = (uuid: string) => {
    router.push(`/(protected)/(drawer)/pois/${uuid}`);
  };

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCardApp event={item} onPress={() => handleEventPress(item.uuid)} />
  );

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
    <View style={[poisEventsStaticStyles.container, themed.container]}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.uuid}
        renderItem={renderEvent}
        contentContainerStyle={[poisEventsStaticStyles.listContent, themed.listContent]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={poisEventsStaticStyles.emptyContainer}>
              <Text variant="bodyLarge" style={themed.emptyText}>
                Cargando eventos...
              </Text>
            </View>
          ) : error ? (
            <View style={poisEventsStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="alert-circle" size={80} color={theme.colors.error} />
              <Text variant="bodyLarge" style={{ color: theme.colors.error, textAlign: 'center' }}>
                {error instanceof Error ? error.message : 'Error al cargar eventos'}
              </Text>
            </View>
          ) : (
            <View style={poisEventsStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="calendar-blank" size={80} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={themed.emptyText}>
                No hay eventos disponibles
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
