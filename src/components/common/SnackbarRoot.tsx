import React from 'react';
import { Portal } from 'react-native-paper';
import { useSnackbarStore } from '@/stores/snackbar.store';
import { SnackbarApp } from './SnackbarApp';

// ================== SNACKBAR ROOT ==================
// Componente global que se monta una sola vez en el layout raíz.
// Se suscribe al useSnackbarStore y renderiza SnackbarApp con los datos actuales.
// Permite mostrar notificaciones desde cualquier pantalla sin estado local.

export function SnackbarRoot() {
  const current = useSnackbarStore((state) => state.current);
  const visible = useSnackbarStore((state) => state.visible);
  const hide = useSnackbarStore((state) => state.hide);

  if (!current) return null;

  return (
    <Portal>
      <SnackbarApp
        visible={visible}
        message={current.message}
        variant={current.variant}
        duration={current.duration}
        actionLabel={current.actionLabel}
        onAction={current.onAction}
        onDismiss={hide}
      />
    </Portal>
  );
}
