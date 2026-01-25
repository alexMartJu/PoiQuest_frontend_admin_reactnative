import { StyleSheet } from 'react-native';
import type { AppTheme } from '@/theme';

// preferencesStaticStyles + getPreferencesStyles (preferences.tsx)
// ---------------------------------------------------------------------------
// Estilos puramente estáticos (se crean una sola vez)
export const preferencesStaticStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {},
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  rowTitle: {
    marginTop: 0,
  },
  rowSubtitle: {
    marginTop: 4,
  },
});

// Estilos que dependen del theme (fábrica)
export const getPreferencesStyles = (theme: AppTheme) => ({
  container: {
    backgroundColor: theme.colors.background,
  },
  backButtonIcon: theme.colors.primary,
  title: {
    color: theme.colors.onSurface,
    fontWeight: theme.fonts.titleMedium.fontWeight as any,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
  },
  rowTitle: {
    color: theme.colors.onSurface,
    fontSize: theme.fonts.labelLarge.fontSize,
    fontWeight: theme.fonts.labelLarge.fontWeight as any,
  },
  rowSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: theme.fonts.bodySmall.fontSize,
  },
});

// ---------------------------------------------------------------------------
