import { PropsWithChildren, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuración del QueryClient con opciones adaptadas para mobile
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reintentar hasta 2 veces en caso de error de red (común en mobile)
      retry: 2,
      // Los datos son frescos durante 1 minuto (evita recargas innecesarias)
      staleTime: 1000 * 60,
      // Recargar al volver al primer plano (sincronización automática)
      refetchOnWindowFocus: true,
      // Recargar al reconectar (importante en mobile)
      refetchOnReconnect: true,
    },
  },
});

/**
 * Provider de React Query para gestionar datos remotos
 * Incluye integración con el ciclo de vida de la app en React Native
 */
export function QueryProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    // En web no necesitamos manejar el AppState
    if (Platform.OS === 'web') return;

    // Escuchar cambios de estado de la app (activa/segundo plano)
    const subscription = AppState.addEventListener('change', (status) => {
      // Cuando la app vuelve al primer plano, React Query refresca las queries
      focusManager.setFocused(status === 'active');
    });

    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
