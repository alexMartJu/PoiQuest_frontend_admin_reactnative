import React, { useRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MapView, { Marker, UrlTile, MapPressEvent } from 'react-native-maps';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

const MAPTILER_KEY = process.env.EXPO_PUBLIC_MAPTILER_KEY;
const TILE_URL = `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`;

const DEFAULT_REGION = {
  latitude: 39.4699,
  longitude: -0.3763,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

interface PoiMapViewerProps {
  coordX: number | null;
  coordY: number | null;
  title?: string;
}

/**
 * Componente de mapa solo lectura para visualizar la ubicación de un POI
 */
export function PoiMapViewer({ coordX, coordY, title }: PoiMapViewerProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getMapStyles(theme), [theme]);
  const mapRef = useRef<MapView>(null);

  const hasCoords = coordX !== null && coordY !== null;

  const region = hasCoords
    ? {
        latitude: coordX!,
        longitude: coordY!,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : DEFAULT_REGION;

  if (!hasCoords) {
    return (
      <View style={[staticStyles.emptyContainer, themed.emptyContainer]}>
        <Text variant="bodyMedium" style={themed.emptyText}>
          Sin coordenadas disponibles
        </Text>
      </View>
    );
  }

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
        <Marker
          coordinate={{ latitude: coordX!, longitude: coordY! }}
          title={title || 'Punto de interés'}
        />
      </MapView>
      {/* Atribución de MapTiler */}
      <View style={staticStyles.attribution}>
        <Text variant="labelSmall" style={staticStyles.attributionText}>
          © MapTiler © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
}

interface PoiMapPickerProps {
  coordX: number | null;
  coordY: number | null;
  onLocationSelect: (latitude: number, longitude: number) => void;
  style?: any;
}

/**
 * Componente de mapa interactivo para seleccionar la ubicación de un POI
 * El usuario toca el mapa para colocar un marcador
 */
export function PoiMapPicker({ coordX, coordY, onLocationSelect, style }: PoiMapPickerProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getMapStyles(theme), [theme]);
  const mapRef = useRef<MapView>(null);

  const hasCoords = coordX !== null && coordY !== null;

  const region = hasCoords
    ? {
        latitude: coordX!,
        longitude: coordY!,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : DEFAULT_REGION;

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onLocationSelect(latitude, longitude);
  };

  return (
    <View style={[staticStyles.mapContainer, style]}>
      <Text variant="bodySmall" style={[staticStyles.helperText, themed.helperText]}>
        Toca el mapa para seleccionar la ubicación del punto de interés
      </Text>
      <MapView
        ref={mapRef}
        style={staticStyles.map}
        initialRegion={region}
        mapType="none"
        scrollEnabled={true}
        zoomEnabled={true}
        onPress={handleMapPress}
      >
        <UrlTile urlTemplate={TILE_URL} maximumZ={19} tileSize={256} />
        {hasCoords && (
          <Marker
            coordinate={{ latitude: coordX!, longitude: coordY! }}
            title="Ubicación seleccionada"
            draggable
            onDragEnd={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              onLocationSelect(latitude, longitude);
            }}
          />
        )}
      </MapView>
      {/* Atribución de MapTiler */}
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
    borderRadius: 12,
    overflow: 'hidden',
    height: 250,
  },
  map: {
    flex: 1,
  },
  emptyContainer: {
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  helperText: {
    textAlign: 'center',
    paddingVertical: 6,
  },
  attribution: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  attributionText: {
    fontSize: 9,
    color: '#333',
  },
});

const getMapStyles = (theme: AppTheme) => ({
  emptyContainer: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.outlineVariant,
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
  },
  helperText: {
    color: theme.colors.onSurfaceVariant,
    backgroundColor: theme.colors.surface,
  },
});
