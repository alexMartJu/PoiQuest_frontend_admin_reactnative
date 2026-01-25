import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import type { User, AuthTokens } from '@/types/User';

// ================== USER STORE ==================

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

// Storage seguro para nativo usando SecureStore
const nativeSecureStorage: StateStorage = {
  getItem: async (name) => {
    const SecureStore = require('expo-secure-store') as typeof import('expo-secure-store');
    const value = await SecureStore.getItemAsync(name);
    return value ?? null;
  },
  setItem: async (name, value) => {
    const SecureStore = require('expo-secure-store') as typeof import('expo-secure-store');
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name) => {
    const SecureStore = require('expo-secure-store') as typeof import('expo-secure-store');
    await SecureStore.deleteItemAsync(name);
  },
};

const storage = createJSONStorage(() => nativeSecureStorage);

// Crea el store con persistencia
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      setUser: (user) =>
        set({
          user,
        }),

      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        }),

      setAccessToken: (token) =>
        set({
          accessToken: token,
        }),

      clearUser: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      isAuthenticated: () => {
        const state = get();
        return Boolean(state.user && state.accessToken);
      },

      isAdmin: () => {
        const state = get();
        return state.user?.roles?.includes('admin') ?? false;
      },
    }),
    {
      name: 'user-store-v1',
      storage,
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
