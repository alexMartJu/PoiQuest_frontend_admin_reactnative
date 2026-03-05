import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable, useWindowDimensions, Image } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { getPartnerCardStyles } from '@/styles/partners.styles';
import type { Sponsor } from '@/types/Partner';

interface SponsorCardAppProps {
  sponsor: Sponsor;
  onPress?: () => void;
}

export function SponsorCardApp({ sponsor, onPress }: SponsorCardAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnerCardStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const CARD_HEIGHT = 120;
  const IMAGE_WIDTH = isTablet ? 140 : 110;

  const primaryImage = sponsor.images?.find((img) => img.isPrimary) ?? sponsor.images?.[0];

  return (
    <Pressable onPress={onPress} style={staticStyles.pressable} disabled={!onPress}>
      <Card
        style={[
          staticStyles.card,
          themed.card,
          {
            height: CARD_HEIGHT,
            width: isTablet ? '80%' : '100%',
            maxWidth: isTablet ? Math.min(640, width - 240) : undefined,
            alignSelf: 'center',
          },
        ]}
      >
        <View style={staticStyles.cardContainer}>
          {/* Imagen o placeholder */}
          {primaryImage ? (
            <Image
              source={{ uri: primaryImage.url }}
              style={[staticStyles.cardImage, { width: IMAGE_WIDTH, height: CARD_HEIGHT }]}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                staticStyles.cardImage,
                staticStyles.imagePlaceholder,
                { width: IMAGE_WIDTH, height: CARD_HEIGHT, backgroundColor: theme.colors.tertiaryContainer },
              ]}
            >
              <MaterialCommunityIcons name="star-circle" size={40} color={theme.colors.tertiary} />
            </View>
          )}

          {/* Contenido */}
          <View style={staticStyles.cardContent}>
            <Text
              variant="titleMedium"
              style={[staticStyles.name, themed.partnerName]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {sponsor.name}
            </Text>

            <View style={{ flex: 1 }} />

            <View style={staticStyles.bottomInfo}>
              {sponsor.websiteUrl ? (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons name="web" size={15} color={themed.iconSecondary.color} />
                  <Text
                    variant="bodySmall"
                    style={[staticStyles.infoText, themed.typeText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {sponsor.websiteUrl}
                  </Text>
                </View>
              ) : null}

              {sponsor.contactEmail ? (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons name="email-outline" size={15} color={themed.iconVariant.color} />
                  <Text
                    variant="bodySmall"
                    style={[staticStyles.infoText, themed.infoText]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {sponsor.contactEmail}
                  </Text>
                </View>
              ) : null}

              {!sponsor.websiteUrl && !sponsor.contactEmail && (
                <View style={staticStyles.infoRow}>
                  <MaterialCommunityIcons name="star-circle" size={15} color={themed.iconVariant.color} />
                  <Text variant="bodySmall" style={[staticStyles.infoText, themed.infoText]}>
                    Patrocinador
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  cardContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  cardImage: {
    borderRadius: 0,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
  },
  name: {
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginVertical: 1,
  },
  infoText: {
    flex: 1,
  },
  bottomInfo: {
    alignSelf: 'stretch',
    marginTop: 'auto',
    paddingBottom: 4,
  },
});
