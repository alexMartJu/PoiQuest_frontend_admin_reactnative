import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { PoiForm } from '@/components/pois';
import { poiCreateStaticStyles, getPoiCreateStyles } from '@/styles/pois.styles';

export default function CreatePoiScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPoiCreateStyles(theme), [theme]);
  const router = useRouter();
  const { eventUuid } = useLocalSearchParams<{ eventUuid: string }>();

  return (
    <View style={[poiCreateStaticStyles.container, themed.container]}>
      <View style={poiCreateStaticStyles.header}>
        <Pressable style={poiCreateStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[poiCreateStaticStyles.title, themed.title]}>
          Crear punto de interés
        </Text>
      </View>
      <PoiForm isCreating={true} eventUuid={eventUuid} onCancel={() => router.back()} />
    </View>
  );
}
