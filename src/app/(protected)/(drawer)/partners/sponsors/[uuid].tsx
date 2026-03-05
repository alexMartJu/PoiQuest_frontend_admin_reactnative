import React, { useMemo } from 'react';
import { View, ScrollView, Image, Pressable } from 'react-native';
import { Text, IconButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { CommonDialogApp } from '@/components/common';
import { useSponsorDetail } from '@/hooks/partners/usePartnerDetail';
import { partnerDetailStaticStyles, getPartnerDetailStyles } from '@/styles/partners.styles';

export default function SponsorDetailScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnerDetailStyles(theme), [theme]);
  const router = useRouter();

  const { sponsor, isLoading, confirmVisible, setConfirmVisible, isDisabling, handleDisable } = useSponsorDetail();

  if (isLoading) {
    return (
      <View style={[partnerDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando patrocinador...</Text>
      </View>
    );
  }

  if (!sponsor) {
    return (
      <View style={[partnerDetailStaticStyles.centerContainer, themed.container]}>
        <Text>Patrocinador no encontrado</Text>
      </View>
    );
  }

  const primaryImage = sponsor.images?.find((img) => img.isPrimary) ?? sponsor.images?.[0];

  return (
    <View style={themed.container}>
      {/* Header */}
      <View style={partnerDetailStaticStyles.header}>
        <Pressable style={partnerDetailStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[partnerDetailStaticStyles.title, themed.title]} numberOfLines={1}>
          Detalle de patrocinador
        </Text>
        <View style={partnerDetailStaticStyles.headerActions}>
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={theme.colors.primary}
            onPress={() => router.push(`/(protected)/(drawer)/partners/sponsors/${sponsor.uuid}/edit`)}
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
          <Text variant="headlineSmall" style={[partnerDetailStaticStyles.partnerName, themed.partnerName]}>{sponsor.name}</Text>

          <Divider style={{ marginVertical: 12 }} />

          {sponsor.websiteUrl && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="web" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> {sponsor.websiteUrl}</Text>
            </View>
          )}

          {sponsor.contactEmail && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="email-outline" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> {sponsor.contactEmail}</Text>
            </View>
          )}

          {sponsor.description && (
            <View style={partnerDetailStaticStyles.infoRow}>
              <MaterialCommunityIcons name="text" size={18} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyMedium" style={themed.infoText}> {sponsor.description}</Text>
            </View>
          )}
        </View>

        {/* Galería */}
        {sponsor.images && sponsor.images.length > 1 && (
          <View style={[partnerDetailStaticStyles.card, themed.card]}>
            <Text variant="titleMedium" style={themed.sectionTitle}>Galería</Text>
            <View style={partnerDetailStaticStyles.galleryContainer}>
              {sponsor.images.map((img) => (
                <Image key={img.id} source={{ uri: img.url }} style={[partnerDetailStaticStyles.galleryImage, themed.galleryImage]} resizeMode="cover" />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <CommonDialogApp
        visible={confirmVisible}
        title="Desactivar patrocinador"
        message={`¿Estás seguro de que deseas desactivar "${sponsor.name}"?`}
        confirmText="Desactivar"
        onConfirm={() => { void handleDisable(); }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}


