import { MD3LightTheme, MD3DarkTheme, MD3Theme, useTheme } from 'react-native-paper';

// ================== APP PALETTE ==================
export interface AppPalette {
  primary: string;
  onPrimary: string;
  secondary: string;
  onSecondary: string;
  warning: string;
  onWarning: string;
  danger: string;
  onDanger: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
}

// Paleta para Tema claro (principal)
export const appPaletteLight: AppPalette = {
  primary: '#111827',
  onPrimary: '#FFFFFF',
  secondary: '#16A34A',
  onSecondary: '#FFFFFF',
  warning: '#FACC15',
  onWarning: '#111827',
  danger: '#DC2626',
  onDanger: '#FFFFFF',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

// Paleta para Tema oscuro
export const appPaletteDark: AppPalette = {
  primary: '#FFFFFF',
  onPrimary: '#0B0B0B',
  secondary: '#4ADE80',
  onSecondary: '#0B0B0B',
  warning: '#EAB308',
  onWarning: '#0B0B0B',
  danger: '#F87171',
  onDanger: '#0B0B0B',
  background: '#111827',
  surface: '#1F2937',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  border: '#374151',
};

// ================== EXTENDED MD3 THEME TYPE ==================
export interface ExtendedTheme extends MD3Theme {
  appPalette: AppPalette;
}

// ================== TYPOGRAPHY ==================
export const typography = {
  headlineLarge: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 36,
  },
  headlineMedium: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  headlineSmall: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  titleLarge: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: 0.25,
    lineHeight: 24,
  },
  titleSmall: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  bodyLarge: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.15,
    lineHeight: 22.4,
  },
  bodyMedium: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0.25,
    lineHeight: 19.6,
  },
  bodySmall: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
    lineHeight: 16.8,
  },
  labelLarge: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.1,
    lineHeight: 20,
  },
  labelMedium: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
    lineHeight: 16,
  },
  // Mapeos adicionales requeridos por MD3Typescale
  displayLarge: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 36,
  },
  displayMedium: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 32,
  },
  displaySmall: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  
  default: {
    fontFamily: 'Roboto_400Regular',
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
};

// ================== LIGHT THEME ==================
export const lightTheme: ExtendedTheme = {
  ...MD3LightTheme,
  appPalette: appPaletteLight,
  colors: {
    ...MD3LightTheme.colors,
    primary: appPaletteLight.primary,
    onPrimary: appPaletteLight.onPrimary,
    secondary: appPaletteLight.secondary,
    onSecondary: appPaletteLight.onSecondary,
    surface: appPaletteLight.surface,
    onSurface: appPaletteLight.textPrimary,
    background: appPaletteLight.background,
    onBackground: appPaletteLight.textPrimary,
    error: appPaletteLight.danger,
    onError: appPaletteLight.onDanger,
    outline: appPaletteLight.border,
    surfaceVariant: appPaletteLight.surface,
    onSurfaceVariant: appPaletteLight.textSecondary,
    // Contenedores
    primaryContainer: `${appPaletteLight.primary}26`, // 15% opacity
    onPrimaryContainer: appPaletteLight.onPrimary,
    secondaryContainer: `${appPaletteLight.secondary}26`,
    onSecondaryContainer: appPaletteLight.onSecondary,
    // Superficies elevadas
    elevation: {
      level0: 'transparent',
      level1: appPaletteLight.surface,
      level2: appPaletteLight.surface,
      level3: appPaletteLight.surface,
      level4: appPaletteLight.surface,
      level5: appPaletteLight.surface,
    },
  },
  fonts: typography,
  roundness: 12,
};

// ================== DARK THEME ==================
export const darkTheme: ExtendedTheme = {
  ...MD3DarkTheme,
  appPalette: appPaletteDark,
  colors: {
    ...MD3DarkTheme.colors,
    primary: appPaletteDark.primary,
    onPrimary: appPaletteDark.onPrimary,
    secondary: appPaletteDark.secondary,
    onSecondary: appPaletteDark.onSecondary,
    surface: appPaletteDark.surface,
    onSurface: appPaletteDark.textPrimary,
    background: appPaletteDark.background,
    onBackground: appPaletteDark.textPrimary,
    error: appPaletteDark.danger,
    onError: appPaletteDark.onDanger,
    outline: appPaletteDark.border,
    surfaceVariant: appPaletteDark.surface,
    onSurfaceVariant: appPaletteDark.textSecondary,
    // Contenedores
    primaryContainer: `${appPaletteDark.primary}26`,
    onPrimaryContainer: appPaletteDark.onPrimary,
    secondaryContainer: `${appPaletteDark.secondary}26`,
    onSecondaryContainer: appPaletteDark.onSecondary,
    // Superficies elevadas
    elevation: {
      level0: 'transparent',
      level1: appPaletteDark.surface,
      level2: appPaletteDark.surface,
      level3: appPaletteDark.surface,
      level4: appPaletteDark.surface,
      level5: appPaletteDark.surface,
    },
  },
  fonts: typography,
  roundness: 12,
};

// ================== SPACING ==================
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ================== BORDER RADIUS ==================
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Tipo exportado para tipado del tema en la app
export type AppTheme = typeof lightTheme;

// Hook tipado para usar el theme con useTheme()
export const useAppTheme = () => useTheme<AppTheme>();
