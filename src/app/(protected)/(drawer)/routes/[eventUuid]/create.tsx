import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { RouteForm } from '@/components/routes';
import { routeCreateStaticStyles, getRouteCreateStyles } from '@/styles/routes.styles';

export default function CreateRouteScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getRouteCreateStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();

  return (
    <View style={[routeCreateStaticStyles.container, themed.container]}>
      <View style={routeCreateStaticStyles.header}>
        <Pressable style={routeCreateStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[routeCreateStaticStyles.title, themed.title]}>
          Crear ruta
        </Text>
      </View>
      <RouteForm
        isCreating={true}
        eventUuid={eventUuid}
        onSuccess={() => router.back()}
        onCancel={() => router.back()}
      />
    </View>
  );
}
