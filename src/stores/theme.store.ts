import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================== THEME STORE ==================

interface ThemeState {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,

      setIsDark: (value) =>
        set({
          isDark: value,
        }),

      toggleTheme: () =>
        set((state) => ({
          isDark: !state.isDark,
        })),
    }),
    {
      name: 'theme-store-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
