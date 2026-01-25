import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { EventForm } from '@/components/events';
import { createStaticStyles, getCreateStyles } from '@/styles/events.styles';

export default function CreateEventScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getCreateStyles(theme), [theme]);
  const router = useRouter();

  return (
    <View style={[createStaticStyles.container, themed.container]}>
      <View style={createStaticStyles.header}>
        <Pressable style={createStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[createStaticStyles.title, themed.title]}> 
          Crear nuevo evento
        </Text>
      </View>
      <EventForm isCreating={true} onCancel={() => router.back()} />
    </View>
  );
}
