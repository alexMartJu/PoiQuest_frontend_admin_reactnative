import { SplashScreen, useRouter, useSegments } from 'expo-router';
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { useUserStore } from '@/stores/user.store';
import { getMe } from '@/services/auth.service';

SplashScreen.preventAutoHideAsync();

// ================== AUTH CONTEXT ==================

type AuthState = {
  isLoggedIn: boolean;
  isReady: boolean;
  isAdmin: boolean;
};

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  isAdmin: false,
});

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const segments = useSegments();
  const { user, accessToken, setUser, clearUser } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  const isLoggedIn = useMemo(() => Boolean(user && accessToken), [user, accessToken]);
  const isAdmin = useMemo(() => user?.roles?.includes('admin') ?? false, [user]);

  // Espera a que el store esté hidratado
  useEffect(() => {
    const checkHydration = async () => {
      // Si el store ya está hidratado, marcar como ready
      if (typeof (useUserStore as any).persist?.hasHydrated === 'function') {
        const hydrated = (useUserStore as any).persist.hasHydrated();
        if (hydrated) {
          setIsReady(true);
          return;
        }
      }

      // Si no, esperar a que termine la hidratación
      if (typeof (useUserStore as any).persist?.onFinishHydration === 'function') {
        (useUserStore as any).persist.onFinishHydration(() => {
          setIsReady(true);
        });
      } else {
        // Si no hay persistencia, marcar como ready inmediatamente
        setIsReady(true);
      }
    };

    checkHydration();
  }, []);

  // Oculta el splash screen cuando esté ready
  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  // Valida la sesión cuando la app carga
  useEffect(() => {
    if (!isReady || !accessToken) return;

    const validateSession = async () => {
      try {
        // Intenta obtener el perfil del usuario para validar el token
        const userData = await getMe();
        // Actualiza el usuario con los datos más recientes
        setUser({
          userId: userData.userId,
          name: userData.name,
          lastname: userData.lastname,
          email: userData.email,
          avatarUrl: userData.avatarUrl,
          bio: userData.bio,
          roles: userData.roles,
        });
      } catch (error) {
        // Si falla, limpia la sesión
        console.error('Error validando sesión:', error);
        clearUser();
      }
    };

    validateSession();
  }, [isReady, accessToken]);

  // Maneja la navegación según el estado de autenticación
  useEffect(() => {
    if (!isReady) return;

    const inProtectedGroup = segments[0] === '(protected)';

    if (!isLoggedIn && inProtectedGroup) {
      // Si no está logueado y está en rutas protegidas, redirige a login
      router.replace('/login');
      return;
    }

    // Si está logueado pero NO es admin y está intentando acceder a rutas protegidas
    if (isLoggedIn && inProtectedGroup && !isAdmin) {
      // Invalidar sesión cliente y redirigir a login (opción segura)
      clearUser();
      router.replace('/login');
      return;
    }

    if (isLoggedIn && !inProtectedGroup) {
      // Si está logueado y no está en rutas protegidas, redirige al dashboard
      router.replace('/(protected)/(drawer)');
    }
  }, [isLoggedIn, isReady, router, segments, isAdmin, clearUser]);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
