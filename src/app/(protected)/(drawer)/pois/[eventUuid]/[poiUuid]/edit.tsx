import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { PoiForm } from '@/components/pois';
import { usePoiDetail } from '@/hooks/pois/usePoiDetail';
import { poiDetailStaticStyles, getPoiDetailStyles } from '@/styles/pois.styles';

export default function EditPoiScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoiDetailStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();
  const { poi, isLoading } = usePoiDetail();

  if (isLoading) {
    return (
      <View style={[poiDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando punto de interés...</Text>
      </View>
    );
  }

  if (!poi) {
    return (
      <View style={[poiDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Punto de interés no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      <View style={poiDetailStaticStyles.header}>
        <Pressable style={poiDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[poiDetailStaticStyles.title, { color: theme.colors.onSurface }]}>
          Editar punto de interés
        </Text>
      </View>
      <PoiForm
        poi={poi}
        eventUuid={eventUuid}
        isCreating={false}
        onSuccess={() => router.back()}
        onCancel={() => router.back()}
      />
    </View>
  );
}
