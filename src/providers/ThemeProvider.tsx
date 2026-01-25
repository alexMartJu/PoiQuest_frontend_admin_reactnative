import React, { createContext, useContext, useMemo } from 'react';
import { PaperProvider, useTheme as usePaperTheme } from 'react-native-paper';
import { useThemeStore } from '@/stores/theme.store';
import { lightTheme, darkTheme, AppTheme } from '@/theme';

// ================== THEME CONTEXT ==================

type ThemeContextValue = {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark, setIsDark, toggleTheme } = useThemeStore();
  const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark]);

  const value = useMemo(
    () => ({
      isDark,
      setIsDark,
      toggleTheme,
    }),
    [isDark, setIsDark, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return ctx;
}

// Hook para acceder al tema de Paper con tipos correctos
export const useAppTheme = () => usePaperTheme<AppTheme>();
