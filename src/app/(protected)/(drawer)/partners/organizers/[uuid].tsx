import React, { useMemo } from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { Text, IconButton, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { CommonDialogApp } from '@/components/common';
import { ORGANIZER_TYPE_LABELS } from '@/types/Partner';
import { useOrganizerDetail } from '@/hooks/partners/usePartnerDetail';
import { partnerDetailStaticStyles, getPartnerDetailStyles } from '@/styles/partners.styles';

export default function OrganizerDetailScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnerDetailStyles(theme), [theme]);
  const router = useRouter();

  const { organizer, isLoading, confirmVisible, setConfirmVisible, isDisabling, handleDisable } = useOrganizerDetail();

  if (isLoading) {
    return (
      <View style={[partnerDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando organizador...</Text>
      </View>
    );
  }

  if (!organizer) {
    return (
      <View style={[partnerDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Organizador no encontrado</Text>
      </View>
    );
  }

  const primaryImage = organizer.images?.find((img) => img.isPrimary) ?? organizer.images?.[0];

  return (
    <View style={themed.container}>
      {/* Header */}
      <View style={partnerDetailStaticStyles.header}>
        <Pressable style={partnerDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[partnerDetailStaticStyles.title, themed.title]} numberOfLines={1}>
          Detalle de organizador
        </Text>
        <View style={partnerDetailStaticStyles.headerActions}>
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() => router.push(`/(protected)/(drawer)/partners/organizers/${organizer.uuid}/edit`)}
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
        {/* Imagen principal */}
        {primaryImage ? (
          <Image source={{ uri: primaryImage.url }} style={partnerDetailStaticStyles.mainImage} resizeMode="cover" />
        ) : null}

        {/* Info básica */}
        <View style={[partnerDetailStaticStyles.card, themed.card]}>
          <Text variant="headlineSmall" style={[partnerDetailStaticStyles.partnerName, themed.partnerName]}>{organizer.name}</Text>

          <Chip
            icon="account-tie"
            mode="outlined"
            style={{ alignSelf: 'flex-start' }}
            textStyle={{ color: theme.colors.secondary }}
          >
            {ORGANIZER_TYPE_LABELS[organizer.type]}
          </Chip>

          <Divider style={{ marginVertical: 12 }} />

          <View style={partnerDetailStaticStyles.infoRow}>
            <MaterialCommunityIcons name="email-outline" size={18} color={theme.colors.onSurfaceVariant} />
            <Text variant="bodyMedium" style={themed.infoText}> {organizer.contactEmail}</Text>
          </View>

          {organizer.contactPhone && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="phone-outline" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> {organizer.contactPhone}</Text>
            </View>
          )}

          {organizer.description && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="text" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> {organizer.description}</Text>
            </View>
          )}
        </View>

        {/* Galería */}
        {organizer.images && organizer.images.length > 1 && (
          <View style={[partnerDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={themed.sectionTitle}>Galería</Text>
            <View style={partnerDetailStaticStyles.galleryContainer}>
              {organizer.images.map((img) => (
                <Image key={img.id} source={{ uri: img.url }} style={[partnerDetailStaticStyles.galleryImage, themed.galleryImage]} resizeMode="cover" />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <CommonDialogApp
        visible={confirmVisible}
        title="Desactivar organizador"
        message={`¿Estás seguro de que deseas desactivar "${organizer.name}"?`}
        confirmText="Desactivar"
        onConfirm={() => { void handleDisable(); }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}


