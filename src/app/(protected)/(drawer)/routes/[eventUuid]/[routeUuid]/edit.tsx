import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { RouteForm } from '@/components/routes';
import { useRouteDetail } from '@/hooks/routes/useRouteDetail';
import { routeDetailStaticStyles, getRouteDetailStyles } from '@/styles/routes.styles';

export default function EditRouteScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getRouteDetailStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();
  const { route, isLoading } = useRouteDetail();

  if (isLoading) {
    return (
      <View style={[routeDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando ruta...</Text>
      </View>
    );
  }

  if (!route) {
    return (
      <View style={[routeDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Ruta no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      <View style={routeDetailStaticStyles.header}>
        <Pressable
          style={routeDetailStaticStyles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>
        <Text
          variant="titleMedium"
          style={[routeDetailStaticStyles.title, { color: theme.colors.onSurface }]}
        >
          Editar ruta
        </Text>
      </View>
      <RouteForm
        route={route}
        eventUuid={eventUuid}
        isCreating={false}
        onSuccess={() => router.back()}
        onCancel={() => router.back()}
      />
    </View>
  );
}
