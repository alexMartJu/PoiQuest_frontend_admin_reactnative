import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// dashboardStaticStyles + getDashboardStyles (drawer/index.tsx)
// ---------------------------------------------------------------------------
export const dashboardStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  chartsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  chartItem: {
    width: '48%',
  },
  chartItemMobile: {
    paddingHorizontal: 16,
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
  sectionTitle: {
    color: theme.colors.onSurface,
    fontWeight: '700' as any,
  },
});

// ---------------------------------------------------------------------------
