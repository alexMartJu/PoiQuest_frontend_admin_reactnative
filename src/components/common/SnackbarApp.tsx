import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import type { AppTheme } from '@/theme';
import type { SnackbarVariant } from '@/stores/snackbar.store';

// ================== SNACKBAR APP ==================
// Snackbar reutilizable con variantes de color e icono automático.
// Soporta mensaje, acción opcional y duración configurable.
// Componente pensado para notificaciones no intrusivas (éxito, error, info, aviso).
// El tipo SnackbarVariant se define en snackbar.store.ts (fuente única de verdad).

interface SnackbarAppProps {
  visible: boolean;
  message: string;
  variant?: SnackbarVariant;
  duration?: number;
  onDismiss: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const VARIANT_ICONS: Record<
  SnackbarVariant,
  React.ComponentProps<typeof MaterialCommunityIcons>['name']
> = {
  success: 'check-circle-outline',
  error: 'alert-circle-outline',
  info: 'information-outline',
  warning: 'alert-outline',
};

export function SnackbarApp({
  visible,
  message,
  variant = 'info',
  duration = 3000,
  onDismiss,
  actionLabel,
  onAction,
}: SnackbarAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getSnackbarStyles(theme), [theme]);

  const variantStyle = themed.variants[variant];
  const icon = VARIANT_ICONS[variant];

  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={[staticStyles.snackbar, variantStyle.snackbar]}
      wrapperStyle={staticStyles.snackbarWrapper}
      contentStyle={staticStyles.snackbarContent}
      action={
        actionLabel && onAction
          ? {
              label: actionLabel,
              labelStyle: variantStyle.actionLabel,
              onPress: onAction,
            }
          : undefined
      }
    >
      <View style={staticStyles.content}>
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color={variantStyle.iconColor}
        />
        <Text style={[staticStyles.message, variantStyle.message]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Snackbar>
  );
}

const staticStyles = StyleSheet.create({
  snackbarWrapper: {
    zIndex: 9999,
    elevation: 9999,
  },
  snackbar: {
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  snackbarContent: {
    paddingHorizontal: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
});

const getSnackbarStyles = (theme: AppTheme) => ({
  variants: {
    success: {
      snackbar: { backgroundColor: theme.appPalette.secondary },
      message: { color: theme.appPalette.onSecondary },
      iconColor: theme.appPalette.onSecondary,
      actionLabel: { color: `${theme.appPalette.onSecondary}CC` },
    },
    error: {
      snackbar: { backgroundColor: theme.appPalette.danger },
      message: { color: theme.appPalette.onDanger },
      iconColor: theme.appPalette.onDanger,
      actionLabel: { color: `${theme.appPalette.onDanger}CC` },
    },
    info: {
      snackbar: { backgroundColor: theme.colors.primary },
      message: { color: theme.colors.onPrimary },
      iconColor: theme.colors.onPrimary,
      actionLabel: { color: `${theme.colors.onPrimary}CC` },
    },
    warning: {
      snackbar: { backgroundColor: theme.appPalette.warning },
      message: { color: theme.appPalette.onWarning },
      iconColor: theme.appPalette.onWarning,
      actionLabel: { color: `${theme.appPalette.onWarning}CC` },
    },
  },
});
