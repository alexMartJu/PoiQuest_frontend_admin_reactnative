import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// dashboardStaticStyles + getDashboardStyles (drawer/index.tsx)
// ---------------------------------------------------------------------------
export const dashboardStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centerContent: {
    alignItems: 'center',
    gap: 12,
  },
  title: {},
  subtitle: {
    textAlign: 'center',
  },
});

export const getDashboardStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  iconColor: theme.colors.primary,
  title: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.headlineLarge.fontWeight as any,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
  },
});

// ---------------------------------------------------------------------------
