import React, { useRef, useMemo } from 'react';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import type { RoutePoi } from '@/types/Route';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const TILE_URL = `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

interface RouteMapProps {
  pois: RoutePoi[];
}

/**
 * Componente de mapa para visualizar la ruta con todos sus POIs conectados
 * mediante una polyline. El primer POI es verde, el último rojo, el resto usa
 * el color primario del tema.
 */
export function RouteMap({ pois }: RouteMapProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getMapStyles(theme), [theme]);
  const mapRef = useRef<MapView>(null);

  const sortedPois = [...pois].sort((a, b) => a.sortOrder - b.sortOrder);
  const poisWithCoords = sortedPois.filter(
    (rp) => rp.poi.coordX !== null && rp.poi.coordY !== null,
  );

  if (poisWithCoords.length === 0) {
    return (
      <View style={[staticStyles.emptyContainer, themed.emptyContainer]}>
        <Text variant="bodyMedium" style={themed.emptyText}>
          Ningún punto de interés tiene coordenadas disponibles
        </Text>
      </View>
    );
  }

  const lats = poisWithCoords.map((rp) => rp.poi.coordX!);
  const lons = poisWithCoords.map((rp) => rp.poi.coordY!);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);

  const region = {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max(maxLat - minLat, 0.01) * 1.6,
    longitudeDelta: Math.max(maxLon - minLon, 0.01) * 1.6,
  };

  const polylineCoords = poisWithCoords.map((rp) => ({
    latitude: rp.poi.coordX!,
    longitude: rp.poi.coordY!,
  }));

  return (
    <View style={staticStyles.mapContainer}>
      <MapView
        ref={mapRef}
        style={staticStyles.map}
        initialRegion={region}
        region={region}
        mapType="none"
        scrollEnabled={true}
        zoomEnabled={true}
      >
        <UrlTile urlTemplate={TILE_URL} maximumZ={19} tileSize={256} />

        {/* Polyline connecting all POIs in order */}
        <Polyline
          coordinates={polylineCoords}
          strokeColor={theme.colors.primary}
          strokeWidth={3}
        />

        {/* Markers for each POI with order number */}
        {poisWithCoords.map((rp, index) => {
          const isFirst = index === 0;
          const isLast = index === poisWithCoords.length - 1;
          const pinColor = isFirst ? '#22C55E' : isLast ? '#EF4444' : theme.colors.primary;

          return (
            <Marker
              key={rp.poi.uuid}
              coordinate={{ latitude: rp.poi.coordX!, longitude: rp.poi.coordY! }}
              title={rp.poi.title}
              description={rp.poi.description ?? undefined}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={[staticStyles.markerContainer, { borderColor: pinColor }]}>
                <View style={[staticStyles.markerBubble, { backgroundColor: pinColor }]}>
                  <RNText style={staticStyles.markerText}>{rp.sortOrder}</RNText>
                </View>
                <View style={[staticStyles.markerTip, { borderTopColor: pinColor }]} />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* MapTiler attribution */}
      <View style={staticStyles.attribution}>
        <Text variant="labelSmall" style={staticStyles.attributionText}>
          © MapTiler © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    height: 120,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attribution: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  attributionText: {
    fontSize: 9,
    color: '#333',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 16,
  },
  markerTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});

function getMapStyles(theme: AppTheme) {
  return StyleSheet.create({
    emptyContainer: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    emptyText: {
      color: theme.colors.onSurfaceVariant,
    },
  });
}
