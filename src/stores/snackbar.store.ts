import { create } from 'zustand';

// ================== SNACKBAR STORE ==================
// Estado global para notificaciones no intrusivas (snackbars).
// No necesita persistencia: las notificaciones son efímeras por naturaleza.
// Uso: useSnackbarStore.getState().show({ message: '...', variant: 'success' })

export type SnackbarVariant = 'success' | 'error' | 'info' | 'warning';

interface SnackbarItem {
  message: string;
  variant: SnackbarVariant;
  duration?: number;
  actionLabel?: string;
  onAction?: () => void;
}

interface SnackbarState {
  current: SnackbarItem | null;
  visible: boolean;

  show: (item: SnackbarItem) => void;
  hide: () => void;
}

export const useSnackbarStore = create<SnackbarState>()((set) => ({
  current: null,
  visible: false,

  show: (item) =>
    set({
      current: item,
      visible: true,
    }),

  hide: () =>
    set({
      visible: false,
    }),
}));
