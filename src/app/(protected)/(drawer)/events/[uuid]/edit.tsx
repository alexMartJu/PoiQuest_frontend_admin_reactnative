import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { EventForm } from '@/components/events';
import { useEventDetail } from '@/hooks/useEventDetail';
import { eventDetailStaticStyles, getEventDetailStyles } from '@/styles/events.styles';

export default function EditEventScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getEventDetailStyles(theme), [theme]);
  const router = useRouter();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();
  const { event, isLoading } = useEventDetail();

  if (isLoading) {
    return (
      <View style={[eventDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando evento...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[eventDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Evento no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      <View style={eventDetailStaticStyles.header}>
        <Pressable style={eventDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[eventDetailStaticStyles.title, { color: theme.colors.onSurface }]}> 
          Editar evento
        </Text>
      </View>
      <EventForm
        event={event}
        isCreating={false}
        onSuccess={() => router.back()}
        onCancel={() => router.back()}
      />
    </View>
  );
}