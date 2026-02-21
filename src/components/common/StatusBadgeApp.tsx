import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';

// ================== STATUS BADGE APP ==================
// Badge de estado reutilizable con icono opcional y variantes de color.
// Pensado para indicar estados de entidades (activo, deshabilitado, etc.)
// en cualquier pantalla de la aplicación.

export type StatusBadgeVariant = 'success' | 'danger' | 'warning' | 'neutral' | 'primary';
export type StatusBadgeSize = 'sm' | 'md';

interface StatusBadgeAppProps {
  label: string;
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  variant?: StatusBadgeVariant;
  size?: StatusBadgeSize;
}

export function StatusBadgeApp({
  label,
  icon,
  variant = 'neutral',
  size = 'sm',
}: StatusBadgeAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getStatusBadgeStyles(theme), [theme]);

  const variantStyle = themed.variants[variant];
  const isSm = size === 'sm';

  return (
    <View
      style={[
        staticStyles.badge,
        isSm ? staticStyles.badgeSm : staticStyles.badgeMd,
        variantStyle.badge,
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={isSm ? 11 : 13}
          color={variantStyle.iconColor}
        />
      )}
      <Text
        style={[
          isSm ? staticStyles.labelSm : staticStyles.labelMd,
          variantStyle.label,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

const staticStyles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  labelMd: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
});

const getStatusBadgeStyles = (theme: AppTheme) => ({
  variants: {
    success: {
      badge: {
        backgroundColor: `${theme.appPalette.secondary}12`,
        borderColor: `${theme.appPalette.secondary}38`,
      },
      label: { color: theme.appPalette.secondary },
      iconColor: theme.appPalette.secondary,
    },
    danger: {
      badge: {
        backgroundColor: `${theme.appPalette.danger}12`,
        borderColor: `${theme.appPalette.danger}38`,
      },
      label: { color: theme.appPalette.danger },
      iconColor: theme.appPalette.danger,
    },
    warning: {
      badge: {
        backgroundColor: `${theme.appPalette.warning}18`,
        borderColor: `${theme.appPalette.warning}50`,
      },
      label: { color: theme.appPalette.onWarning },
      iconColor: theme.appPalette.onWarning,
    },
    neutral: {
      badge: {
        backgroundColor: `${theme.colors.onSurfaceVariant}10`,
        borderColor: `${theme.colors.onSurfaceVariant}30`,
      },
      label: { color: theme.colors.onSurfaceVariant },
      iconColor: theme.colors.onSurfaceVariant,
    },
    primary: {
      badge: {
        backgroundColor: `${theme.colors.primary}10`,
        borderColor: `${theme.colors.primary}30`,
      },
      label: { color: theme.colors.primary },
      iconColor: theme.colors.primary,
    },
  },
});
