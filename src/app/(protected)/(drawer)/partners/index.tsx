import { useCallback, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { FlatList, View, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { AnimatedFABApp, SegmentedButtonGroupApp, type SegmentedButtonOption } from '@/components/common';
import { CityCardApp, OrganizerCardApp, SponsorCardApp } from '@/components/partners';
import {
  useCitiesInfiniteQuery,
  useOrganizersInfiniteQuery,
  useSponsorsInfiniteQuery,
} from '@/hooks/queries/partners';
import { PartnerStatus } from '@/types/Partner';
import type { City, Organizer, Sponsor } from '@/types/Partner';
import { partnersStaticStyles, getPartnersStyles } from '@/styles/partners.styles';

type PartnerType = 'cities' | 'organizers' | 'sponsors';

const TYPE_OPTIONS: SegmentedButtonOption<PartnerType>[] = [
  { value: 'cities', label: 'Ciudades', icon: 'city' },
  { value: 'organizers', label: 'Organizadores', icon: 'handshake' },
  { value: 'sponsors', label: 'Patrocinadores', icon: 'star-circle' },
];

const STATUS_OPTIONS: SegmentedButtonOption<PartnerStatus>[] = [
  { value: PartnerStatus.ACTIVE, label: 'Activos' },
  { value: PartnerStatus.DISABLED, label: 'Desactivados' },
];

export default function PartnersScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnersStyles(theme), [theme]);
  const router = useRouter();

  const [type, setType] = useState<PartnerType>('cities');
  const [status, setStatus] = useState<PartnerStatus>(PartnerStatus.ACTIVE);
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);

  const citiesQuery = useCitiesInfiniteQuery(status);
  const organizersQuery = useOrganizersInfiniteQuery(status);
  const sponsorsQuery = useSponsorsInfiniteQuery(status);

  const activeQuery = type === 'cities' ? citiesQuery : type === 'organizers' ? organizersQuery : sponsorsQuery;
  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, error, refetch } = activeQuery;

  const items = useMemo(() => {
    const all = data?.pages.flatMap((p: any) => p.data) ?? [];
    const seen = new Set<string>();
    return all.filter((item: any) => {
      if (seen.has(item.uuid)) return false;
      seen.add(item.uuid);
      return true;
    });
  }, [data]);

  useFocusEffect(
    useCallback(() => {
      setIsFABVisible(true);
      return () => setIsFABVisible(false);
    }, []),
  );

  const handleRefresh = () => refetch();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handleScroll = ({ nativeEvent }: any) => {
    const pos = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(pos <= 0);
  };

  const handleItemPress = (uuid: string) => {
    router.push(`/(protected)/(drawer)/partners/${type}/${uuid}`);
  };

  const handleCreate = () => {
    router.push({ pathname: '/(protected)/(drawer)/partners/create', params: { type } });
  };

  const renderItem = ({ item }: { item: any }) => {
    if (type === 'cities') {
      return <CityCardApp city={item as City} onPress={() => handleItemPress(item.uuid)} />;
    }
    if (type === 'organizers') {
      return <OrganizerCardApp organizer={item as Organizer} onPress={() => handleItemPress(item.uuid)} />;
    }
    return <SponsorCardApp sponsor={item as Sponsor} onPress={() => handleItemPress(item.uuid)} />;
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text variant="bodySmall" style={{ marginTop: 8, color: theme.colors.onSurfaceVariant }}>
          Cargando más...
        </Text>
      </View>
    );
  };

  const isActiveStatus = status === PartnerStatus.ACTIVE;

  return (
    <View style={[partnersStaticStyles.container, themed.container]}>
      {/* Filtros */}
      <View style={[partnersStaticStyles.segmentedSection, themed.segmentedSection]}>
        <SegmentedButtonGroupApp<PartnerType>
          options={TYPE_OPTIONS}
          selected={type}
          onSelect={setType}
        />
        <View style={{ height: 2 }} />
        <SegmentedButtonGroupApp<PartnerStatus>
          options={STATUS_OPTIONS}
          selected={status}
          onSelect={setStatus}
        />
        <View style={{ height: 2 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
        contentContainerStyle={[partnersStaticStyles.listContent, themed.listContent]}
        refreshControl={<RefreshControl refreshing={isFetching && !isLoading} onRefresh={handleRefresh} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        onScroll={handleScroll}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          isLoading ? (
            <View style={partnersStaticStyles.emptyContainer}>
              <Text variant="bodyLarge" style={themed.emptyText}>Cargando...</Text>
            </View>
          ) : error ? (
            <View style={partnersStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
              <Text variant="bodyLarge" style={{ color: theme.colors.error, marginTop: 8 }}>
                Error al cargar los datos
              </Text>
            </View>
          ) : (
            <View style={partnersStaticStyles.emptyContainer}>
              <MaterialCommunityIcons name="archive-off-outline" size={48} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.emptyText}>
                No hay {type === 'cities' ? 'ciudades' : type === 'organizers' ? 'organizadores' : 'patrocinadores'} {isActiveStatus ? 'activos' : 'desactivados'}
              </Text>
            </View>
          )
        }
      />

      {isActiveStatus && (
        <AnimatedFABApp
          icon="plus"
          label="Nuevo"
          onPress={handleCreate}
          extended={isExtended}
          visible={isFABVisible}
        />
      )}
    </View>
  );
}
