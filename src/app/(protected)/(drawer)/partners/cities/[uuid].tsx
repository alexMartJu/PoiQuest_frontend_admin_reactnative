import React, { useMemo } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { CommonDialogApp } from '@/components/common';
import { useCityDetail } from '@/hooks/partners/usePartnerDetail';
import { partnerDetailStaticStyles, getPartnerDetailStyles } from '@/styles/partners.styles';

export default function CityDetailScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnerDetailStyles(theme), [theme]);
  const router = useRouter();

  const { city, isLoading, confirmVisible, setConfirmVisible, isDisabling, handleDisable } = useCityDetail();

  if (isLoading) {
    return (
      <View style={[partnerDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando ciudad...</Text>
      </View>
    );
  }

  if (!city) {
    return (
      <View style={[partnerDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Ciudad no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      {/* Header */}
      <View style={partnerDetailStaticStyles.header}>
        <Pressable style={partnerDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[partnerDetailStaticStyles.title, themed.title]} numberOfLines={1}>
          Detalle de ciudad
        </Text>
        <View style={partnerDetailStaticStyles.headerActions}>
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() => router.push(`/(protected)/(drawer)/partners/cities/${city.uuid}/edit`)}
          />
          <IconButton
            icon="delete-outline"
            size={22}
            iconColor={theme.colors.error}
            onPress={() => setConfirmVisible(true)}
            disabled={isDisabling}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={partnerDetailStaticStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[partnerDetailStaticStyles.card, themed.card]}>
          <View style={partnerDetailStaticStyles.iconRow}>
            <MaterialCommunityIcons name="city" size={40} color={theme.colors.primary} />
            <Text variant="headlineSmall" style={[partnerDetailStaticStyles.partnerName, themed.partnerName]}>{city.name}</Text>
          </View>

          <Divider style={{ marginVertical: 12 }} />

          <View style={partnerDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons name="flag" size={18} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={themed.infoText}> País: {city.country}</Text>
          </View>

          {city.region && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="map" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> Región: {city.region}</Text>
            </View>
          )}

          {city.description && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="text" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> {city.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <CommonDialogApp
        visible={confirmVisible}
        title="Desactivar ciudad"
        message={`¿Estás seguro de que deseas desactivar "${city.name}"?`}
        confirmText="Desactivar"
        onConfirm={() => { void handleDisable(); }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}


