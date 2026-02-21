import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Portal, Text, Button } from 'react-native-paper';
import { useAppTheme } from '@/providers/ThemeProvider';
import { AppTheme } from '@/theme';

export type DialogConfirmVariant = 'danger' | 'secondary' | 'primary';

interface CommonDialogAppProps {
  visible: boolean;
  title: string;
  message: string | React.ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  cancelDisabled?: boolean;
  confirmLoading?: boolean;
  confirmVariant?: DialogConfirmVariant;
}

export function CommonDialogApp({
  visible,
  title,
  message,
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
  onCancel,
  onConfirm,
  cancelDisabled = false,
  confirmLoading = false,
  confirmVariant = 'danger',
}: CommonDialogAppProps) {
  const theme = useAppTheme();
  const themed = useMemo(() => getDialogStyles(theme), [theme]);

  const confirmBg =
    confirmVariant === 'secondary'
      ? theme.colors.secondary
      : confirmVariant === 'primary'
        ? theme.colors.primary
        : theme.colors.error;

  const confirmFg =
    confirmVariant === 'secondary'
      ? theme.colors.onSecondary
      : confirmVariant === 'primary'
        ? theme.colors.onPrimary
        : theme.colors.onError;

  const titleColor =
    confirmVariant === 'secondary'
      ? theme.colors.secondary
      : confirmVariant === 'primary'
        ? theme.colors.primary
        : theme.colors.error;

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={themed.dialog}>
        <View style={themed.title}>
          <Text style={[staticStyles.titleTextBase, themed.titleText, { color: titleColor }]}>{title}</Text>
        </View>
        <View style={themed.content}>
          {typeof message === 'string' ? (
            <Text style={[staticStyles.messageTextBase, themed.messageText]}>{message}</Text>
          ) : (
            message
          )}
        </View>
        <View style={[staticStyles.actionsBase, themed.actions]}>
          <Button
            mode="outlined"
            onPress={onCancel}
            disabled={cancelDisabled || confirmLoading}
            style={[staticStyles.buttonBase, themed.cancelButton]}
            labelStyle={themed.cancelButtonLabel}
          >
            {cancelText}
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            loading={confirmLoading}
            disabled={confirmLoading}
            buttonColor={confirmBg}
            textColor={confirmFg}
            style={[staticStyles.buttonBase, themed.confirmButton]}
            labelStyle={themed.confirmButtonLabel}
          >
            {confirmText}
          </Button>
        </View>
      </Dialog>
    </Portal>
  );
}

const staticStyles = StyleSheet.create({
  titleTextBase: {
    lineHeight: 28,
  },
  messageTextBase: {
    lineHeight: 20,
  },
  actionsBase: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonBase: {
    flex: 1,
  },
});

const getDialogStyles = (theme: AppTheme) =>
  StyleSheet.create({
    dialog: {
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.surface,
    },
    title: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    titleText: {
      ...staticStyles.titleTextBase,
      fontSize: theme.fonts.titleLarge.fontSize,
      fontWeight: theme.fonts.titleLarge.fontWeight as any,
    },
    content: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    messageText: {
      ...staticStyles.messageTextBase,
      color: theme.colors.onSurfaceVariant,
      fontSize: theme.fonts.bodyMedium.fontSize,
    },
    actions: {
      ...staticStyles.actionsBase,
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.md,
      paddingTop: theme.spacing.sm,
    },
    cancelButton: {
      ...staticStyles.buttonBase,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    cancelButtonLabel: {
      color: theme.colors.onSurface,
      fontSize: theme.fonts.labelLarge.fontSize,
      fontWeight: theme.fonts.labelLarge.fontWeight as any,
      paddingVertical: theme.spacing.xs,
    },
    confirmButton: {
      ...staticStyles.buttonBase,
      marginLeft: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
    },
    confirmButtonLabel: {
      fontSize: theme.fonts.labelLarge.fontSize,
      fontWeight: theme.fonts.labelLarge.fontWeight as any,
      paddingVertical: theme.spacing.xs,
    },
  });
