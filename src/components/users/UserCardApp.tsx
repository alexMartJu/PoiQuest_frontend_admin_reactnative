import React, { useMemo } from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { StatusBadgeApp, IconButtonApp } from '@/components/common';
import type { BackendUser } from '@/types/User';
import { UserStatus } from '@/types/User';
import type { AppTheme } from '@/theme';

interface UserCardAppProps {
  user: BackendUser;
  onToggleStatus: (profileUuid: string) => void;
  isTogglingStatus?: boolean;
}

export function UserCardApp({
  user,
  onToggleStatus,
  isTogglingStatus = false,
}: UserCardAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getUserCardStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const isActive = user.status === UserStatus.ACTIVE;

  const displayName =
    [user.profile?.name, user.profile?.lastname].filter(Boolean).join(' ') ||
    'Sin nombre';

  const initials = [
    user.profile?.name?.[0] ?? '',
    user.profile?.lastname?.[0] ?? '',
  ]
    .join('')
    .toUpperCase() || '?';

  const roleName =
    user.roles
      .map((r) => {
        const n = r.name;
        return n.charAt(0).toUpperCase() + n.slice(1);
      })
      .join(', ') || 'Sin rol';

  return (
    <Card
      style={[
        staticStyles.card,
        themed.card,
        {
          width: isTablet ? '80%' : '100%',
          maxWidth: isTablet ? Math.min(640, width - 240) : undefined,
          alignSelf: 'center',
        },
      ]}
    >
      {/* Contenedor relativo para los elementos absolutos */}
      <View>
        {/* ── Contenido principal: Avatar + info ── */}
        <View style={staticStyles.cardContent}>
          {/* ── Sección izquierda: Avatar + indicator ── */}
          <View style={staticStyles.avatarWrapper}>
            <Avatar.Text
              size={52}
              label={initials}
              style={[
                staticStyles.avatar,
                isActive ? themed.avatarActive : themed.avatarDisabled,
              ]}
              labelStyle={themed.avatarLabel}
            />
            {/* Indicator de estado */}
            <View
              style={[
                staticStyles.statusDot,
                isActive ? themed.dotActive : themed.dotDisabled,
              ]}
            />
          </View>

          {/* ── Sección central: info ── */}
          <View style={staticStyles.infoSection}>
            <Text
              variant="titleSmall"
              style={[staticStyles.name, themed.name]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            <Text
              variant="bodySmall"
              style={[staticStyles.email, themed.email]}
              numberOfLines={1}
            >
              {user.email}
            </Text>

            <View style={staticStyles.metaRow}>
              <MaterialCommunityIcons
                name="shield-account-outline"
                size={14}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={[staticStyles.metaText, themed.meta]} numberOfLines={1}>
                {roleName}
              </Text>
            </View>

            {user.profile && (
              <View style={staticStyles.metaRow}>
                <MaterialCommunityIcons
                  name="star-circle-outline"
                  size={14}
                  color={theme.colors.secondary}
                />
                <Text style={[staticStyles.metaText, themed.points]} numberOfLines={1}>
                  Nv. {user.profile.level} · {user.profile.totalPoints} pts
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Badge de estado: esquina superior derecha ── */}
        <View style={staticStyles.badgeTopRight} pointerEvents="none">
          <StatusBadgeApp
            label={isActive ? 'Activo' : 'Deshabilitado'}
            icon={isActive ? 'check-circle-outline' : 'cancel'}
            variant={isActive ? 'success' : 'neutral'}
            size="sm"
          />
        </View>

        {/* ── Botón de acción: esquina inferior derecha ── */}
        <View style={staticStyles.buttonBottomRight}>
          <IconButtonApp
            icon={isActive ? 'account-cancel' : 'account-check'}
            mode="contained"
            size={18}
            onPress={() => {
              if (user.profile) onToggleStatus(user.profile.uuid);
            }}
            loading={isTogglingStatus}
            disabled={isTogglingStatus || !user.profile}
            containerColor={
              isActive ? theme.appPalette.danger : theme.colors.secondary
            }
            iconColor={
              isActive ? theme.appPalette.onDanger : theme.colors.onSecondary
            }
            accessibilityLabel={isActive ? 'Deshabilitar usuario' : 'Habilitar usuario'}
          />
        </View>
      </View>
    </Card>
  );
}

const staticStyles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    // Espacio a la derecha para que el texto no quede bajo el botón
    paddingRight: 52,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  avatar: {
    alignSelf: 'flex-start',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  infoSection: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  buttonBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});

const getUserCardStyles = (theme: AppTheme) => ({
  card: {
    backgroundColor: theme.colors.surface,
  },
  avatarActive: {
    backgroundColor: theme.colors.primary,
  },
  avatarDisabled: {
    backgroundColor: theme.colors.onSurfaceVariant,
  },
  avatarLabel: {
    color: theme.colors.onPrimary,
    fontWeight: '700' as const,
  },
  dotActive: {
    backgroundColor: theme.appPalette.secondary,
    borderColor: theme.colors.surface,
  },
  dotDisabled: {
    backgroundColor: theme.colors.onSurfaceVariant,
    borderColor: theme.colors.surface,
  },
  name: {
    color: theme.colors.onSurface,
  },
  email: {
    color: theme.colors.onSurfaceVariant,
  },
  meta: {
    color: theme.colors.onSurfaceVariant,
  },
  points: {
    color: theme.colors.secondary,
  },
});
