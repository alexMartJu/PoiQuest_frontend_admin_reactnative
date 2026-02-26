import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FlatList, View, RefreshControl, Pressable } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { usePoisByEventQuery } from '@/hooks/queries/pois';
import { PoiCardApp } from '@/components/pois';
import { AnimatedFABApp } from '@/components/common';
import type { PointOfInterest } from '@/types/PointOfInterest';
import { poisListStaticStyles, getPoisListStyles } from '@/styles/pois.styles';

export default function PoisListScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoisListStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);

  const {
    data: pois,
    isLoading,
    isFetching,
    error,
    refetch,
  } = usePoisByEventQuery(eventUuid);

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

  const handlePoiPress = (poiUuid: string) => {
    router.push(`/(protected)/(drawer)/pois/${eventUuid}/${poiUuid}`);
  };

  const handleCreatePoi = () => {
    router.push(`/(protected)/(drawer)/pois/${eventUuid}/create`);
  };

  const renderPoi = ({ item }: { item: PointOfInterest }) => (
    <PoiCardApp poi={item} onPress={() => handlePoiPress(item.uuid)} />
  );

  const handleScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  return (
    <View style={[poisListStaticStyles.container, themed.container]}>
      <View style={poisListStaticStyles.header}>
        <Pressable style={poisListStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[poisListStaticStyles.title, themed.title]}>
          Puntos de interés
        </Text>
      </View>

      <FlatList
        data={pois ?? []}
        keyExtractor={(item) => item.uuid}
        renderItem={renderPoi}
        contentContainerStyle={[poisListStaticStyles.listContent, themed.listContent]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={handleRefresh}
          />
        }
        onScroll={handleScroll}
        ListEmptyComponent={
          isLoading ? (
            <View style={poisListStaticStyles.emptyContainer}>
              <Text variant="bodyLarge" style={themed.emptyText}>
                Cargando puntos de interés...
              </Text>
            </View>
          ) : error ? (
            <View style={poisListStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="alert-circle" size={80} color={theme.colors.error} />
              <Text variant="bodyLarge" style={{ color: theme.colors.error, textAlign: 'center' }}>
                {error instanceof Error ? error.message : 'Error al cargar POIs'}
              </Text>
            </View>
          ) : (
            <View style={poisListStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="map-marker-off" size={80} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={themed.emptyText}>
                No hay puntos de interés para este evento
              </Text>
            </View>
          )
        }
      />

      <Portal>
        <AnimatedFABApp
          icon="plus"
          label="Crear POI"
          extended={isExtended}
          visible={isFABVisible}
          onPress={handleCreatePoi}
          animateFrom="right"
          iconMode="dynamic"
        />
      </Portal>
    </View>
  );
}
